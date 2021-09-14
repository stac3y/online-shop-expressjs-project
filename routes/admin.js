const express = require('express');
const {body} = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);

router.post('/add-product',
    [body('title')
        .isString()
        .withMessage('Invalid title!')
        .trim(),
        body('imageUrl')
            .isURL()
            .withMessage('Invalid image URL!')
            .trim(),
        body('price')
            .isFloat()
            .withMessage('Invalid price!')
            .trim(),
        body('description')
            .isLength({min: 5})
            .withMessage('The description must be at least 5 characters!')
            .trim()
    ],
    isAuth,
    adminController.postAddProduct);

router.get('/products', isAuth, adminController.getProducts);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post('/edit-product',
    [body('title')
        .isAlphanumeric()
        .withMessage('Invalid title!')
        .trim(),
        body('imageUrl')
            .isURL()
            .withMessage('Invalid image URL!')
            .trim(),
        body('price')
            .isFloat()
            .withMessage('Invalid price!')
            .trim(),
        body('description')
            .isLength({min: 5})
            .withMessage('The description must be at least 5 characters!')
            .trim()
    ],
    isAuth, adminController.postEditProduct);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;