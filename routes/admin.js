const express = require('express');
const {body} = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);

router.post('/add-product',
    [body('title')
        .trim()
        .isString()
        .withMessage('Invalid title!'),
        body('price')
            .isFloat()
            .withMessage('Invalid price!')
            .trim(),
        body('description')
            .trim()
            .isLength({min: 5})
            .withMessage('The description must be at least 5 characters!')
    ],
    isAuth,
    adminController.postAddProduct);

router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product',
    [body('title')
        .trim()
        .isString()
        .withMessage('Invalid title!'),
        body('price')
            .isFloat()
            .withMessage('Invalid price!')
            .trim(),
        body('description')
            .trim()
            .isLength({min: 5})
            .withMessage('The description must be at least 5 characters!')
    ],
    isAuth, adminController.postEditProduct);

router.delete('/product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;