const crypto = require('crypto');

const bcrypt = require('bcryptjs');
require('custom-env').env('staging');

const User = require('../models/user');
const nodemailer = require("nodemailer");
const {validationResult} = require('express-validator');

const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASSWORD
    }
});

exports.getLogin = (req, res, next) => {
    let messages = req.flash('error');
    if (messages.length <= 0) {
        messages = null;
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
        errorMessages: messages,
        successMessage: successMessage,
        oldInput: {email: "", password: ""},
        validationErrors: []
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            docTitle: 'Login',
            path: '/login',
            errorMessages: errors.array(),
            successMessage: null,
            oldInput: {email: email, password: password},
            validationErrors: errors.array()
        });
    }
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                return res.status(422).render('auth/login', {
                    docTitle: 'Login',
                    path: '/login',
                    errorMessages: [{msg:'Invalid email!'}],
                    successMessage: null,
                    oldInput: {email: email, password: password},
                    validationErrors: [{param: 'email'}]
                });
            }
            bcrypt.compare(password, user.password)
                .then(isCompare => {
                    if (!isCompare) {
                        return res.status(422).render('auth/login', {
                            docTitle: 'Login',
                            path: '/login',
                            errorMessages: [{msg:'Invalid password!'}],
                            successMessage: null,
                            oldInput: {email: email, password: password},
                            validationErrors: [{param: 'password'}]
                        });
                    }
                    req.session.user = user;
                    req.session.isLoggedIn = true;
                    return req.session.save((err) => {
                        console.log(err);
                        res.redirect('/');
                    });
                })
                .catch(err => {
                    const error= new Error(err);
                    error.httpStatusCode = 500;
                    return next(error);
                });
        })
        .catch(err => {
            const error= new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.getSignup = (req, res, next) => {
    let errorMessages = req.flash('error');
    if (!errorMessages.length <= 0) {
        errorMessages = null;
    }

    res.render('auth/signup', {
        docTitle: 'Signup',
        path: '/signup',
        errorMessages: errorMessages,
        oldInput: {email: "", password: "", confirmPassword: ""},
        validationErrors: []
    })
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            docTitle: 'Signup',
            path: '/signup',
            errorMessages: errors.array(),
            oldInput: {email: email, password: password, confirmPassword: confirmPassword},
            validationErrors: errors.array()
        });
    }
    bcrypt.hash(password, 12).then(hashedPassword => {
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
        .catch(err => {
            const error= new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
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

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, ((err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email})
            .then(user => {
                if (!user) {
                    req.flash('error', 'No account with this e-mail found!');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then((result) => {
                res.redirect('/');
                transporter.sendMail({
                    to: req.body.email,
                    from: 'shop@node-complete.com',
                    subject: 'Reset Password',
                    html: `
                    <p>You requested a password reset</p>
                    <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
                    `
                });
            })
            .catch(err => {
                const error= new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            })
    }));
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
        .then(user => {
            if (!user) {
                req.flash('error', 'Password was reset or time for resetting expired!');
                return res.redirect('/login');
            }
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/new-password', {
                docTitle: 'New Password',
                path: '/new-password',
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            })
        })
        .catch(err => {
            const error= new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;

    User.findOne({resetToken: passwordToken, resetTokenExpiration: {$gt: Date.now()}, _id: userId})
        .then(user => {
            return bcrypt.hash(newPassword, 12).then(hashedPassword => {
                user.password = hashedPassword;
                user.resetToken = null;
                user.resetTokenExpiration = undefined;
                return user.save();
            })
        })
        .then(result => {
            return res.redirect('/login');
        })
        .catch(err => {
            const error= new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        })
}