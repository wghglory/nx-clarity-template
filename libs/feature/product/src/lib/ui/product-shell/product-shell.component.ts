import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { ProductStateService } from '../../services/product-state.service';
import { ProductCardListComponent } from '../product-card-list/product-card-list.component';
import { ProductDatagridComponent } from '../product-datagrid/product-datagrid.component';
import { ProductDeleteComponent } from '../product-delete/product-delete.component';
import { ProductListComponent } from '../product-list/product-list.component';
import { ProductEditComponent } from './../product-edit/product-edit.component';

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
