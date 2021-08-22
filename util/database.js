const Sequelize = require('sequelize');
require('custom-env').env('staging');

const sequelize = new Sequelize('express-online-shop', 'root', process.env.MYSQL_PASSWORD, {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;