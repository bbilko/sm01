/* cart.js — shared cart state, drawer, and add-to-cart logic */

const CART_KEY = 'skratch_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();
}

function addToCart(item) {
  const cart = getCart();
  const existing = cart.find(i => i.id === item.id);
  if (existing) {
    existing.qty = (existing.qty || 1) + (item.qty || 1);
  } else {
    cart.push({ ...item, qty: item.qty || 1 });
  }
  saveCart(cart);
  openCartDrawer();
}

function removeFromCart(id) {
  saveCart(getCart().filter(i => i.id !== id));
}

function updateQty(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) {
    if (qty <= 0) { removeFromCart(id); return; }
    item.qty = qty;
    saveCart(cart);
  }
}

function cartTotal() {
  return getCart().reduce((sum, i) => sum + (parseFloat(i.price) || 0) * (i.qty || 1), 0);
}

function formatPrice(num) {
  return '$' + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/* ---- Drawer UI ---- */
function openCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer) { drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false'); }
  if (overlay) overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCartDrawer();
}

function closeCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (drawer) { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true'); }
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function renderCartDrawer() {
  const cart = getCart();
  const empty = document.getElementById('cartEmpty');
  const items = document.getElementById('cartItems');
  const footer = document.getElementById('cartDrawerFooter');
  const subtotal = document.getElementById('cartSubtotal');

  if (!items) return;

  if (cart.length === 0) {
    if (empty) empty.style.display = '';
    items.style.display = 'none';
    if (footer) footer.style.display = 'none';
  } else {
    if (empty) empty.style.display = 'none';
    items.style.display = '';
    if (footer) footer.style.display = '';
    if (subtotal) subtotal.textContent = formatPrice(cartTotal());

    items.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item-img">
          <img src="${item.image || 'assets/product-ping-eye2-1.png'}" alt="${item.name}" />
        </div>
        <div class="cart-item-info">
          <p class="cart-item-brand">${item.brand || ''}</p>
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">${formatPrice((parseFloat(item.price) || 0) * (item.qty || 1))}</p>
          <div class="cart-item-controls">
            <button class="qty-btn" onclick="updateQty('${item.id}', ${(item.qty||1)-1})">−</button>
            <span class="qty-num">${item.qty || 1}</span>
            <button class="qty-btn" onclick="updateQty('${item.id}', ${(item.qty||1)+1})">+</button>
            <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
          </div>
        </div>
      </div>
    `).join('');
  }
}

function updateCartUI() {
  const count = getCart().reduce((sum, i) => sum + (i.qty || 1), 0);
  const badge = document.getElementById('cartCount');
  if (badge) {
    badge.textContent = count;
    badge.style.display = count > 0 ? '' : 'none';
  }
  renderCartDrawer();
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();

  const toggle = document.getElementById('cartToggle');
  const close = document.getElementById('cartClose');
  const overlay = document.getElementById('cartOverlay');

  if (toggle) toggle.addEventListener('click', openCartDrawer);
  if (close) close.addEventListener('click', closeCartDrawer);
  if (overlay) overlay.addEventListener('click', closeCartDrawer);

  /* Sticky header scroll */
  const header = document.getElementById('siteHeader');
  if (header) {
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      header.classList.toggle('scrolled', y > 40);
      lastY = y;
    }, { passive: true });
  }
});

/* Expose globals */
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQty = updateQty;
window.getCart = getCart;
window.formatPrice = formatPrice;
window.openCartDrawer = openCartDrawer;
window.closeCartDrawer = closeCartDrawer;
