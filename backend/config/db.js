const { Sequelize } = require('sequelize');
require('dotenv').config();

const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
  }
);

db.authenticate()
  .then(() => console.log('✅ Conectado a MariaDB/MySQL correctamente'))
  .catch(err => console.error('❌ Error de conexión:', err));

module.exports = db;
