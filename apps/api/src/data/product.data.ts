import { faker } from '@faker-js/faker';
import { Product } from '@seed/feature/product';

const initial: Product[] = [
  {
    id: '1fddfdf',
    name: 'Basketball',
    productionDate: new Date().toISOString(),
    description: 'NBA basketball that Jordan played with.',
  },
  {
    id: '2898ufg',
    name: 'Football',
    productionDate: new Date('2020-01-04').toISOString(),
    description: 'Kick the ball!',
  },
];

const data = new Array(45).fill(1).map(() => {
  return {
    id: faker.datatype.uuid(),
    name: faker.commerce.productName(),
    productionDate: faker.date.past().toDateString(),
    description: faker.lorem.sentence(20),
  } as Product;
});

export const products = [...initial, ...data];
