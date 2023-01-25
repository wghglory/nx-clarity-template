/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

const products = [
  { id: 1, name: 'Basketball' },
  { id: 2, name: 'Football' },
];

app.get('/api/products', (req, res) => {
  res.send(products);
});

app.get('/api/products/:id', (req, res) => {
  const id = +req.params.id;
  const found = products.find((p) => p.id === id);

  if (found) {
    return res.send(found);
  }
  return res.status(404).send({ message: 'not found' });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
