import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { productRoutes } from '@seed/feature/product';

import { NxWelcomeComponent } from './nx-welcome.component';

const routes: Route[] = [
  {
    path: '',
    component: NxWelcomeComponent,
  },
  {
    path: 'products',
    children: productRoutes,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
