const { DataTypes } = require('sequelize');
const db = require('../config/db');

const PedidoDetalle = db.define('pedido_detalle', {
  pedido_id: { type: DataTypes.INTEGER, allowNull: false },
  producto_id: { type: DataTypes.INTEGER, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  precio_unitario: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  talla: DataTypes.STRING,
  color: DataTypes.STRING
});

module.exports = PedidoDetalle;
