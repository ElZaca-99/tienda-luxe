// ===== CONFIGURACIÓN =====
const API = '/api';
let todosLosProductos = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

const categoriasPrincipales = {
  '1': [4, 5, 6, 7],
  '2': [8, 9, 10, 11],
  '3': [12, 13, 14]
};

const emojis = {
  4: '👕', 5: '👖', 6: '👗', 7: '👟',
  8: '💄', 9: '💅', 10: '🎨', 11: '✨',
  12: '💍', 13: '👜', 14: '🌸'
};

// ===== ELEMENTOS DOM (Coinciden con tu HTML) =====
const btnLogin = document.getElementById('btnLogin');
const modalLogin = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const tabs = document.querySelectorAll('.tab');
const forms = document.querySelectorAll('.form');
const productosGrid = document.getElementById('productosGrid');
const ofertasGrid = document.getElementById('ofertasGrid');
const cartBadge = document.getElementById('cartBadge');
const favBadge = document.getElementById('favBadge');
const modalCarrito = document.getElementById('cartModal');
const btnCarrito = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const btnCheckout = document.querySelector('.checkout-btn');
const btnFavoritos = document.getElementById('favBtn');
const btnBuscar = document.getElementById('searchBtn');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');

// ===== MODAL LOGIN =====
if (btnLogin) {
  btnLogin.addEventListener('click', () => modalLogin.classList.add('active'));
}
if (closeModal) {
  closeModal.addEventListener('click', () => modalLogin.classList.remove('active'));
}
if (modalLogin) {
  modalLogin.addEventListener('click', (e) => { if (e.target === modalLogin) modalLogin.classList.remove('active'); });
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));
    tab.classList.add('active');
    const formId = tab.dataset.tab === 'login' ? 'formLogin' : 'formRegistro';
    document.getElementById(formId).classList.add('active');
  });
});

