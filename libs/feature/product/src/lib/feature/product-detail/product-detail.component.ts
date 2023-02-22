import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingOrErrorComponent } from '@seed/shared/ui';
import { catchError, EMPTY, Subject, switchMap } from 'rxjs';

import { ProductService } from '../../services/product.service';

@Component({
  selector: 'seed-product-detail',
  standalone: true,
  imports: [CommonModule, LoadingOrErrorComponent],
  templateUrl: './product-detail.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  constructor(private productService: ProductService, private route: ActivatedRoute) {}

  readonly error$ = new Subject<HttpErrorResponse>();

  product$ = this.route.params.pipe(
    switchMap(({ id }) => {
      return this.productService.getProduct(id);
    }),
    catchError(err => {
      this.error$.next(err);
      return EMPTY;
    }),
  );
}
