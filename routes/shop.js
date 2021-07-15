const path = require('path');

const express = require('express');

const rootDirectory = require('../util/path');

const router = express.Router();

router.get('/', (req, res) => {
    console.log('In the home middleware!');
    res.sendFile(path.join(rootDirectory, 'views', 'shop.html'));
});

module.exports = router;