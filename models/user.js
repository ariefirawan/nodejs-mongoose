const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    cart: {
        items: [{ 
            productId: { type: Schema.Types.ObjectId, ref: 'Product', require: true }, 
            quantity: { type: Number, require: true } 
        }]
    }
});

userSchema.methods.addToCart = function(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });
        let newQty = 1;
        const updateCartItems = [...this.cart.items];

        if (cartProductIndex >= 0) {
            newQty = this.cart.items[cartProductIndex].quantity + 1;
            updateCartItems[cartProductIndex].quantity = newQty;
        } else {
            updateCartItems.push({ 
                productId: product._id, 
                quantity: newQty 
            })
        }
        const updateCart = {items: updateCartItems }
        this.cart = updateCart
        return this.save();
};

userSchema.methods.deleteCartItem = function(prodId) {
    const updateCartItem = this.cart.items.filter(item => {
        return item.productId.toString() !== prodId.toString();
    });
    this.cart.items = updateCartItem;
    return this.save();
};

userSchema.methods.clearCart = function() {
    this.cart = { items: [] };
    return this.save();
};

module.exports = mongoose.model('User', userSchema);