// ===== REGISTRO =====
document.getElementById('formRegistro').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('regNombre').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;

  try {
    const res = await fetch(`${API}/auth/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, password })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.msg);

    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    alert(`¡Bienvenida ${data.usuario.nombre}! 🎉`);
    modalLogin.classList.remove('active');
    actualizarUI();
  } catch (err) { alert('Error al registrar'); }
});

// ===== LOGIN =====
document.getElementById('formLogin').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target[0].value;
  const password = e.target[1].value;

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) return alert(data.msg);

    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    alert(`¡Hola de nuevo ${data.usuario.nombre}! 💕`);
    modalLogin.classList.remove('active');
    actualizarUI();
  } catch (err) { alert('Error al iniciar sesión'); }
});

function actualizarUI() {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  if (usuario) {
    btnLogin.textContent = `Hola, ${usuario.nombre.split(' ')[0]}`;
    btnLogin.onclick = () => {
      if (confirm('¿Cerrar sesión?')) {
        localStorage.clear();
        location.reload();
      }
    };
  }
}
actualizarUI();

// ===== BUSCADOR =====
if (btnBuscar) {
  btnBuscar.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    setTimeout(() => searchInput.focus(), 100);
  });
}

if (searchClose) {
  searchClose.addEventListener('click', () => {
    searchOverlay.classList.remove('active');
    searchInput.value = '';
    renderProductos(todosLosProductos);
  });
}

if (searchOverlay) {
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
      searchOverlay.classList.remove('active');
      searchInput.value = '';
      renderProductos(todosLosProductos);
    }
  });
}

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const termino = e.target.value.toLowerCase().trim();

    if (termino.length < 2) {
      renderProductos(todosLosProductos);
      return;
    }

    const filtrados = todosLosProductos.filter(p =>
    p.nombre.toLowerCase().includes(termino) ||
    (p.descripcion && p.descripcion.toLowerCase().includes(termino)) ||
    getNombreCategoria(p.categoria_id).toLowerCase().includes(termino) ||
    (p.marca && p.marca.toLowerCase().includes(termino))
    );

    renderProductos(filtrados);

    if (filtrados.length > 0) {
      document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// ===== CARRITO =====
if (btnCarrito) {
  btnCarrito.addEventListener('click', () => {
    modalCarrito.classList.add('active');
    renderCarrito();
  });
}

if (closeCart) {
  closeCart.addEventListener('click', () => modalCarrito.classList.remove('active'));
}
if (modalCarrito) {
  modalCarrito.addEventListener('click', (e) => { if (e.target === modalCarrito) modalCarrito.classList.remove('active'); });
}

function agregarCarrito(productoId) {
  const producto = todosLosProductos.find(p => p.id == productoId);
  if (!producto) return;

  const existe = carrito.find(item => item.id == productoId);

  if (existe) {
    existe.cantidad++;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: parseFloat(producto.precio),
                 cantidad: 1
    });
  }

  guardarCarrito();
  actualizarBadgeCarrito();
  alert(`¡${producto.nombre} añadido al carrito! 🛒`);
}

function eliminarDelCarrito(productoId) {
  carrito = carrito.filter(item => item.id != productoId);
  guardarCarrito();
  actualizarBadgeCarrito();
  renderCarrito();
}

function cambiarCantidad(productoId, cambio) {
  const item = carrito.find(item => item.id == productoId);
  if (!item) return;

  item.cantidad += cambio;

  if (item.cantidad <= 0) {
    eliminarDelCarrito(productoId);
    return;
  }

  guardarCarrito();
  actualizarBadgeCarrito();
  renderCarrito();
}

function guardarCarrito() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

function actualizarBadgeCarrito() {
  const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  if (cartBadge) cartBadge.textContent = total;
}

function renderCarrito() {
  if (carrito.length === 0) {
    cartItems.innerHTML = '<p style="text-align:center; color:#999; padding: 2rem;">Tu carrito está vacío</p>';
    cartTotal.textContent = '$0.00';
    return;
  }

  cartItems.innerHTML = carrito.map(item => `
  <div class="cart-item">
  <div class="cart-item-info">
  <h4>${item.nombre}</h4>
  <p>$${item.precio.toFixed(2)} x ${item.cantidad} = $${(item.precio * item.cantidad).toFixed(2)}</p>
  </div>
  <div class="cart-item-controls">
  <button onclick="cambiarCantidad(${item.id}, -1)">-</button>
  <span>${item.cantidad}</span>
  <button onclick="cambiarCantidad(${item.id}, 1)">+</button>
  <button onclick="eliminarDelCarrito(${item.id})" style="background:#ff4444; color:white;">×</button>
  </div>
  </div>
  `).join('');

  const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  cartTotal.textContent = `$${total.toFixed(2)}`;
}

window.cambiarCantidad = cambiarCantidad;
window.eliminarDelCarrito = eliminarDelCarrito;

// ===== FAVORITOS =====
if (btnFavoritos) {
  btnFavoritos.addEventListener('click', () => {
    // Para favoritos, podemos usar el mismo modal de carrito o crear uno nuevo
    // Por simplicidad, mostraremos una alerta con los favoritos o usamos el modal de carrito adaptado
    if (favoritos.length === 0) {
      alert('No tienes favoritos aún. ¡Añade algunos! 💜');
    } else {
      const nombres = favoritos.map(id => {
        const p = todosLosProductos.find(prod => prod.id == id);
        return p ? p.nombre : 'Producto';
      }).join('\n- ');
      alert('Tus favoritos:\n- ' + nombres);
    }
  });
}

function toggleFavorito(productoId) {
  const index = favoritos.indexOf(productoId);

  if (index > -1) {
    favoritos.splice(index, 1);
  } else {
    favoritos.push(productoId);
  }

  localStorage.setItem('favoritos', JSON.stringify(favoritos));
  actualizarBadgeFavoritos();
  renderProductos(todosLosProductos);
}

function actualizarBadgeFavoritos() {
  if (favBadge) favBadge.textContent = favoritos.length;
}

function esFavorito(productoId) {
  return favoritos.includes(productoId);
}

window.toggleFavorito = toggleFavorito;

// ===== CARGAR PRODUCTOS =====
async function cargarProductos() {
  try {
    const res = await fetch(`${API}/productos`);

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    todosLosProductos = await res.json();
    console.log('✅ Productos cargados:', todosLosProductos.length);

    renderProductos(todosLosProductos);
    renderOfertas();
    actualizarBadgeCarrito();
    actualizarBadgeFavoritos();
  } catch (err) {
    console.error('❌ Error cargando productos:', err);
    productosGrid.innerHTML = '<p style="text-align:center; color:#999; grid-column: 1/-1; padding: 3rem;">Error al cargar productos. Verifica que el servidor esté corriendo.</p>';
  }
}

function renderProductos(productos) {
  if (!productos || productos.length === 0) {
    productosGrid.innerHTML = '<p style="text-align:center; color:#999; grid-column: 1/-1; padding: 3rem;">No hay productos en esta categoría.</p>';
    return;
  }

  productosGrid.innerHTML = productos.map(p => {
    const emoji = emojis[p.categoria_id] || '🛍️';
    const tieneOferta = p.precio_oferta && parseFloat(p.precio_oferta) < parseFloat(p.precio);
    const favorito = esFavorito(p.id);

    return `
    <div class="producto-card">
    ${p.nuevo == 1 ? '<span class="nuevo-badge">NUEVO</span>' : ''}
    ${tieneOferta ? '<span class="oferta-badge">OFERTA</span>' : ''}

    <div class="producto-img">
    ${emoji}
    <div class="producto-actions">
    <button class="action-btn" onclick="event.stopPropagation(); toggleFavorito(${p.id})" title="Favoritos">${favorito ? '❤️' : '♡'}</button>
    <button class="action-btn" title="Vista rápida">👁️</button>
    </div>
    </div>

    <div class="producto-info">
    <p class="producto-categoria">${getNombreCategoria(p.categoria_id)}</p>
    <h3>${p.nombre}</h3>
    <div class="producto-precio-container">
    <div class="producto-precio">
    <span class="precio-actual">$${p.precio}</span>
    ${tieneOferta ? `<span class="precio-anterior">$${p.precio_oferta}</span>` : ''}
    </div>
    <button class="btn-add-cart" onclick="event.stopPropagation(); agregarCarrito(${p.id})">+ Añadir</button>
    </div>
    </div>
    </div>
    `;
  }).join('');
}

function renderOfertas() {
  const productosEnOferta = todosLosProductos.filter(p =>
  p.precio_oferta && parseFloat(p.precio_oferta) < parseFloat(p.precio)
  ).slice(0, 3);

  if (productosEnOferta.length === 0) {
    ofertasGrid.innerHTML = '<p style="text-align:center; color:#999; grid-column: 1/-1; padding: 3rem;">No hay ofertas disponibles.</p>';
    return;
  }

  ofertasGrid.innerHTML = productosEnOferta.map(p => {
    const descuento = Math.round(((parseFloat(p.precio) - parseFloat(p.precio_oferta)) / parseFloat(p.precio)) * 100);
    return `
    <div class="oferta-card">
    <h3>${p.nombre}</h3>
    <p>${p.descripcion ? p.descripcion.substring(0, 60) + '...' : 'Producto especial'}</p>
    <div class="oferta-descuento">-${descuento}% OFF</div>
    </div>
    `;
  }).join('');
}

// ===== FILTROS =====
document.querySelectorAll('.filtro-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');

    const categoria = e.target.dataset.categoria;

    if (categoria === 'todos') {
      renderProductos(todosLosProductos);
    } else {
      const subcategorias = categoriasPrincipales[categoria];
      const filtrados = todosLosProductos.filter(p => subcategorias.includes(p.categoria_id));
      renderProductos(filtrados);
    }
  });
});

// ===== CLICK EN CATEGORÍAS =====
document.querySelectorAll('.cat-card').forEach(card => {
  card.addEventListener('click', () => {
    const idCategoria = card.dataset.categoria;

    document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
    const btnFiltro = document.querySelector(`.filtro-btn[data-categoria="${idCategoria}"]`);
    if(btnFiltro) btnFiltro.classList.add('active');

    const subcategorias = categoriasPrincipales[idCategoria];
    const filtrados = todosLosProductos.filter(p => subcategorias.includes(p.categoria_id));
    renderProductos(filtrados);

    document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
  });
});

// ===== CHECKOUT =====
if (btnCheckout) {
  btnCheckout.addEventListener('click', () => {
    if (carrito.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if (!usuario) {
      alert('Debes iniciar sesión para finalizar la compra');
      modalCarrito.classList.remove('active');
      modalLogin.classList.add('active');
      return;
    }

    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    alert(`¡Gracias ${usuario.nombre}! Tu pedido por $${total.toFixed(2)} ha sido procesado. 🎉`);

    carrito = [];
    guardarCarrito();
    actualizarBadgeCarrito();
    modalCarrito.classList.remove('active');
  });
}

// ===== AYUDA =====
function getNombreCategoria(id) {
  const nombres = {
    4: 'Camisetas', 5: 'Pantalones', 6: 'Vestidos', 7: 'Zapatos',
    8: 'Pintalabios', 9: 'Pintaúñas', 10: 'Sombras', 11: 'Bases y Skincare',
    12: 'Joyas', 13: 'Bolsos', 14: 'Perfumes'
  };
  return nombres[id] || 'Producto';
}

// ===== INICIAR =====
cargarProductos();
