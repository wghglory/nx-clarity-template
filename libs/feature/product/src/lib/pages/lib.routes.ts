import { Route } from '@angular/router';

import { ProductShellComponent } from './product-shell/product-shell.component';

export const productRoutes: Route[] = [
  { path: '', component: ProductShellComponent },
  {
    path: ':id',
    loadComponent: () => import('./product-detail/product-detail.component').then(m => m.ProductDetailComponent),
  },
  {
    path: '@/add',
    loadComponent: () => import('./product-add/product-add.component').then(m => m.ProductAddComponent),
  },
];
