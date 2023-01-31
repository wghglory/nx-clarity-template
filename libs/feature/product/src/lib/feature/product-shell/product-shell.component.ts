import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { ProductStateService } from '../../services/product-state.service';
import { ProductCardListComponent } from '../../ui/product-card-list/product-card-list.component';
import { ProductDatagridComponent } from '../../ui/product-datagrid/product-datagrid.component';
import { ProductDeleteComponent } from '../../ui/product-delete/product-delete.component';
import { ProductEditComponent } from '../../ui/product-edit/product-edit.component';
import { ProductInfiniteScrollComponent } from '../../ui/product-infinite-scroll/product-infinite-scroll.component';
import { ProductListComponent } from '../../ui/product-list/product-list.component';

@Component({
  selector: 'seed-product-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ClarityModule,
    FormsModule,
    ProductListComponent,
    ProductCardListComponent,
    ProductDatagridComponent,
    ProductDeleteComponent,
    ProductEditComponent,
    ProductInfiniteScrollComponent,
  ],
  templateUrl: './product-shell.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductShellComponent {
  constructor(public productStateService: ProductStateService) {}

  openDeleteDialog = false;
  openEditDialog = false;
}
