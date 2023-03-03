const express = require("express");
const writeToFile = require("./writeToFile");

const carts = require("./carts.json");
const cartsPath = "./carts.json";
const app = express();

const http = require("http").Server(app);
const io = require("socket.io")(http);
const products = require("./product.json");
const productsPath = "./productos.json";

const cartsRouter = express.Router();

cartsRouter.route("/").get((request, response) => {
  response.json(carts);
});

cartsRouter.route("/").post((request, response) => {
  const newCart = { id: carts.length + 1, products: [] };
  carts.push(newCart);
  writeToFile(cartsPath, carts);
  response.json(newCart);
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
  socket.emit('productList', products);
  socket.on('addProduct', (product) => {
    product.id = products.length + 1;
    products.push(product);
    writeToFile(productsPath, products);
    io.emit('productList', products);
  });
  socket.on('deleteProduct', (productId) => {
    products = products.filter((product) => product.id !== productId);
    writeToFile(productsPath, products);
    io.emit('productList', products);
  });
});

cartsRouter.route("/:id").get((request, response) => {
  const cart = carts.find((c) => c.id === parseInt(request.params.id));
  if (!cart) {
    return response.status(404).send({ error: "El carrito no ha sido encontrado" });
  }
  return response.json(cart);
});

cartsRouter.route("/:id").put((request, response) => {
  const cartIndex = carts.findIndex((c) => c.id === parseInt(request.params.id));
  if (cartIndex === -1) {
    return response.status(404).send({ error: "Carrito no encontrado" });
  }
  carts[cartIndex] = { ...carts[cartIndex], ...request.body };
  writeToFile(cartsPath, carts);
  return response.json(carts[cartIndex]);
});

cartsRouter.route("/:id").delete((request, response) => {
  const cartIndex = carts.findIndex((c) => c.id === parseInt(request.params.id));
  if (cartIndex === -1) {
    return response.status(404).send({ error: "Carrito no encontrado" });
  }
  carts.splice(cartIndex, 1);
  writeToFile(cartsPath, carts);
  return response.send("El carrito ha sido eliminado");
});

module.exports = cartsRouter;