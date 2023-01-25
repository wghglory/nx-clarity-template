import { Route } from '@angular/router';
import { ProductListComponent } from './ui/product-list/product-list.component';

export const productRoutes: Route[] = [
  { path: '', component: ProductListComponent },
  {
    path: ':id',
    loadComponent: () =>
      import('./ui/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
  },
];
