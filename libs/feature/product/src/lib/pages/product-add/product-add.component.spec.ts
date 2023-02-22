import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { RDEValue } from '@seed/shared/models';
import { SharedSpecModule } from '@seed/shared/modules';
import { of, throwError } from 'rxjs';

import { Product } from '../../models/product';
import { ProductService } from './../../services/product.service';
import { ProductAddComponent } from './product-add.component';

describe('ProductAddComponent', () => {
  let component: ProductAddComponent;
  let fixture: ComponentFixture<ProductAddComponent>;
  const productServiceStub = {
    addProduct: jest.fn().mockReturnValue(of({ entity: { name: 'test', description: 'test description' } } as RDEValue<Product>)),
  };
  const routerStub = { navigate: jest.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductAddComponent, SharedSpecModule, NoopAnimationsModule],
      providers: [
        {
          provide: ProductService,
          useValue: productServiceStub,
        },
        {
          provide: Router,
          useValue: routerStub,
        },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return add product', async () => {
    const formValue = { name: 'test', description: 'test description' };
    component.productForm.setValue(formValue);
    component.save();

    const observerSpy = subscribeSpyTo(component.add$);

    expect(routerStub.navigate).toBeCalled();
    expect(productServiceStub.addProduct).toBeCalledWith(formValue);
  });

  it('should catchError if add product fails', () => {
    const formValue = { name: 'test', description: 'test description' };
    productServiceStub.addProduct.mockReturnValueOnce(throwError(() => new Error('fail')));

    component.productForm.setValue(formValue);
    component.save();

    const observerSpy = subscribeSpyTo(component.error$);

    expect(productServiceStub.addProduct).toBeCalledWith(formValue);
  });
});
