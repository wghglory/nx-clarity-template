import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule, ClrDatagridStateInterface } from '@clr/angular';
import { stateHandler } from '@seed/rde';
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

  private errorSource = new Subject<HttpErrorResponse>();
  error$ = this.errorSource.asObservable();

  private loadingSource = new Subject<boolean>();
  loading$ = this.loadingSource.asObservable();

  private pageSource = new BehaviorSubject<ClrDatagridStateInterface>({ page: { current: 1, size: 9 } });
  page$ = this.pageSource.asObservable();

  // loadMore --> change page --> get paged products --> scan
  products$ = this.page$.pipe(
    switchMap((pageInfo) => {
      const params = stateHandler(pageInfo);
      return this.productService.getProducts(params).pipe(
        startWithTap(() => this.loadingSource.next(true)),
        finalize(() => this.loadingSource.next(false)),
        catchError((err) => {
          this.errorSource.next(err);
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
    const prevPage = this.pageSource.value;
    // eslint-disable-next-line
    this.pageSource.next({ page: { current: prevPage.page?.current! + 1, size: prevPage.page?.size! } });
  }
}
