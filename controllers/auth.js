const nodemailer = require('nodemailer');
const sendgridtransports = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');

const bcrypt = require('bcryptjs');
const User = require('../models/user');

const transport = nodemailer.createTransport(sendgridtransports({
    auth: {
        api_key: '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'
    }
}));

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
        errorMessage: message
    })
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            isAuthenticated: false,
            errorMessage: errors.array()[0].msg
        })
    }
        User.findOne({ email: email})
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid Email or Password')
                res.redirect('/login')
            }
            bcrypt
            .compare(password, user.password)
            .then(match => {
                if (match) {
                    req.session.isLogIn = true;
                    req.session.user = user;
                    return req.session.save(err => {
                        console.log(err);
                        res.redirect('/');
                    });
                }
                res.redirect('/login')
            }); 
        })
        .catch(err => console.log(err))
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err)
        res.redirect('/');
    })
};

exports.getSignUp = (req, res, next) => {
    let message = req.flash('error');
        if (message.length > 0) {
            message = message[0]
        } else {
            message = null
        }
    res.render('auth/signup',{
        path: '/Sign-Up',
        pageTitle: 'Sign Up',
        isAuthenticated: false,
        errorMessage: message,
        oldInput: {
            email: '',
            password: '',
            confirmPassword: ''
        },
        validationErrors: []
    })
}

exports.postSignUp = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).render('auth/signup',{
            path: '/Sign-Up',
            pageTitle: 'Sign Up',
            isAuthenticated: false,
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: email,
                password: password,
                confirmPassword: req.body.confirmPassword
            },
            validationErrors: errors.array()
        });
    }
        return bcrypt.hash(password, 12)
        .then(hashpassword => {
            const user = new User({
                email: email,
                password: hashpassword,
            });
            return user.save();
        })
        .then(() => {
            res.redirect('/login')
            return transport.sendMail({
                to: email,
                from: 'gg@dota2.com',
                subject: 'Berhasil Sign Up dan kirim email' ,
                html: '<h1>successfully Sign Up!</h1>'
            })
            .catch(err => console.log(err))
        })
}