const Product = require('../models/product')

exports.getProducts = (req, res) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {
            prods: products,
            docTitle: 'All Products',
            path: '/products'
        });
    });
}

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId, product => {
        res.render('shop/product-detail', {
            product: product,
            docTitle: product.title,
            path: '/products'
        });
    })

}

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index', {
            prods: products,
            docTitle: 'Shop',
            path: '/'
        })
    })
}

exports.getCart = (req, res, next) => {
    res.render('shop/cart', {
        docTitle: 'Your Cart',
        path: '/cart'
    })
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        docTitle: 'Your Orders',
        path: '/orders'
    })
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        docTitle: 'Checkout',
        path: '/checkout'
    })
}