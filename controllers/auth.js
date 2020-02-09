const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    })
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
        User.findOne({ email: email})
        .then(user => {
            if (!user) {
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
    res.render('auth/signup',{
        path: '/Sign-Up',
        pageTitle: 'Sign Up',
        isAuthenticated: false
    })
}

exports.postSignUp = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
    .then(userDoc => {
        if (userDoc) {
            return res.redirect('/');
        }
        return bcrypt.hash(password, 12)
        .then(hashpassword => {
            const user = new User({
                email: email,
                password: hashpassword,
            });
            return user.save();
        })
        .then(() => res.redirect('/login'))
        .catch(err => console.log(err))
    })
}