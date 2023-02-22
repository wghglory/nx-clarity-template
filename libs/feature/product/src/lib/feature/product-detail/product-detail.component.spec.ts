import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoadingOrErrorComponent } from '@seed/shared/ui';
import { createMock, provideMock } from '@testing-library/angular/jest-utils';
import { MockComponent, MockService } from 'ng-mocks';
import { of } from 'rxjs';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ProductDetailComponent } from './product-detail.component';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;

  const productServiceStub = {
    products$: of([] as Product[]),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ProductDetailComponent, MockComponent(LoadingOrErrorComponent)],
      providers: [{ provide: ProductService, useValue: productServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
