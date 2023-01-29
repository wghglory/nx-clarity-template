import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { LoadingOrErrorComponent } from '@seed/shared/ui';
import { catchError, EMPTY, Subject, switchMap } from 'rxjs';

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
  constructor(
    private productService: ProductService,
    private productStateService: ProductStateService
  ) {}

  @Output() deleteEvent = new EventEmitter();

  error$ = new Subject<HttpErrorResponse>();

  products$ = this.productStateService.refreshAction$.pipe(
    switchMap(() => {
      return this.productService.products$;
    }),
    catchError((err) => {
      this.error$.next(err);
      return EMPTY;
    })
  );

  deleteProduct(product: Product) {
    this.productStateService.selectItem(product);
    this.deleteEvent.emit();
  }
}
