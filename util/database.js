const mysql = require('mysql2');
require('custom-env').env('staging')

pool = mysql.createPool({
    host: 'localhost',
    database: 'express-online-shop',
    user: 'root',
    password: process.env.MYSQL_PASSWORD
});

module.exports = pool.promise();