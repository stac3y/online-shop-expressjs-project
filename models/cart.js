const fs = require('fs');

const path = require('path');

const rootDirectory = require('../util/path');

const p = path.join(
    rootDirectory,
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, productPrice) {
        //Fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0};
            if (!err) {
                cart = JSON.parse(fileContent);

            }
            //Analyze the cart => find existing product
            const existingProductIndex = cart.products.findIndex(p => p.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;

            //Add new product
            if (existingProduct) {
                updatedProduct = {...existingProduct};
                updatedProduct.qty += 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {id: id, qty: 1};
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err)
            });
        })
    }

    static deleteProduct(id, productPrice){
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0};
            if (!err) {
                cart = JSON.parse(fileContent);
                const updatedCart = {...cart};
                const product = updatedCart.products.find(product => product.id === id);
                if (!product) return;
                const productQty = product.qty;

                updatedCart.products = updatedCart.products.filter(p => p.id !== id);
                updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

                fs.writeFile(p, JSON.stringify(updatedCart), err => {
                    console.log(err)
                });
            }
        })
    }

    static getCart(cb){
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (err){
                cb(null);
            } else cb(cart);
        });
    }
}