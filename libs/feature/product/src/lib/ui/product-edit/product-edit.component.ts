import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import {
  catchError,
  combineLatest,
  EMPTY,
  filter,
  finalize,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { ProductService } from '../../services/product.service';
import { ProductStateService } from '../../services/product-state.service';

@Component({
  selector: 'seed-product-edit',
  standalone: true,
  imports: [CommonModule, ClarityModule, ReactiveFormsModule],
  templateUrl: './product-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditComponent implements OnInit {
  constructor(
    private productService: ProductService,
    public productStateService: ProductStateService
  ) {}
  productForm = new FormGroup({
    name: new FormControl('', { nonNullable: true }),
    description: new FormControl('', {
      nonNullable: true,
    }),
  });

  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  private saveAction = new Subject<void>();

  private errorSource = new Subject<HttpErrorResponse | null>();
  error$ = this.errorSource.asObservable();
  private loadingSource = new Subject<boolean>();
  loading$ = this.loadingSource.asObservable();

  edit$ = combineLatest([
    this.productStateService.selectedProduct$.pipe(filter(Boolean)),
    this.saveAction,
  ]).pipe(
    switchMap(([product, _]) => {
      return this.productService
        .updateProduct(product.id, this.productForm.value)
        .pipe(
          finalize(() => this.loadingSource.next(false)),
          catchError((err) => {
            this.errorSource.next(err);
            return EMPTY;
          })
        );
    }),
    tap(() => {
      // delete successful actions
      this.close();
      this.productStateService.selectProduct(null);
      this.productStateService.refreshList();
    })
  );

  close() {
    this.openChange.emit(false);
  }

  confirm() {
    this.loadingSource.next(true);
    this.errorSource.next(null);
    this.saveAction.next();
  }

  ngOnInit() {
    // init form
    this.productStateService.selectedProduct$
      .pipe(filter(Boolean), take(1))
      .subscribe((product) => {
        this.productForm.setValue({
          name: product.name,
          description: product.description,
        });
      });
  }
}
