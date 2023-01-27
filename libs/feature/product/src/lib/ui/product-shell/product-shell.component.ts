import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClarityModule } from '@clr/angular';

import { ProductStateService } from '../../services/product-state.service';
import { ProductDeleteComponent } from '../product-delete/product-delete.component';
import { ProductListComponent } from './../product-list/product-list.component';

@Component({
  selector: 'seed-product-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ClarityModule,
    FormsModule,
    ProductListComponent,
    ProductDeleteComponent,
  ],
  templateUrl: './product-shell.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductShellComponent {
  constructor(public productStateService: ProductStateService) {}

  openDeleteDialog = false;
}
