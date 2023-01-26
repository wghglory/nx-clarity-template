import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { switchMap } from 'rxjs';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

export interface ProductsState {
  products: Product[];
  error: HttpErrorResponse | null;
  loading: boolean;
}

@Injectable()
export class ProductListStore extends ComponentStore<ProductsState> {
  constructor(private productService: ProductService) {
    super({ products: [], error: null, loading: true });
  }

  readonly products$ = this.select((state) => state.products);
  readonly error$ = this.select((state) => state.error);
  readonly loading$ = this.select((state) => state.loading);

  readonly vm$ = this.select({
    products: this.products$,
    error: this.error$,
    loading: this.loading$,
  });

  readonly getProducts = this.effect<void>((trigger$) =>
    trigger$.pipe(
      switchMap(() => {
        return this.productService.products$.pipe(
          tapResponse(
            (products) => {
              this.setState({
                products,
                error: null,
                loading: false,
              });
            },
            (error: HttpErrorResponse) =>
              this.setState({ error, products: [], loading: false })
          )
        );
      })
    )
  );
}
