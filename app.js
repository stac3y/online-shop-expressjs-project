const path = require('path');
require('custom-env').env('staging');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById("612e37bfbcff225981d3e913")
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
app.use(authRoutes);

app.use(errorController.getError);

mongoose.connect(`mongodb+srv://stacy:${process.env.MONGODB_PASSWORD}@cluster0.3frzt.mongodb.net/shop?retryWrites=true&w=majority`)
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

