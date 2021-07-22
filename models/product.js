const fs = require('fs');
const path = require('path');

const rootDirectory = require('../util/path');

module.exports = class Product {
    constructor(title) {
        this.title = title;

    }

    save() {
        const p = path.join(
            rootDirectory,
            'data',
            'products.json'
        );
        fs.readFile(p, (err, fileContent) => {
            let products = [];
            if (!err) {
                products = JSON.parse(fileContent);
            }
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), err => {
                console.log(err);
            });
        });
    }

    static fetchAll(cb) {
        const p = path.join(
            rootDirectory,
            'data',
            'products.json'
        );
        fs.readFile(p, (err, data) => {
            if (err){
                cb([]);
            }
            cb(JSON.parse(data));
        })
    }
}