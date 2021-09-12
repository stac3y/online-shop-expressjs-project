const bcrypt = require('bcryptjs');
require('custom-env').env('staging');

const User = require('../models/user');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD
    }
});

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    let successMessage = req.flash('success');

    if (successMessage.length > 0) {
        console.log(successMessage);
        successMessage = successMessage[0];
    } else {
        successMessage = null;
    }
    res.render('auth/login', {
        docTitle: 'Login',
        path: '/login',
        errorMessage: message,
        successMessage: successMessage
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password!');
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(isCompare => {
                    if (!isCompare) {
                        req.flash('error', 'Invalid email or password!');
                        return res.redirect('/login');
                    }
                    req.session.user = user;
                    req.session.isLoggedIn = true;
                    return req.session.save((err) => {
                        console.log(err);
                        res.redirect('/');
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                });
        })
        .catch(err => {
            console.log(err);
        });
}

exports.getSignup = (req, res, next) => {
    let errorMessage = req.flash('error');
    if (errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }

    res.render('auth/signup', {
        docTitle: 'Signup',
        path: '/signup',
        errorMessage: errorMessage,
        successMessage: null
    })
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User
        .findOne({email: email})
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'E-mail exists already, please pick a different one!');
                return res.redirect('/signup');
            }
            return bcrypt.hash(password, 12).then(hashedPassword => {
                const user = new User({
                    email: email,
                    password: hashedPassword,
                    cart: {items: []}
                });
                return user.save();
            })
                .then(result => {
                    req.flash('success', 'Sign up successfully!');
                    res.redirect('/login');
                    return transporter.sendMail({
                        to: email,
                        from: 'shop@node-complete.com',
                        subject: 'Signup succeed!',
                        html: '<h1>You successfully signed up!</h1>'
                    });
                })
                .then(result => {
                    console.log(result);
                })
                .catch(err => console.log(err));
        })

        .catch(err => console.log(err));

}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
        docTitle: 'Reset Password',
        path: '/reset',
        errorMessage: message,
    })
}