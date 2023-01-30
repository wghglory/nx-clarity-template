import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInfiniteScrollComponent } from './product-infinite-scroll.component';

describe('ProductInfiniteScrollComponent', () => {
  let component: ProductInfiniteScrollComponent;
  let fixture: ComponentFixture<ProductInfiniteScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductInfiniteScrollComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductInfiniteScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
