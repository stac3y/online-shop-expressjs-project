const Product = require('../models/product');

exports.getProducts = (req, res) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                docTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(err =>
            console.log(err));
}

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product
        .findById(productId)
        .then((product) => {
            res.render('shop/product-detail', {
                product: product,
                docTitle: product.title,
                path: '/products'
            })
        })
        .catch(err => console.log(err))
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(
            products => {
                res.render('shop/index', {
                    prods: products,
                    docTitle: 'Shop',
                    path: '/'
                })
            }
        )
        .catch(err => {
            console.log(err);
        });
}

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(products => {
            res.render('shop/cart', {
                docTitle: 'Your Cart',
                path: '/cart',
                products: products
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart');
        })
}

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user
        .deleteCartProduct(productId)
        .then(result => {
            console.log('Product deleted!');
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
}

exports.postOrder = (req, res, next) => {
    req.user
        .addOrder()
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders({include: ['products']})
        .then(orders => {
            res.render('shop/orders', {
                docTitle: 'Your Orders',
                path: '/orders',
                orders: orders
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        docTitle: 'Checkout',
        path: '/checkout'
    })
}