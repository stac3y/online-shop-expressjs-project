const express = require('express');

const router = express.Router();

router.get('/add-product', (req, res) => {
    console.log('In  the add-product middleware!');
    res.send('<form action="/product" method="post"><input type="text" name="title"><button type="submit">Add product</button></form>')
});

router.post('/product', (req, res) => {
    console.log(req.body.title)
    res.redirect('/');
});

module.exports = router;