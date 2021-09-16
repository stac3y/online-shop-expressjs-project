const {validationResult} = require('express-validator');
const mongoose = require('mongoose');

const Product = require('../models/product');

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            docTitle: 'Add product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            errorMessages: errors.array(),
            product: {title: title, imageUrl: imageUrl, price: price, description: description},
            validationErrors: errors.array()
        });
    }

    const product = new Product({
        _id: _id,
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price,
        userId: req.user._id
    });
    product.save()
        .then(result => {
            console.log('Product created!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error= new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        docTitle: 'Add product',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessages: [],
        validationErrors: [],
    });
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    const productId = req.params.productId;

    if (!editMode) {
        return res.redirect('/');
    }

    Product
        .findById(productId)
        .then((product) => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                docTitle: 'Edit product',
                path: '/admin/edit-product',
                editing: editMode,
                hasError: false,
                product: product,
                errorMessages: [],
                validationErrors: [],
            });
        })
        .catch(err => {
            const error= new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;

    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            docTitle: 'Edit product',
            path: '/admin/edit-product',
            editing: true,
            hasError: true,
            errorMessages: errors.array(),
            product: {
                title: updatedTitle,
                imageUrl: updatedImageUrl,
                price: updatedPrice,
                description: updatedDescription,
                _id: productId
            },
            validationErrors: errors.array()
        });
    }

    Product.findById(productId)
        .then(product => {
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/');
            }
            product.title = updatedTitle;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDescription;
            product.price = updatedPrice;

            return product.save()
                .then(result => {
                    console.log('Product updated!');
                    res.redirect('/admin/products');
                })
        })
        .catch(err => {
            const error= new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getProducts = (req, res, next) => {
    Product.find({userId: req.user._id})
        .then(
            products => {
                res.render('admin/products', {
                    prods: products,
                    docTitle: 'Admin Products',
                    path: '/admin/products'
                });
            }
        )
        .catch(err => {
            const error= new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;

    Product.deleteOne({_id: productId, userId: req.user._id})
        .then(result => {
            console.log('Deleted product!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            const error= new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}