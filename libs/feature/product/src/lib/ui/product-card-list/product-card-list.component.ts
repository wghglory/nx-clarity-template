import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'seed-product-card-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card-list.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardListComponent {}
