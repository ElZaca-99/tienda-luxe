const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Resena = db.define('resenas', {
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  producto_id: { type: DataTypes.INTEGER, allowNull: false },
  puntuacion: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  comentario: DataTypes.TEXT,
  aprobado: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = Resena;
