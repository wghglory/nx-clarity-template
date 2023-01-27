import { Route } from '@angular/router';

import { ProductShellComponent } from './ui/product-shell/product-shell.component';

export const productRoutes: Route[] = [
  { path: '', component: ProductShellComponent },
  {
    path: ':id',
    loadComponent: () =>
      import('./ui/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent
      ),
  },
  {
    path: '@/add',
    loadComponent: () =>
      import('./ui/product-add/product-add.component').then(
        (m) => m.ProductAddComponent
      ),
  },
];
