const { DataTypes } = require('sequelize');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const Usuario = db.define('usuarios', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  telefono: { type: DataTypes.STRING },
  direccion: { type: DataTypes.TEXT },
  ciudad: { type: DataTypes.STRING },
  codigo_postal: { type: DataTypes.STRING },
  rol: { type: DataTypes.ENUM('cliente', 'admin'), defaultValue: 'cliente' },
  avatar: { type: DataTypes.STRING, defaultValue: 'default.png' }
});

Usuario.beforeCreate(async (user) => {
  user.password = await bcrypt.hash(user.password, 10);
});

Usuario.prototype.validarPassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = Usuario;
