const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Favorito = db.define('favoritos', {
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  producto_id: { type: DataTypes.INTEGER, allowNull: false }
});

module.exports = Favorito;
