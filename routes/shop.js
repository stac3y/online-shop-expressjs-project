const path = require('path');

const express = require('express');

const rootDirectory = require('../util/path');

const router = express.Router();
const adminData = require('./admin');

router.get('/', (req, res) => {
    console.log(adminData.products)
    res.sendFile(path.join(rootDirectory, 'views', 'shop.html'));
});

module.exports = router;