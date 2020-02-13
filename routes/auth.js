const express = require('express');
const { check, body } = require('express-validator/check');

const authController = require('../controllers/auth');
const User = require('../models/user')

const router = express.Router();


router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignUp);

router.post(
    '/login',
    [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email'),
    body('password','password has to be valid')
        .isLength({ min: 5 })
        .isAlphanumeric()
    ], authController.postLogin);

router.post('/logout', authController.postLogout);

router.post(
    '/signup', 
    [check('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom(( value ) => {
        return User.findOne({ email: value })
            .then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email already exist');
                }
        })
    }),
    body('password','Please enter a password with only numbers and text at least 5 characters')
    .isLength({ min: 5 }).isAlphanumeric(),
    body('confirmPassword')
    .custom(( value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('password not match')
        }
        return true;
    })
], authController.postSignUp);

module.exports = router;
