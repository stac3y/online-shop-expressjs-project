const path = require('path');
require('custom-env').env('staging');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const User = require('./models/user');

const MONGODB_URI = `mongodb+srv://stacy:${process.env.MONGODB_PASSWORD}@cluster0.3frzt.mongodb.net/shop?w=majority`;

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

// Catch errors
store.on('error', function(error) {
    console.log(error);
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'my secret', resave: false, saveUninitialized: false, store: store}));

app.use((req, res, next) =>{
    if (!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        });
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.getError);

mongoose.connect(MONGODB_URI)
    .then(result => {
        User.findOne().then(user => {
            if (!user){
                const user = new User({name: 'Stacy', email: 'stacy@test.com', cart: {items: []}});
                return user.save()
            }
        })
    })
    .then(() => {
        app.listen(3000);
    })
    .catch(err => console.log(err));

