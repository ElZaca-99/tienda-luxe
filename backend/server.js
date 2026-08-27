require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');

require('./models/Usuario');
require('./models/Producto');
require('./models/Categoria');
require('./models/Carrito');
require('./models/Pedido');
require('./models/PedidoDetalle');
require('./models/Favorito');
require('./models/Resena');
require('./models/Cupon');

const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const favoritosRoutes = require('./routes/favoritos');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/favoritos', favoritosRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

db.sync({ force: false })
  .then(() => {
    console.log('✅ Base de datos sincronizada correctamente');
    console.log(' Tablas creadas: usuarios, productos, categorias, carrito, pedidos, pedido_detalle, favoritos, resenas, cupones');
    app.listen(process.env.PORT || 3001, () => {
      console.log('🚀 Servidor corriendo en: http://localhost:' + (process.env.PORT || 3001));
    });
  })
  .catch(err => console.error('❌ Error al sincronizar BD:', err));
