const Usuario = require('./Usuario');
const Producto = require('./Producto');
const Categoria = require('./Categoria');
const Carrito = require('./Carrito');
const Pedido = require('./Pedido');
const PedidoDetalle = require('./PedidoDetalle');
const Favorito = require('./Favorito');
const Resena = require('./Resena');
const Cupon = require('./Cupon');

// Relaciones
Usuario.hasMany(Pedido, { foreignKey: 'usuario_id' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Usuario.hasMany(Carrito, { foreignKey: 'usuario_id' });
Carrito.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Usuario.hasMany(Favorito, { foreignKey: 'usuario_id' });
Favorito.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Usuario.hasMany(Resena, { foreignKey: 'usuario_id' });
Resena.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Categoria.hasMany(Producto, { foreignKey: 'categoria_id' });
Producto.belongsTo(Categoria, { foreignKey: 'categoria_id' });

Pedido.hasMany(PedidoDetalle, { foreignKey: 'pedido_id' });
PedidoDetalle.belongsTo(Pedido, { foreignKey: 'pedido_id' });

Producto.hasMany(PedidoDetalle, { foreignKey: 'producto_id' });
PedidoDetalle.belongsTo(Producto, { foreignKey: 'producto_id' });

Producto.hasMany(Carrito, { foreignKey: 'producto_id' });
Carrito.belongsTo(Producto, { foreignKey: 'producto_id' });

Producto.hasMany(Favorito, { foreignKey: 'producto_id' });
Favorito.belongsTo(Producto, { foreignKey: 'producto_id' });

Producto.hasMany(Resena, { foreignKey: 'producto_id' });
Resena.belongsTo(Producto, { foreignKey: 'producto_id' });

module.exports = { 
  Usuario, 
  Producto, 
  Categoria, 
  Carrito, 
  Pedido, 
  PedidoDetalle, 
  Favorito, 
  Resena, 
  Cupon 
};
