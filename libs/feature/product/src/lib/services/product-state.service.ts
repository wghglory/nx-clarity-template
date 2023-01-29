import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductStateService {
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
}
