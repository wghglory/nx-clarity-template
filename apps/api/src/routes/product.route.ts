import { Product } from '@seed/feature/product';
import express from 'express';

import { products } from '../data/product.data';

export const productRouter = express.Router();

productRouter.get('/', (req, res) => {
  res.send(products);
});

productRouter.get('/:id', (req, res) => {
  const id = req.params.id;
  const found = products.find(p => p.id === id);

  if (found) {
    return res.send(found);
  }
  return res.status(404).send({ message: 'not found' });
});

productRouter.post('/', (req, res) => {
  const { name, description } = req.body;

  const product = {
    id: Date.now().toString(),
    name,
    description,
    productionDate: new Date().toISOString(),
  } as Product;

  products.unshift(product);

  return res.send(product);
});

productRouter.delete('/:id', (req, res) => {
  const id = req.params.id;
  const index = products.findIndex(p => p.id === id);

  if (index > -1) {
    products.splice(index, 1);
    return res.status(204).send();
  }
  return res.status(404).send({ message: 'not found' });
});
