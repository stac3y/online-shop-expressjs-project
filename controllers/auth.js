exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        docTitle: 'Login',
        path: '/login',
        isAuthenticated: req.isLoggedIn
    })
}

exports.postLogin = (req, res, next) => {
    req.isLoggedIn = true;
    res.redirect('/');
}