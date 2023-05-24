const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD, {
    host: process.env.DB_HOST, // Replace with the host of your PostgreSQL database
    port: process.env.DB_PORT, // Replace with the port number of your PostgreSQL database
    dialect: 'postgres',
  });

module.exports = sequelize;

