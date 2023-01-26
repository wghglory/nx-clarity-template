import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { LoadingOrErrorComponent } from '@seed/shared/ui';
import { BehaviorSubject, catchError, EMPTY, Subject, switchMap } from 'rxjs';

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

  private errorSub = new Subject<HttpErrorResponse>();
  error$ = this.errorSub.asObservable();

  refreshSub = new BehaviorSubject<void>(undefined);

  products$ = this.refreshSub.pipe(
    switchMap(() => this.productService.products$),
    catchError((err) => {
      this.errorSub.next(err);
      return EMPTY;
    })
  );

  reload() {
    this.refreshSub.next();
  }
}
