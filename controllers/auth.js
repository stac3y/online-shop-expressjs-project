const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        docTitle: 'Login',
        path: '/login',
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.postLogin = (req, res, next) => {
    User.findById("612e37bfbcff225981d3e913")
        .then(user => {
            req.session.user = user;
            req.session.isLoggedIn = true;
            req.session.save((err) => {
                console.log(err);
                res.redirect('/');
            });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        docTitle: 'Signup',
        path: '/signup',
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.postSignup = (req, res, next) => {

}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}