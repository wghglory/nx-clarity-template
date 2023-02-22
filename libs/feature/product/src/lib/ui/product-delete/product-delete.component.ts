import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { catchError, EMPTY, finalize, Subject, switchMap, tap } from 'rxjs';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'seed-product-delete',
  standalone: true,
  imports: [CommonModule, ClarityModule],
  templateUrl: './product-delete.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDeleteComponent {
  constructor(private productService: ProductService) {}

  @Input() product: Product = {} as Product;

  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  @Output() refreshData = new EventEmitter();

  private confirmAction = new Subject<void>();

  private errorSub = new Subject<HttpErrorResponse | null>();
  error$ = this.errorSub.asObservable();
  private loadingSub = new Subject<boolean>();
  loading$ = this.loadingSub.asObservable();

  delete$ = this.confirmAction.pipe(
    switchMap(() =>
      this.productService.deleteProduct(this.product.id).pipe(
        finalize(() => this.loadingSub.next(false)),
        catchError(err => {
          this.errorSub.next(err);
          return EMPTY;
        }),
      ),
    ),
    tap(() => {
      this.close();
      this.refreshData.emit();
    }),
  );

  close() {
    this.openChange.emit(false);
  }

  confirm() {
    this.loadingSub.next(true);
    this.errorSub.next(null);
    this.confirmAction.next();
  }
}
