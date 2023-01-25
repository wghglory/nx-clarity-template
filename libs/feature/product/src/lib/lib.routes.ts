import { Route } from '@angular/router';
import { ProductDetailComponent } from './ui/product-detail/product-detail.component';
import { ProductListComponent } from './ui/product-list/product-list.component';

export const productRoutes: Route[] = [
  { path: '', component: ProductListComponent },
  { path: ':id', component: ProductDetailComponent },
];
