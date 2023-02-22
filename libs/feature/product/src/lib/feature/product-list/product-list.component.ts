import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { LoadingOrErrorComponent } from '@seed/shared/ui';
import { BehaviorSubject, catchError, EMPTY, Subject, switchMap } from 'rxjs';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ProductDeleteComponent } from '../../ui/product-delete/product-delete.component';

@Component({
  selector: 'seed-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ClarityModule, FormsModule, LoadingOrErrorComponent, ProductDeleteComponent],
  templateUrl: './product-list.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  constructor(private productService: ProductService) {}

  private refreshAction = new BehaviorSubject<void>(undefined);

  error$ = new Subject<HttpErrorResponse>();

  products$ = this.refreshAction.pipe(
    switchMap(() => {
      return this.productService.products$;
    }),
    catchError(err => {
      this.error$.next(err);
      return EMPTY;
    }),
  );

  openDeleteDialog = false;
  selectedProduct: Product | undefined = undefined;

  refreshData() {
    this.selectedProduct = undefined;
    this.refreshAction.next();
  }
}
