const fs = require('fs');
const path = require('path');

const rootDirectory = require('../util/path');

const p = path.join(
    rootDirectory,
    'data',
    'products.json'
);

const getProductsFromFile = cb => {
    fs.readFile(p, (err, data) => {
        if (err){
            cb([]);
        }
        else cb(JSON.parse(data));
    })
}

module.exports = class Product {
    constructor(title, imageUrl, description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
}