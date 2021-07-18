const path = require('path');

const express = require('express');

const rootDirectory = require('../util/path');

const router = express.Router();
const adminData = require('./admin');

router.get('/', (req, res) => {
    const products = adminData.products;
    res.render('shop', {
            prods: products,
            docTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            productCSS: true,
            activeShop: true
        });
});

module.exports = router;