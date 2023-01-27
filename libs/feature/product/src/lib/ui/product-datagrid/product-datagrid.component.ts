import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'seed-product-datagrid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-datagrid.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDatagridComponent {}
