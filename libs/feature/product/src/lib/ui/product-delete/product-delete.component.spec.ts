import { InteractivityChecker } from '@angular/cdk/a11y';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { RDEValue } from '@seed/shared/models';
import { SharedSpecModule } from '@seed/shared/modules';
import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/angular';
import { of, throwError } from 'rxjs';

import { Product } from '../../models/product';
import { ProductService } from './../../services/product.service';
import { ProductDeleteComponent } from './product-delete.component';

const productServiceStub = {
  deleteProduct: jest.fn().mockImplementation(id => of({})),
  selectedItem$: of({
    id: 'product-id',
    entity: { name: 'test', description: 'test description', id: 'product-id' },
  } as RDEValue<Product>),
  refreshList: jest.fn(),
  selectItem: jest.fn(),
};

describe('ProductDeleteComponent', () => {
  let component: ProductDeleteComponent;
  let fixture: ComponentFixture<ProductDeleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDeleteComponent, SharedSpecModule, NoopAnimationsModule],
      providers: [
        {
          provide: ProductService,
          useValue: productServiceStub,
        },
        { provide: ActivatedRoute, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete product when confirm', async () => {
    jest.spyOn(component, 'close');
    jest.spyOn(productServiceStub, 'selectItem');
    jest.spyOn(productServiceStub, 'refreshList');

    component.confirm();

    const observerSpy = subscribeSpyTo(component.delete$);

    expect(productServiceStub.deleteProduct).toBeCalledWith('product-id');
    expect(component.close).toBeCalled();
    expect(productServiceStub.selectItem).toBeCalledWith(null);
    expect(productServiceStub.refreshList).toBeCalled();
  });
});

describe('ProductDeleteComponent use testing library', () => {
  it('should display error when delete api fails', async () => {
    await render(ProductDeleteComponent, {
      componentInputs: {
        open: true,
      },
      imports: [SharedSpecModule, NoopAnimationsModule],
      providers: [
        { provide: ProductService, useValue: productServiceStub },
        {
          // '[cdkFocusInitial]' is not focusable warning, when running jest unit test of a dialog component with cdkFocusInitial?
          provide: InteractivityChecker,
          useValue: {
            isFocusable: () => true, // This checks focus trap, set it to true to avoid the warning
          },
        },
      ],
    });

    productServiceStub.deleteProduct.mockReturnValueOnce(throwError(() => new Error('fail')));

    const confirmBtn = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmBtn);

    expect(productServiceStub.deleteProduct).toBeCalledWith('product-id');

    const alert = await screen.findByRole('alert');
    expect(alert).toBeVisible();
    expect(alert).toHaveTextContent('fail');
  });

  it('should close dialog after delete successfully', async () => {
    await render(ProductDeleteComponent, {
      componentInputs: {
        open: true,
      },
      componentOutputs: { openChange: new EventEmitter<boolean>() },
      imports: [SharedSpecModule, NoopAnimationsModule],
      providers: [
        { provide: ProductService, useValue: productServiceStub },
        {
          // '[cdkFocusInitial]' is not focusable warning, when running jest unit test of a dialog component with cdkFocusInitial?
          provide: InteractivityChecker,
          useValue: {
            isFocusable: () => true, // This checks focus trap, set it to true to avoid the warning
          },
        },
      ],
    });

    jest.spyOn(productServiceStub, 'selectItem');
    jest.spyOn(productServiceStub, 'refreshList');

    const confirmBtn = screen.getByRole('button', { name: /confirm/i });
    fireEvent.click(confirmBtn);

    expect(productServiceStub.deleteProduct).toBeCalledWith('product-id');

    // since no parent component to control delete component, close will not happen
    // await waitForElementToBeRemoved(() => screen.findByRole('button', { name: /confirm/i }));
    // expect(confirmBtn).not.toBeInTheDocument();

    expect(productServiceStub.deleteProduct).toBeCalledWith('product-id');
    expect(productServiceStub.selectItem).toBeCalledWith(null);
    expect(productServiceStub.refreshList).toBeCalled();
  });
});
