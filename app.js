const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));

app.use('/add-product', (req, res) => {
    console.log('In  the add-product middleware!');
    res.send('<form action="/product" method="post"><input type="text" name="title"><button type="submit">Add product</button></form>')
});

app.post('/product', (req, res) => {
    console.log(req.body.title)
    res.redirect('/');
});

app.use('/', (req, res) => {
    console.log('In the home middleware!');
    res.send('<h1>Home page</h1>')
});

app.listen(3000)
