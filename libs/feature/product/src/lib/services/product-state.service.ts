import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductStateService {
  private refreshAction = new BehaviorSubject<void>(undefined);
  refreshAction$ = this.refreshAction.asObservable();

  private selectedProductSource = new BehaviorSubject<Product | null>(null); // product-delete *ngIf initializes late, so using Subject won't work.
  selectedProduct$ = this.selectedProductSource.asObservable();

  refreshList() {
    this.refreshAction.next();
  }

  selectProduct = (product: Product) => {
    this.selectedProductSource.next(product);
  };
}
