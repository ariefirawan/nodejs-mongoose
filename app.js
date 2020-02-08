const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'my secret', resave: false, save: false}));

app.use((req, res, next) => {
    User.findById("5e3ce176932de304680f8c07")
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err))
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://ariefirawant:dksq7mT60cz1Qdnj@cluster0-fv6bh.mongodb.net/shop?retryWrites=true&w=majority')
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
    




