import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { RDEList } from '@seed/shared/models';
import { SpinnerComponent } from '@seed/shared/ui';
import { CardState, cardStateHandler, startWithTap } from '@seed/shared/utils';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BehaviorSubject, catchError, concatMap, EMPTY, finalize, scan, Subject, tap, withLatestFrom } from 'rxjs';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'seed-product-infinite-scroll',
  standalone: true,
  imports: [CommonModule, InfiniteScrollModule, ClarityModule, RouterModule, SpinnerComponent],
  templateUrl: './product-infinite-scroll.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductInfiniteScrollComponent {
  constructor(private productService: ProductService) {}

  @Output() deleteEvent = new EventEmitter();

  pageSize = 9;

  error$ = new Subject<HttpErrorResponse | null>();
  loading$ = new Subject<boolean>();

  state$ = new BehaviorSubject<CardState>({ current: 1, filters: [] });

  refresh$ = this.productService.refreshAction$.pipe(
    tap(() => {
      this.state$.next({ ...this.state$.value, current: 1 });
    }),
  );

  // loadMore --> change page --> get paged products --> scan
  // filter and load more
  productsWithFilter$ = this.state$.pipe(
    concatMap(state => {
      const params = cardStateHandler(state);

      return this.productService.getProducts(params).pipe(
        startWithTap(() => {
          this.loading$.next(true);
          this.error$.next(null); // error will be covered by next request
        }),
        finalize(() => this.loading$.next(false)),
        catchError(err => {
          this.error$.next(err);
          return EMPTY;
        }),
      );
    }),
    withLatestFrom(this.state$),
    // based on current page, reset
    // https://stackblitz.com/edit/rxjs-search-offset-k2p6ps?file=src%2Fapp%2Fapp.component.ts
    // another approach: https://codesandbox.io/s/clear-scan-qsbeuc?file=/src/app/app.component.ts
    scan((acc, [rde, state]) => {
      return state.current === 1 ? rde : { ...acc, values: [...acc.values, ...rde.values], page: state.current };
    }, {} as RDEList<Product>),
  );

  deleteProduct(product: Product) {
    this.productService.selectItem(product);
    this.deleteEvent.emit();
  }

  loadMore(pageCount: number) {
    if (this.state$.value.current < pageCount) {
      this.state$.next({ ...this.state$.value, current: this.state$.value.current + 1 });
    }
  }

  filterByProductName(name: string) {
    this.state$.next({ current: 1, filters: [{ property: 'name', value: name }] });
  }
}
