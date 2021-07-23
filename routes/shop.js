const express = require('express');

const productController = require('../controllers/products')

const router = express.Router();

router.get('/', ((req, res, next) => {
    res.render('shop/index', {
        docTitle: 'Shop',
        path: '/'
    })
}));

router.get('/products', productController.getProducts);

router.get('/cart', ((req, res, next) => {
    res.render('shop/cart', {
        docTitle: 'Cart',
        path: '/cart'
    })
}));

module.exports = router;