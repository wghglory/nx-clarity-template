import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { CardState, cardStateHandler, RDEList } from '@seed/rde';
import { LoadingOrErrorComponent } from '@seed/shared/ui';
import { startWithTap } from '@seed/shared/utils';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BehaviorSubject, catchError, concatMap, EMPTY, finalize, scan, Subject, withLatestFrom } from 'rxjs';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ProductStateService } from '../../services/product-state.service';

@Component({
  selector: 'seed-product-infinite-scroll',
  standalone: true,
  imports: [CommonModule, InfiniteScrollModule, ClarityModule, RouterModule, LoadingOrErrorComponent],
  templateUrl: './product-infinite-scroll.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductInfiniteScrollComponent {
  constructor(private productService: ProductService, private productStateService: ProductStateService) {}

  @Output() deleteEvent = new EventEmitter();

  pageSize = 9;

  error$ = new Subject<HttpErrorResponse>();
  loading$ = new Subject<boolean>();

  state$ = new BehaviorSubject<CardState>({ current: 1, filters: [] });

  // loadMore --> change page --> get paged products --> scan
  products$ = this.state$.pipe(
    concatMap((state) => {
      const params = cardStateHandler(state);
      return this.productService.getProducts(params).pipe(
        startWithTap(() => this.loading$.next(true)),
        finalize(() => this.loading$.next(false)),
        catchError((err) => {
          this.error$.next(err);
          return EMPTY;
        })
      );
    }),
    scan((acc, curr) => {
      return { ...acc, values: [...acc.values, ...curr.values] };
    })
  );

  // filter and load more
  productsWithFilter$ = this.state$.pipe(
    concatMap((state) => {
      const params = cardStateHandler(state);

      return this.productService.getProducts(params).pipe(
        startWithTap(() => this.loading$.next(true)),
        finalize(() => this.loading$.next(false)),
        catchError((err) => {
          this.error$.next(err);
          return EMPTY;
        })
      );
    }),
    withLatestFrom(this.state$),
    // based on current page, reset
    // https://stackblitz.com/edit/rxjs-search-offset-k2p6ps?file=src%2Fapp%2Fapp.component.ts
    // another approach: https://codesandbox.io/s/clear-scan-qsbeuc?file=/src/app/app.component.ts
    scan((acc, [rde, state]) => {
      return state.current === 1 ? rde : { ...acc, values: [...acc.values, ...rde.values], page: state.current };
    }, {} as RDEList<Product>)
  );

  deleteProduct(product: Product) {
    this.productStateService.selectItem(product);
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
