import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';

import { Product } from '../models/product';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ProductService);
    controller = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get products', () => {
    service.getProducts({ page: 1 }).subscribe();

    const request = controller.expectOne(req => req.method === 'GET' && req.url.includes('api/products'));

    // Assert that the request is a GET.
    expect(request.request.method).toEqual('GET');
    request.flush({
      resultTotal: 1,
      pageCount: 1,
      page: 1,
      pageSize: 10,
      associations: [],
      values: [
        {
          entity: {
            id: 'mock-id',
            name: 'mock-name',
            productionDate: 'mock date',
            description: 'description',
          },
        },
      ],
    });
  });

  it('get single product', () => {
    service.getProduct('mockId').subscribe();

    const request = controller.expectOne(req => req.method === 'GET' && req.url.includes('api/products/mockId'));

    // Assert that the request is a GET.
    expect(request.request.method).toEqual('GET');
    request.flush({
      entity: {
        id: 'mock-id',
        name: 'mock-name',
        productionDate: 'mock date',
        description: 'description',
      },
    });
  });

  it('add a product', () => {
    service.addProduct({ name: 'mock product' }).subscribe();

    const request = controller.expectOne(req => req.method === 'POST' && req.url.includes('api/products'));

    // Assert that the request is a POST.
    expect(request.request.method).toEqual('POST');
    request.flush({
      entity: {
        id: 'mock-id',
        name: 'mock product',
        productionDate: 'mock date',
        description: 'description',
      },
    });
  });

  it('delete a product', () => {
    service.deleteProduct('mockId').subscribe();

    const request = controller.expectOne(req => req.method === 'DELETE' && req.url.includes('api/products/mockId'));

    // Assert that the request is a DELETE.
    expect(request.request.method).toEqual('DELETE');
    request.flush(null);
  });

  it('update a product', () => {
    service.updateProduct('mockId', { name: 'new name', description: 'new description' }).subscribe();

    const request = controller.expectOne(req => req.method === 'PATCH' && req.url.includes('api/products/mockId'));

    // Assert that the request is a PATCH.
    expect(request.request.method).toEqual('PATCH');
    request.flush({
      entity: {
        id: 'mock-id',
        name: 'new name',
        productionDate: 'mock date',
        description: 'new description',
      },
    });
  });

  it('refresh list', () => {
    service.refreshList();

    expect(subscribeSpyTo(service.refreshAction$).getFirstValue()).toBeUndefined();
  });

  it('select item', () => {
    const product = {
      id: 'mockId',
      name: 'mock product',
      description: 'description',
      productionDate: new Date().toISOString(),
    } as Product;

    service.selectItem(product);

    expect(subscribeSpyTo(service.selectedItem$).getFirstValue()).toEqual(product);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    controller.verify();
  });
});
