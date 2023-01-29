import express from 'express';

import { createProduct, products } from '../data/product.data';
import { addItemToList, removeItemFromList } from '../utils/entity';
import { handlePagedRequest } from '../utils/pagination';

export const productRouter = express.Router();

productRouter.get('/', (req, res) => {
  handlePagedRequest(req, res, products);
});

productRouter.get('/:id', (req, res) => {
  const id = req.params.id;
  const found = products.values.find((p) => p.id === id);

  if (found) {
    return res.send(found);
  }
  return res.status(404).send({ message: 'not found' });
});

productRouter.post('/', (req, res) => {
  const { name, description } = req.body;

  const product = createProduct({ name, description, state: true });

  addItemToList(product, products);

  return res.send(product);
});

productRouter.delete('/:id', (req, res) => {
  const id = req.params.id;
  const index = products.values.findIndex((p) => p.id === id);

  if (index > -1) {
    removeItemFromList(id, products);
    return res.status(204).send();
  }
  return res.status(404).send({ message: 'not found' });
});
