const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const { proteger, esAdmin } = require('../middleware/auth');

// Listar todos los productos (público)
router.get('/', async (req, res) => {
  try {
    console.log('📦 Consultando productos...');
    const productos = await Producto.findAll({
      order: [['createdAt', 'DESC']]
    });
    console.log(`✅ ${productos.length} productos encontrados`);
    res.json(productos);
  } catch (err) {
    console.error(' ERROR EN GET /productos:', err);
    console.error('Stack:', err.stack);
    res.status(500).json({ 
      msg: 'Error al obtener productos', 
      error: err.message,
      stack: err.stack 
    });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ msg: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    console.error('Error en GET /productos/:id:', err);
    res.status(500).json({ msg: 'Error al obtener producto' });
  }
});

// Crear un producto (SOLO ADMIN)
router.post('/', proteger, esAdmin, async (req, res) => {
  try {
    const nuevo = await Producto.create(req.body);
    res.status(201).json({ msg: 'Producto creado', producto: nuevo });
  } catch (err) {
    console.error('Error en POST /productos:', err);
    res.status(500).json({ msg: 'Error al crear producto' });
  }
});

// Actualizar un producto (SOLO ADMIN)
router.put('/:id', proteger, esAdmin, async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ msg: 'Producto no encontrado' });
    await producto.update(req.body);
    res.json({ msg: 'Producto actualizado', producto });
  } catch (err) {
    console.error('Error en PUT /productos/:id:', err);
    res.status(500).json({ msg: 'Error al actualizar producto' });
  }
});

// Eliminar un producto (SOLO ADMIN)
router.delete('/:id', proteger, esAdmin, async (req, res) => {
  try {
    const producto = await Producto.findByPk(req.params.id);
    if (!producto) return res.status(404).json({ msg: 'Producto no encontrado' });
    await producto.destroy();
    res.json({ msg: 'Producto eliminado' });
  } catch (err) {
    console.error('Error en DELETE /productos/:id:', err);
    res.status(500).json({ msg: 'Error al eliminar producto' });
  }
});

module.exports = router;
