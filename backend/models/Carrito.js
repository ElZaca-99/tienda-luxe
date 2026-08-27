const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Carrito = db.define('carrito', {
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  producto_id: { type: DataTypes.INTEGER, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, defaultValue: 1 },
  talla: DataTypes.STRING,
  color: DataTypes.STRING
});

module.exports = Carrito;
