const Product = require('../models/product')

exports.getAddProduct = (req, res) => {
    res.render('admin/add-product', {
        docTitle: 'Add product',
        path: '/admin/add-product',
    });
}

exports.postAddProduct = (req, res) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
}

exports.getProducts = (req, res) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {
            prods: products,
            docTitle: 'Shop',
            path: '/'
        });
    });
}