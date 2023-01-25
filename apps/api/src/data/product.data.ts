import { faker } from '@faker-js/faker';
import { Product } from '@seed/feature/product';

const initial: Product[] = [
  { id: '1', name: 'Basketball', productionDate: new Date().toISOString() },
  {
    id: '2',
    name: 'Football',
    productionDate: new Date('2020-01-04').toISOString(),
  },
];

const data = new Array(45).fill(1).map(() => {
  return {
    id: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    productionDate: faker.date.past().toDateString(),
  };
});

export const products = [...initial, ...data];
