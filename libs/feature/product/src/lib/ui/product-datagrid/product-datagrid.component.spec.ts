import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDatagridComponent } from './product-datagrid.component';

describe('ProductDatagridComponent', () => {
  let component: ProductDatagridComponent;
  let fixture: ComponentFixture<ProductDatagridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDatagridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDatagridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
