const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();
const csrfProtection = csrf();
const store = new mongoDBStore({
    uri: 'mongodb+srv://ariefirawant:dksq7mT60cz1Qdnj@cluster0-fv6bh.mongodb.net/shop',
    collection: 'session'
})

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}));

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err))
});

app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLogIn;
    res.locals.crsfToken = req.csrfToken();
    next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use((error, req, res, next) => {
    res.redirect('/500');
})
app.use(errorController.get500);
app.use(errorController.get500);

mongoose.connect('mongodb+srv://ariefirawant:dksq7mT60cz1Qdnj@cluster0-fv6bh.mongodb.net/shop')
    .then(result => {
        console.log('Connected!')
        User.findOne()
        .then(user => {
            if(!user) {
                const user = new User({
                    name: 'arief',
                    email: 'gg@PushManager.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        })
        app.listen(3000)})
    .catch(err => console.log(err))
    




