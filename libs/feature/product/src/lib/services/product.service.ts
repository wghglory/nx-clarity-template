import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PageQuery, RDEList, RDEValue } from '@seed/shared/models';
import { BehaviorSubject, switchMap, take, throwError, timer } from 'rxjs';

import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  products$ = this.http.get<RDEList<Product>>('/api/products');

  private refreshAction = new BehaviorSubject<void>(undefined);
  refreshAction$ = this.refreshAction.asObservable();

  private selectedItemSource = new BehaviorSubject<Product | null>(null); // product-delete *ngIf initializes late, so using Subject won't work.
  selectedItem$ = this.selectedItemSource.asObservable();

  refreshList() {
    this.refreshAction.next();
  }

  selectItem(product: Product | null) {
    this.selectedItemSource.next(product);
  }

  getProducts(params: Partial<PageQuery>) {
    // mock error response
    if (params.page === 2) {
      return timer(1000).pipe(
        take(2),
        switchMap(() => throwError(() => new Error('fail'))),
      );
      // return of(1).pipe(
      //   delay(1000),
      //   map(() => {
      //     throw new Error('fail');
      //   }),
      // );
    }
    return this.http.get<RDEList<Product>>('/api/products', {
      params,
    });
  }

  getProduct(id: string) {
    return this.http.get<RDEValue<Product>>(`/api/products/${id}`);
  }

  addProduct(
    payload: Partial<{
      name: string;
    }>,
  ) {
    return this.http.post<RDEValue<Product>>(`/api/products`, payload);
  }

  updateProduct(
    id: string,
    payload: Partial<{
      name: string;
      description: string;
    }>,
  ) {
    return this.http.patch<RDEValue<Product>>(`/api/products/${id}`, payload);
  }

  deleteProduct(id: string) {
    return this.http.delete<void>(`/api/products/${id}`);
  }
}
