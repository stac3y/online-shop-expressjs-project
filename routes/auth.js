const express = require('express');
const {check, body} = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login',
    [body('email')
        .isEmail()
        .withMessage('Please enter a valid e-mail!')
        .normalizeEmail()
        .trim(),
        body('password', 'Please enter a password with only numbers and text and at least 6 characters.')
            .isLength({min: 6})
            .isAlphanumeric()
            .trim()
    ],
    authController.postLogin);

router.get('/signup', authController.getSignup);

router.post('/signup',
    [check('email')
        .isEmail()
        .withMessage('Please enter a valid e-mail!')
        .custom((value, {req}) => {
            return User
                .findOne({email: value})
                .then(userDoc => {
                    if (userDoc) {
                       return  Promise.reject('E-mail exists already, please pick a different one!')
                    }
                })
        })
        .normalizeEmail()
        .trim(),
        body('password', 'Please enter a password with only numbers and text and at least 6 characters.')
            .isLength({min: 6})
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .custom((value, {req}) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords have to match!');
                }
                return true;
            })
            .trim()
    ],
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;