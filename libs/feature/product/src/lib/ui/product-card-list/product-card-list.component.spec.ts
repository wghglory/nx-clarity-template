import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { RDEList } from '@seed/shared/models';
import { SharedSpecModule } from '@seed/shared/modules';
import { of, throwError } from 'rxjs';

import { Product } from '../../models/product';
import { ProductService } from './../../services/product.service';
import { ProductCardListComponent } from './product-card-list.component';

describe('ProductCardListComponent', () => {
  let component: ProductCardListComponent;
  let fixture: ComponentFixture<ProductCardListComponent>;
  const products1 = {
    resultTotal: 2,
    pageCount: 1,
    page: 1,
    pageSize: 25,
    associations: null,
    values: [
      {
        id: '12',
        entityType: 'urn:vcloud:type:vmware:product:1.0.0',
        name: 'test-product',
        externalId: null,
        entity: {
          id: '12',
          name: 'test-product',
          description: 'test-product',
          productionDate: new Date().toISOString(),
          state: 'success',
          state_reason: '',
        },
        state: 'RESOLVED',
        owner: {
          name: 'admin',
          id: `urn:vcloud:user:xxxxx`,
        },
        org: { name: 'System', id: 'faker.datatype.uuid()' },
      },
    ],
  } as RDEList<Product>;

  const products2 = {
    resultTotal: 2,
    pageCount: 1,
    page: 1,
    pageSize: 25,
    associations: null,
    values: [
      {
        id: '22',
        entityType: 'urn:vcloud:type:vmware:product:1.0.0',
        name: 'test-product',
        externalId: null,
        entity: {
          id: '22',
          name: 'test-product 2',
          description: 'test-product 2',
          productionDate: new Date().toISOString(),
          state: 'success',
          state_reason: '',
        },
        state: 'RESOLVED',
        owner: {
          name: 'admin',
          id: `urn:vcloud:user:xxxxx`,
        },
        org: { name: 'System', id: 'faker.datatype.uuid()' },
      },
    ],
  } as RDEList<Product>;

  const productServiceStub = {
    getProducts: jest.fn().mockReturnValue(of(products1, products2)),
    refreshAction$: of(true),
    selectItem: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardListComponent, SharedSpecModule],
      providers: [{ provide: ProductService, useValue: productServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return product$', () => {
    const result = subscribeSpyTo(component.productsWithFilter$).getFirstValue();

    expect(result).toEqual(products1);
  });

  it('should load more products when clicking loadMore', () => {
    component.loadMore();

    expect(subscribeSpyTo(component.currentPage$).getLastValue()).toBe(2);
  });

  it('should trigger delete product', () => {
    jest.spyOn(component.deleteEvent, 'emit');

    const product = { id: 'mockId' } as Product;
    component.deleteProduct(product);

    expect(productServiceStub.selectItem).toBeCalledWith(product);
    expect(component.deleteEvent.emit).toBeCalled();
  });

  it('should filter product by name', () => {
    component.filterByProductName('test');

    expect(subscribeSpyTo(component.currentPage$).getLastValue()).toBe(1);
    expect(subscribeSpyTo(component.filterName$).getLastValue()).toBe('test');
  });

  it('should return error alert if service fails', () => {
    productServiceStub.getProducts.mockReturnValue(throwError(() => new Error('fail')));

    const observerSpy = subscribeSpyTo(component.productsWithFilter$).getFirstValue(); // necessary to subscribe, so error will display

    fixture.detectChanges();

    const alert = fixture.debugElement.query(By.css(`.alert-text`));
    expect(alert.nativeElement).toHaveTextContent('fail');
    expect(observerSpy).toBeUndefined();
  });
});
