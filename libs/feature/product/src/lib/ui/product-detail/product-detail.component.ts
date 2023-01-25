import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';

import { ProductService } from '../../services/product.service';

@Component({
  selector: 'seed-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent {
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  product$ = this.route.params.pipe(
    switchMap(({ id }) => {
      return this.productService.getProduct(id);
    })
  );
}
