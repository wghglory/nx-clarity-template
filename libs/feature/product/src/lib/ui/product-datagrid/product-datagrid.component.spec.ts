import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ObserverSpy, queueForAutoUnsubscribe, subscribeSpyTo } from '@hirez_io/observer-spy';
import { RDEList } from '@seed/shared/models';
import { SharedSpecModule } from '@seed/shared/modules';
import { of, throwError } from 'rxjs';

import { Product } from '../../models/product';
import { ProductService } from './../../services/product.service';
import { ProductDatagridComponent } from './product-datagrid.component';

describe('ProductDatagridComponent', () => {
  let component: ProductDatagridComponent;
  let fixture: ComponentFixture<ProductDatagridComponent>;

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
      imports: [ProductDatagridComponent, SharedSpecModule],
      providers: [
        {
          provide: ProductService,
          useValue: productServiceStub,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDatagridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('can refresh datagrid using subscribeSpyTo', fakeAsync(() => {
    const observerSpy = subscribeSpyTo(component.dgState$).getValues();

    const state = {
      page: { from: 1, to: 15, size: 15, current: 2 },
    };
    component.refresh(state);

    tick();

    expect(observerSpy[0]).toStrictEqual(state);
  }));

  it('can refresh datagrid using ObserverSpy', fakeAsync(() => {
    const spy = new ObserverSpy();
    const subscription = component.dgState$.subscribe(spy);
    queueForAutoUnsubscribe(subscription);

    const state = {
      page: { from: 1, to: 15, size: 15, current: 2 },
    };
    component.refresh(state);

    tick();

    expect(spy.getFirstValue()).toStrictEqual(state);
  }));

  it('can return products when refreshing', fakeAsync(() => {
    const spy = new ObserverSpy();
    const subscription = component.products$.subscribe(spy);
    queueForAutoUnsubscribe(subscription);

    const state = {
      page: { from: 1, to: 15, size: 15, current: 2 },
    };
    component.refresh(state);

    tick();

    const products = spy.getFirstValue() as RDEList<Product>;

    expect(productServiceStub.getProducts).toBeCalledWith({ page: 2, pageSize: 15 });
    expect(products.values).toBeDefined();
  }));

  it('can return products when refreshing with jest spy', fakeAsync(() => {
    const service = TestBed.inject(ProductService);
    const products = { resultTotal: 10 } as RDEList<Product>;
    jest.spyOn(service, 'getProducts').mockReturnValue(of(products));

    const spy = new ObserverSpy();
    const subscription = component.products$.subscribe(spy);
    queueForAutoUnsubscribe(subscription);

    const state = {
      page: { from: 1, to: 15, size: 15, current: 2 },
    };
    component.refresh(state);

    tick();

    const result = spy.getFirstValue();

    expect(service.getProducts).toBeCalledWith({ page: 2, pageSize: 15 });
    expect(result).toBe(products);
  }));

  it('can return error if service fails', fakeAsync(() => {
    const service = TestBed.inject(ProductService);
    jest.spyOn(service, 'getProducts').mockReturnValue(throwError(() => new Error('fail')));

    const spy = new ObserverSpy();
    const subscription = component.products$.subscribe(spy);
    queueForAutoUnsubscribe(subscription);

    const errorSpy = subscribeSpyTo(component.error$);

    const state = {
      page: { from: 1, to: 15, size: 15, current: 2 },
    };
    component.refresh(state);

    tick();

    const result = spy.getFirstValue();

    expect(service.getProducts).toBeCalledWith({ page: 2, pageSize: 15 });
    expect(result).toBeUndefined();
    expect(errorSpy.getFirstValue()).toBeDefined();
  }));

  it('should return error alert if service fails', fakeAsync(() => {
    productServiceStub.getProducts.mockReturnValue(throwError(() => new Error('fail')));

    const state = {
      page: { from: 1, to: 15, size: 15, current: 2 },
    };
    component.refresh(state); // trigger load data

    tick();
    fixture.detectChanges();

    const alert = fixture.debugElement.query(By.css(`.alert-text`));
    expect(alert.nativeElement).toHaveTextContent('fail');
  }));
});
