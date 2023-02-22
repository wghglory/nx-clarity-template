import { RDEList } from '@seed/shared/models';
import { LoadingOrErrorComponent } from '@seed/shared/ui';
import { render, screen } from '@testing-library/angular';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ProductListComponent } from './product-list.component';

describe('ProductListComponent', () => {
  const productServiceStub = {
    products$: of({
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
    } as RDEList<Product>),
    selectItem: jest.fn(),
    refreshAction$: of(true),
  };

  it('should render', async () => {
    await render(ProductListComponent, {
      providers: [{ provide: ProductService, useValue: productServiceStub }],
      imports: [MockComponent(LoadingOrErrorComponent)],
    });

    const firstHref = screen.getByRole('link', { name: /test-product/i });
    expect(firstHref).toBeInTheDocument();
  });

  it('should select item', async () => {
    const { fixture } = await render(ProductListComponent, {
      providers: [{ provide: ProductService, useValue: productServiceStub }],
      imports: [MockComponent(LoadingOrErrorComponent)],
    });

    jest.spyOn(productServiceStub, 'selectItem');

    const product = { id: 'test-product' } as Product;

    fixture.componentInstance.selectItem(product);

    expect(productServiceStub.selectItem).toBeCalledWith(product);
  });
});
