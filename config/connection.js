//import sequelize constructor from library
const Sequelize = require('sequelize');
// import dotenv to import env variables
require('dotenv').config();

let sequelize;

//create connection to DB
if(process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
        host: '127.0.0.1',
        dialect: 'mysql',
        port: 3306
    });
}

module.exports = sequelize;