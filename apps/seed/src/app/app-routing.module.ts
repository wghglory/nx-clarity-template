import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { productRoutes } from '@seed/feature/product';
import { WelcomeComponent } from '@seed/shared/ui';

const routes: Route[] = [
  {
    path: '',
    component: WelcomeComponent,
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
