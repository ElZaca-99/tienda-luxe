const express = require('express');
const router = express.Router();
const { Favorito, Producto } = require('../models');
const { proteger } = require('../middleware/auth');

// Obtener favoritos del usuario
router.get('/', proteger, async (req, res) => {
  try {
    const favoritos = await Favorito.findAll({
      where: { usuario_id: req.usuario.id },
      include: [{ model: Producto }]
    });
    res.json(favoritos);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener favoritos' });
  }
});

// Agregar a favoritos
router.post('/:productoId', proteger, async (req, res) => {
  try {
    const { productoId } = req.params;
    
    // Verificar si ya existe
    const existe = await Favorito.findOne({
      where: { usuario_id: req.usuario.id, producto_id: productoId }
    });
    
    if (existe) {
      return res.status(400).json({ msg: 'Ya está en favoritos' });
    }
    
    const favorito = await Favorito.create({
      usuario_id: req.usuario.id,
      producto_id: productoId
    });
    
    res.status(201).json({ msg: 'Añadido a favoritos', favorito });
  } catch (err) {
    res.status(500).json({ msg: 'Error al añadir a favoritos' });
  }
});

// Eliminar de favoritos
router.delete('/:productoId', proteger, async (req, res) => {
  try {
    const { productoId } = req.params;
    
    const eliminado = await Favorito.destroy({
      where: { usuario_id: req.usuario.id, producto_id: productoId }
    });
    
    if (!eliminado) {
      return res.status(404).json({ msg: 'No encontrado en favoritos' });
    }
    
    res.json({ msg: 'Eliminado de favoritos' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al eliminar de favoritos' });
  }
});

module.exports = router;
