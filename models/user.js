const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this.id = new mongodb.ObjectId(id);
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this)
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        let newQty = 1;
        const updateCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            newQty = this.cart.items[cartProductIndex].quantity + 1;
            updateCartItems[cartProductIndex].quantity = newQty;
        } else {
            updateCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity: newQty })
        }
        const updateCart = {items: updateCartItems }
        const db = getDb();
        return db
        .collection('users')
        .updateOne(
            { _id: this.id },
            { $set: { cart: updateCart }}
        )
    }

    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(i => {
            return i.productId;
        })
        return db
        .collection('products')
        .find({ _id: { $in: productIds } })
        .toArray()
        .then(products => {
            return products.map(product => {
                return {...product, quantity: this.cart.items.find(idQty => {
                    return idQty.productId.toString() === product._id.toString();
                }).quantity
            }
            });
        });
    }

    deleteCartItem(prodId) {
        const updateCartItem = this.cart.items.filter(item => {
            return item.productId.toString() !== prodId.toString();
        });
        const db = getDb();
        return db.collection('users')
        .updateOne(
            { _id: this.id },
            { $set: { cart: {items: updateCartItem } }}
        );
    }

    addOrder() {
        const db = getDb();
        return this.getCart()
            .then(products => {
                const order = {
                    items: products,
                    user: {
                        _id: this.id,
                        name: this.username
                    }
                };
                return db
                .collection('orders')
                .insertOne(order)
            })
            .then(() => {
                return db
                    .collection('users')
                    .updateOne(
                    { _id: this.id },
                    { $set: { cart: { items: [] } }}
                );
            })
    }

    getOrder() {
        const db = getDb();
        return db
            .collection('orders')
            .find({ 'user._id': this.id })
            .toArray();
    }

    static findById(id) {
        const db = getDb();
        return db
        .collection('users')
        .findOne({_id: new mongodb.ObjectId(id) })
        .then(user => {
            console.log(user);
            return user;
        })
        .catch(err => console.log(err));
    }
}

module.exports = User;