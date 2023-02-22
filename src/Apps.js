const fs = require('fs');
const express = require('express');
const ProductManager = require('./ProductManager');

const productsPath = './productos.json';
const products = new ProductManager(productsPath);
const app = express();
const port = 8080;

app.get('/products', async (req, res) => {
  try {
    let data = await products.getProducts();
    if (req.query.limit) {
      data = data.slice(0, req.query.limit);
    }
    res.send({ products: data });
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    const product = await products.getProductById(req.params.pid);
    if (!product) {
      res.status(404).send({ message: 'Product not found' });
    } else {
      res.send({ product });
    }
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});