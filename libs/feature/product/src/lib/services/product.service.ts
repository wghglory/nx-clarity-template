import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  products$ = this.http.get<Product[]>('/api/products');

  getProduct(id: number) {
    return this.http.get<Product>(`/api/products/${id}`);
  }
}
