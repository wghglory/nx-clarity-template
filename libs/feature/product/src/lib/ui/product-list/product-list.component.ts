import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { LoadingOrErrorComponent } from '@seed/shared/ui';
import { catchError, EMPTY, Subject, switchMap, timer } from 'rxjs';

import { ProductService } from '../../services/product.service';

@Component({
  selector: 'seed-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ClarityModule, LoadingOrErrorComponent],
  templateUrl: './product-list.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  constructor(private productService: ProductService) {}

  error$ = new Subject<HttpErrorResponse>();

  products$ = timer(0, 3000).pipe(
    switchMap(() => this.productService.products$),
    catchError((err) => {
      this.error$.next(err);
      return EMPTY;
    })
  );
}
