const Product = require('../models/product')

exports.postAddProduct = (req, res) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
}

exports.getAddProduct = (req, res) => {
    res.render('admin/add-product', {
        docTitle: 'Add product',
        path: '/admin/add-product',
    });
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {
            prods: products,
            docTitle: 'Admin Products',
            path: '/admin/products'
        });
    });
}
