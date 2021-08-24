const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
        console.log(err);
    });

});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getError);

//User => Product (one-to-many)
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);

// User => Cart (one-to-one)
User.hasOne(Cart);
Cart.belongsTo(User);

//Cart => Product (many-to-many)
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

//User => Order (one-to-many)
User.hasMany(Order);
Order.belongsTo(User);

//Order => Product (many-to-many)
Order.belongsToMany(Product, {through: OrderItem});
Product.belongsToMany(Order, {through: OrderItem});

// sequelize.sync({force: true})
sequelize.sync()
    .then(result => {
        return User.findByPk(1)
        // console.log(result);
    })
    .then(user => {
        if (!user) {
            return User.create({name: 'Stacy', email: 'stacy@test.com'})
        }
        return user;
    })
    .then(user => {
        console.log(user.cart);
            // return user.createCart();
    })
    .then(cart=>{
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });

