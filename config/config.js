const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('chick', 'root', '', {
  host: 'localhost',
  dialect: 'mysql', // Make sure this is a string, not an object
});

module.exports = sequelize;
