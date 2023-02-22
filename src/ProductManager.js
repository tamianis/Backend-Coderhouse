const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        this.nextId = 1;
    }

    addProduct(product) {
        product.id = this.nextId++;
        fs.readFile(this.path, 'utf8', (error, data) => {
            if (error) throw error;
            let products = JSON.parse(data);
            products.push(product);
            fs.writeFile(this.path, JSON.stringify(products), (error) => {
                if (error) throw error;
            });
        });
    }

    getProducts() {
        return new Promise((resolve, reject) => {
            fs.readFile(this.path, 'utf8', (error, data) => {
                if (error) reject(error);
                resolve(JSON.parse(data));
            });
        });
    }

    getProductById(id) {
        return new Promise((resolve, reject) => {
            fs.readFile(this.path, 'utf8', (error, data) => {
                if (error) reject(error);
                let products = JSON.parse(data);
                let product = products.find(p => p.id === id);
                resolve(product);
            });
        });
    }

    updateProduct(id, product) {
        return new Promise((resolve, reject) => {
            fs.readFile(this.path, 'utf8', (error, data) => {
                if (error) reject(error);
                let products = JSON.parse(data);
                let productIndex = products.findIndex(p => p.id === id);
                products[productIndex] = { ...products[productIndex], ...product };
                fs.writeFile(this.path, JSON.stringify(products), (error) => {
                    if (error) reject(error);
                    resolve();
                });
            });
        });
    }

    deleteProduct(id) {
        return new Promise((resolve, reject) => {
            fs.readFile(this.path, 'utf8', (error, data) => {
                if (error) reject(error);
                let products = JSON.parse(data);
                products = products.filter(p => p.id !== id);
                fs.writeFile(this.path, JSON.stringify(products), (error) => {
                    if (error) reject(error);
                    resolve();
                });
            });
        });
    }
}

module.exports = ProductManager;

const productsPath = './productos.json';
const products = new ProductManager(productsPath);

const getAllProducts = products.getProducts().then(response => console.log(response));
console.log(getAllProducts);

const findProductById = products.getProductById(4).then(response => console.log(response));
console.log(findProductById);


// actualizar producto
const datosProducto = {
    title: "Kit Gamer",
    description: "KIT GAMER MOUSE + TECLADO IMICE PREMIUM AN300",
    price: 11900,
    stock: 10
}

const updateProduct = products.updateProduct(4, datosProducto).then(response => console.log(response))
console.log(updateProduct)