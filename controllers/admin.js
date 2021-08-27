const Product = require('../models/product')

exports.postAddProduct = (req, res) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;

    const product = new Product(title, price, description, imageUrl);
    product.save()
        .then(result => {
            console.log('Product created!');
            res.redirect('/admin/products');
        }).catch(err => {
        console.log(err);
    });
}

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        docTitle: 'Add product',
        path: '/admin/add-product',
        editing: false
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
                docTitle: 'Add product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product
            });
        })
        .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;

    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;

    const updatedProduct = new Product(updatedTitle, updatedPrice, updatedDescription, updatedImageUrl, productId);
    updatedProduct.save()
        .then(result => {
            console.log('Product updated!');
            res.redirect('/admin/products');
        }).catch(err => {
        console.log(err);
    });
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
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
            console.log(err);
        });
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;

    // Product.findByPk(productId)
    //     .then(product => {
    //         return product.destroy();
    //     })
    //     .then(result => {
    //         console.log('Deleted product!');
    //         res.redirect('/admin/products');
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
}