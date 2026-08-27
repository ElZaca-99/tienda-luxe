const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Categoria = db.define('categorias', {
  nombre: { type: DataTypes.STRING, allowNull: false, unique: true },
  descripcion: DataTypes.TEXT,
  imagen: DataTypes.STRING
});

module.exports = Categoria;
