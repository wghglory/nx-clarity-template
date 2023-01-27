import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageQuery } from '@seed/shared/models';

import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  products$ = this.http.get<Product[]>('/api/products');

  getProducts(params: Partial<PageQuery>) {
    return this.http.get<Product[]>('/api/products', {
      params,
    });
  }

  getProduct(id: string) {
    return this.http.get<Product>(`/api/products/${id}`);
  }

  addProduct(
    payload: Partial<{
      name: string;
    }>
  ) {
    return this.http.post<Product>(`/api/products`, payload);
  }

  deleteProduct(id: string) {
    return this.http.delete<void>(`/api/products/${id}`);
  }
}
