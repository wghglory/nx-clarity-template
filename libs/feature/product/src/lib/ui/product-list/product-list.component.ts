import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';
import { LoadingOrErrorComponent } from '@seed/shared/ui';

import { ProductListStore } from './product-list.store';

@Component({
  selector: 'seed-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ClarityModule, LoadingOrErrorComponent],
  templateUrl: './product-list.component.html',
  providers: [ProductListStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent implements OnInit {
  constructor(private productListStore: ProductListStore) {}

  products$ = this.productListStore.products$;
  error$ = this.productListStore.error$;
  loading$ = this.productListStore.loading$;

  vm$ = this.productListStore.vm$;

  ngOnInit() {
    this.productListStore.getProducts();
  }
}
