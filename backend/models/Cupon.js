const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Cupon = db.define('cupones', {
  codigo: { type: DataTypes.STRING, allowNull: false, unique: true },
  tipo: { type: DataTypes.ENUM('porcentaje', 'fijo'), defaultValue: 'porcentaje' },
  valor: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  minimo_compra: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  fecha_inicio: DataTypes.DATE,
  fecha_expiracion: DataTypes.DATE,
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
  usos_maximos: { type: DataTypes.INTEGER, defaultValue: 100 },
  usos_actuales: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = Cupon;
