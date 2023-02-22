import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingOrErrorComponent } from '@seed/shared/ui';
import { createMock, Mock, provideMock } from '@testing-library/angular/jest-utils';
import { MockComponent, MockService } from 'ng-mocks';
import { of } from 'rxjs';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ProductListComponent } from './product-list.component';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  const productServiceStub = {
    products$: of([] as Product[]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [{ provide: ProductService, useValue: productServiceStub }],
      declarations: [MockComponent(LoadingOrErrorComponent)],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
