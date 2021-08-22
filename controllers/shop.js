const Product = require('../models/product')
const Cart = require('../models/cart')

exports.getProducts = (req, res) => {
    Product.findAll()
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
        .findByPk(productId)
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
    Product.findAll()
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
    Cart.getCart(cart => {
        Product.fetchAll()
            .then(([rows, fieldData]) => {
                const cartProducts = [];
                for (product of rows) {
                    const cartProductData = cart.products.find(prod => prod.id === product.id);
                    if (cartProductData) {
                        cartProducts.push({productData: product, qty: cartProductData.qty})
                    }
                }
                res.render('shop/cart', {
                    docTitle: 'Your Cart',
                    path: '/cart',
                    products: cartProducts
                })
            })
            .catch(err =>
                console.log(err));
    });
}
exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        Cart.addProduct(productId, product.price);
    })
    res.redirect('/cart');
}

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        Cart.deleteProduct(productId, product.price);
    })
    res.redirect('/cart');
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