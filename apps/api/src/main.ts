import cors from 'cors';
import express from 'express';
import * as path from 'path';

import delayMiddleware from './middlewares/delay.middleware';
import { productRouter } from './routes/product.route';

const app = express();

// Body parsing Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.use(delayMiddleware);

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to api!' });
});

app.use(`/api/products`, productRouter);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
