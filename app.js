const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
    // User.findByPk(1)
    //     .then(user => {
    //         req.user = user;
    //         next();
    //     })
    //     .catch(err => {
    //     console.log(err);
    // });
// });

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use(errorController.getError);

mongoConnect((client) => {
    console.log(client);
    app.listen(3000);
})