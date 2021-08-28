const {ObjectId} = require("mongodb");
const getDb = require('../util/database').getDb;

class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = id ? new ObjectId(id) : null;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this)
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        })

        const updatedCartItems = [...this.cart.items];
        let newQuantity = 1;
        if (cartProductIndex >= 0){
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        }
        else {
            updatedCartItems.push({productId: new ObjectId(product._id), quantity: newQuantity});
        }
        const updatedCart = {items: updatedCartItems};
        const db = getDb();
        return db.collection('users').updateOne({_id: this._id},
            {$set: {cart: updatedCart}})
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users')
            .findOne({_id: new ObjectId(userId)})
            .then(user => {
                console.log(user);
                return user;
            })
            .catch(err => console.log(err))
    }
}

module.exports = User;