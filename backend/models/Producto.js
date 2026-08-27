const { DataTypes } = require('sequelize');
const db = require('../config/db');

const Producto = db.define('productos', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  descripcion: DataTypes.TEXT,
  precio: { type: DataTypes.DECIMAL(10,2), allowNull: false },
  precio_oferta: { type: DataTypes.DECIMAL(10,2) },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  categoria_id: { type: DataTypes.INTEGER },
  imagen: { type: DataTypes.STRING, defaultValue: 'default.jpg' },
  imagen2: DataTypes.STRING,
  imagen3: DataTypes.STRING,
  talla: DataTypes.STRING,
  color: DataTypes.STRING,
  marca: DataTypes.STRING,
  destacado: { type: DataTypes.BOOLEAN, defaultValue: false },
  nuevo: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = Producto;
