import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { catchError, combineLatest, EMPTY, filter, finalize, Subject, switchMap, tap } from 'rxjs';

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
  constructor(public productService: ProductService) {}

  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  private saveAction = new Subject<void>();

  private errorSource = new Subject<HttpErrorResponse | null>();
  error$ = this.errorSource.asObservable();
  private loadingSource = new Subject<boolean>();
  loading$ = this.loadingSource.asObservable();

  delete$ = combineLatest([this.productService.selectedItem$.pipe(filter(Boolean)), this.saveAction]).pipe(
    switchMap(([product, _]) => {
      return this.productService.deleteProduct(product.id).pipe(
        finalize(() => this.loadingSource.next(false)),
        catchError(err => {
          this.errorSource.next(err);
          return EMPTY;
        }),
      );
    }),
    tap(() => {
      // delete successful actions
      this.close();
      this.productService.selectItem(null);
      this.productService.refreshList();
    }),
  );

  close() {
    this.openChange.emit(false);
  }

  confirm() {
    this.loadingSource.next(true);
    this.errorSource.next(null);
    this.saveAction.next();
  }
}
