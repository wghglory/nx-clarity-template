import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, HostListener, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { CardState, cardStateHandler, RDEList } from '@seed/rde';
import { LoadingOrErrorComponent } from '@seed/shared/ui';
import { startWithTap } from '@seed/shared/utils';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BehaviorSubject, catchError, combineLatest, EMPTY, finalize, scan, Subject, switchMap, withLatestFrom } from 'rxjs';

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
  currentPage$ = new BehaviorSubject<number>(1);

  filterName$ = new BehaviorSubject<string | null>(null);

  // loadMore --> change page --> get paged products --> scan
  products$ = this.currentPage$.pipe(
    switchMap((page) => {
      const params = cardStateHandler({ current: page });
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
  productsWithFilter$ = combineLatest([this.currentPage$, this.filterName$]).pipe(
    switchMap(([page, name]) => {
      const state = { current: page } as CardState;
      if (name) {
        state.filters = [{ property: 'name', value: name }];
      }
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
    withLatestFrom(this.currentPage$),
    // based on current page, reset
    // https://stackblitz.com/edit/rxjs-search-offset-k2p6ps?file=src%2Fapp%2Fapp.component.ts
    // another approach: https://codesandbox.io/s/clear-scan-qsbeuc?file=/src/app/app.component.ts
    scan((acc, [rde, page]) => {
      return page === 1 ? rde : { ...acc, values: [...acc.values, ...rde.values], page };
    }, {} as RDEList<Product>)
  );

  deleteProduct(product: Product) {
    this.productStateService.selectItem(product);
    this.deleteEvent.emit();
  }

  loadMore(pageCount: number) {
    if (this.currentPage$.value < pageCount) {
      this.currentPage$.next(this.currentPage$.value + 1);
    }
  }

  filterByProductName(name: string) {
    this.filterName$.next(name);
    this.currentPage$.next(1); // this will trigger API twice, but due to switchMap, previous is cancelled, every time new filter will force to start with page 1; other thought is to use a object containing filter and current page together like datagrid state.
  }
}