const express = require('express');
const fs = require('fs');
const path = require('path');
const exphbs = require("express-handlebars");

const app = express();
const port = 8080;

const hbs = exphbs.create({
  extname: '.handlebars',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials')
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


const productsRouter = express.Router();
const productsPath = path.join(__dirname, 'products.json');
let products = JSON.parse(fs.readFileSync(productsPath));

productsRouter
  .route('/')
  .get((request, response) => {
    res.send(products);
  });

app.use('/products', productsRouter);

const cartsRouter = express.Router();
const cartsPath = path.join(__dirname, 'carts.json');
let carts = JSON.parse(fs.readFileSync(cartsPath));


const writeToFile = (filePath, data) => {
  fs.writeFile(filePath, JSON.stringify(data));
};

cartsRouter
  .route('/')
  .post((request, response) => {
    const newCart = { id: carts.length + 1, products: [] };
    carts.push(newCart);
    writeToFile(cartsPath, carts);
    response.send(newCart);
  });

cartsRouter
  .route('/:id')
  .get((request, response) => {
    const id = parseInt(request.params.id);
    const cart = carts.find(c => c.id === id);
    response.send(cart);
  })
  .post((request, response) => {
    const id = parseInt(request.params.id);
    const cart = carts.find(c => c.id === id);
    const productId = request.body.productId;
    const product = products.find(p => p.id === productId);
    if (cart && product) {
      cart.products.push(product);
      writeToFile(cartsPath, carts);
      response.send(cart);
    } else {
      response.status(400).send({ error: 'producto no encontrado' });
    }
  });

  const viewsRouter = express.Router();
viewsRouter.route('/').get((request, response) => {
  res.render('layouts/home', { products });
});
viewsRouter.route('/realtimeproducts').get((request, response) => {
  res.render('layouts/realTimeProducts', { products });
});
app.use('/', viewsRouter);

app.use('/carts', cartsRouter);

app.listen(port, () => {
  console.log(`Servidor en el puerto http://localhost:${port}`);
});