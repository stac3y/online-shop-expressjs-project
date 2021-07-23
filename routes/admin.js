const express = require('express');

const productsController = require('../controllers/products');

const router = express.Router();

router.get('/add-product', productsController.getAddProduct);

router.post('/add-product', productsController.postAddProduct);

router.get('/products', ((req, res, next) => {
    res.render('admin/products', {
        docTitle: 'Admin products',
        path: '/admin/products'
    })
}));

module.exports = router;