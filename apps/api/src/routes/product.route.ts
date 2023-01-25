import express from 'express';

import { products } from '../data/product.data';

export const productRouter = express.Router();

productRouter.get('/', (req, res) => {
  res.send(products);
});

productRouter.get('/:id', (req, res) => {
  const id = req.params.id;
  const found = products.find((p) => p.id === id);

  if (found) {
    return res.send(found);
  }
  return res.status(404).send({ message: 'not found' });
});
