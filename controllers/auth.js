const nodemailer = require('nodemailer');
const sendgridtransports = require('nodemailer-sendgrid-transport');

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
        errorMessage: message
    })
}

exports.postSignUp = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
    .then(userDoc => {
        if (userDoc) {
            req.flash('error', 'Email already exist')
            return res.redirect('/signup');
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
        .catch(err => console.log(err))
    })
}