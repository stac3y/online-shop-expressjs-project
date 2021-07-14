const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    console.log('In the home middleware!');
    res.send('<h1>Home page</h1>')
});

module.exports = router;