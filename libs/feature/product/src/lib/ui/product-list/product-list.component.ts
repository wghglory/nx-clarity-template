import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { LoadingOrErrorComponent } from '@seed/shared/ui';
import { catchError, EMPTY, Subject, switchMap } from 'rxjs';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'seed-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ClarityModule, FormsModule, LoadingOrErrorComponent],
  templateUrl: './product-list.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  constructor(private productService: ProductService) {}

  selectedItem: Product | undefined;

  error$ = new Subject<HttpErrorResponse | null>();

  products$ = this.productService.refreshAction$.pipe(
    switchMap(() => {
      return this.productService.products$;
    }),
    catchError(err => {
      this.error$.next(err);
      return EMPTY;
    }),
  );

  selectItem(product: Product) {
    this.productService.selectItem(product);
  }
}
