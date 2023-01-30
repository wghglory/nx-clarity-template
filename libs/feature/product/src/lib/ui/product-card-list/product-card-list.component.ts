import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { cardStateHandler } from '@seed/rde';
import { LoadingOrErrorComponent } from '@seed/shared/ui';
import { startWithTap } from '@seed/shared/utils';
import { BehaviorSubject, catchError, combineLatest, EMPTY, finalize, merge, pairwise, scan, startWith, Subject, switchMap } from 'rxjs';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ProductStateService } from '../../services/product-state.service';

@Component({
  selector: 'seed-product-card-list',
  standalone: true,
  imports: [CommonModule, ClarityModule, RouterModule, LoadingOrErrorComponent],
  templateUrl: './product-card-list.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardListComponent {
  constructor(private productService: ProductService, private productStateService: ProductStateService) {}

  @Output() deleteEvent = new EventEmitter();

  // products$ = this.productStateService.refreshAction$.pipe(
  //   switchMap(() => {
  //     return this.productService.products$;
  //   }),
  //   catchError((err) => {
  //     this.error$.next(err);
  //     return EMPTY;
  //   })
  // );

  pageSize = 9;

  error$ = new Subject<HttpErrorResponse>();
  loading$ = new Subject<boolean>();
  currentPage$ = new BehaviorSubject<number>(1);

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

  deleteProduct(product: Product) {
    this.productStateService.selectItem(product);
    this.deleteEvent.emit();
  }

  loadMore() {
    this.currentPage$.next(this.currentPage$.value + 1);
  }
  }
}
