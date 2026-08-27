const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Pedido = db.define('pedidos', {
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  numero_pedido: { type: DataTypes.STRING, unique: true },
  total: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  estado: { 
    type: DataTypes.ENUM('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'),
    defaultValue: 'pendiente'
  },
  direccion_envio: DataTypes.TEXT,
  ciudad_envio: DataTypes.STRING,
  codigo_postal_envio: DataTypes.STRING,
  telefono_envio: DataTypes.STRING,
  metodo_pago: { type: DataTypes.STRING, defaultValue: 'tarjeta' },
  notas: DataTypes.TEXT
});

module.exports = Pedido;
