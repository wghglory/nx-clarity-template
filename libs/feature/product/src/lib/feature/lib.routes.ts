import { Route } from '@angular/router';

import { ProductListComponent } from './product-list/product-list.component';

export const productRoutes: Route[] = [
  { path: '', component: ProductListComponent },
  {
    path: ':id',
    loadComponent: () => import('./product-detail/product-detail.component').then(m => m.ProductDetailComponent),
  },
  {
    path: '@/add',
    loadComponent: () => import('./product-add/product-add.component').then(m => m.ProductAddComponent),
  },
];
