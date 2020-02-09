const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    })
};

exports.postLogin = (req, res, next) => {
        User.findById("5e3ce176932de304680f8c07")
        .then(user => {
            req.session.isLogIn = true;
            req.session.user = user;
            req.session.save(err => {
                console.log(err);
                res.redirect('/')
            })
        })
        .catch(err => console.log(err))
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err)
        res.redirect('/');
    })
};