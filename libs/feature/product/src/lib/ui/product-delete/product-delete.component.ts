import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ClarityModule } from '@clr/angular';
import {
  catchError,
  combineLatest,
  EMPTY,
  filter,
  finalize,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

import { ProductService } from '../../services/product.service';
import { ProductStateService } from './../../services/product-state.service';

@Component({
  selector: 'seed-product-delete',
  standalone: true,
  imports: [CommonModule, ClarityModule],
  templateUrl: './product-delete.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDeleteComponent {
  constructor(
    private productService: ProductService,
    public productStateService: ProductStateService
  ) {}

  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  private confirmAction = new Subject<void>();

  private errorSource = new Subject<HttpErrorResponse | null>();
  error$ = this.errorSource.asObservable();
  private loadingSource = new Subject<boolean>();
  loading$ = this.loadingSource.asObservable();

  delete$ = combineLatest([
    this.productStateService.selectedProduct$.pipe(filter(Boolean)),
    this.confirmAction,
  ]).pipe(
    switchMap(([product, _]) =>
      this.productService.deleteProduct(product.id).pipe(
        finalize(() => this.loadingSource.next(false)),
        catchError((err) => {
          this.errorSource.next(err);
          return EMPTY;
        })
      )
    ),
    tap(() => {
      this.close();
      this.productStateService.selectProduct(null);
      this.productStateService.refreshList();
    })
  );

  close() {
    this.openChange.emit(false);
  }

  confirm() {
    this.loadingSource.next(true);
    this.errorSource.next(null);
    this.confirmAction.next();
  }
}
