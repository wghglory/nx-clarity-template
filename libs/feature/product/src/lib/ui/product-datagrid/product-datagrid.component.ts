import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule, ClrDatagridStateInterface } from '@clr/angular';
import { stateHandler } from '@seed/shared/utils';
import { isEqual } from 'lodash';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  debounce,
  distinctUntilChanged,
  EMPTY,
  finalize,
  map,
  pairwise,
  shareReplay,
  Subject,
  switchMap,
  timer,
} from 'rxjs';

import { ProductService } from '../../services/product.service';
import { ProductStateService } from '../../services/product-state.service';

@Component({
  selector: 'seed-product-datagrid',
  standalone: true,
  imports: [CommonModule, RouterModule, ClarityModule],
  templateUrl: './product-datagrid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDatagridComponent {
  constructor(
    private productService: ProductService,
    private productStateService: ProductStateService
  ) {}
  private loadingSource = new BehaviorSubject<boolean>(true);
  loading$ = this.loadingSource.asObservable();
  private errorSub = new Subject<HttpErrorResponse>();
  error$ = this.errorSub.asObservable();

  private dgSource = new BehaviorSubject<ClrDatagridStateInterface | null>(
    null
  );

  products$ = combineLatest([
    this.dgSource.pipe(pairwise()), // prepare old and new states filters in order to delay
    this.productStateService.refreshAction$, // anything else like delete, refresh button to refresh the data
  ]).pipe(
    debounce(([[prev, curr], refreshAction]) => {
      // only when filter changes, timer(500) to defer to simulate typeahead.
      return isEqual(prev?.filters, curr?.filters) ? timer(0) : timer(500);
    }),
    map(([[prev, curr], refreshAction]) => curr),
    distinctUntilChanged(isEqual),
    switchMap((state) => {
      const params = stateHandler(state);
      return this.productService.getProducts(params).pipe(
        finalize(() => {
          this.loadingSource.next(false);
        }),
        catchError((err) => {
          this.errorSub.next(err);
          return EMPTY;
        })
      );
    }),
    shareReplay(1)
  );

  // will be called right after initially datagrid loads data
  // 1st: BehaviorSubject emit null
  // 2nd: emit default state: { "page": { "from": -1,"to": -1,"size": 10,"current": 1 }}
  refresh(state: ClrDatagridStateInterface) {
    this.loadingSource.next(true);
    this.dgSource.next(state);
  }
}
