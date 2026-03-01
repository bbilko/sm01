/* cart-page.js — renders full cart page (cart.html) */

document.addEventListener('DOMContentLoaded', () => {
  renderCartPage();
});

function renderCartPage() {
  const grid = document.getElementById('cartPageGrid');
  if (!grid) return;

  const cart = window.getCart ? window.getCart() : [];

  if (cart.length === 0) {
    grid.innerHTML = `
      <div class="cart-page-empty">
        <p>Your bag is empty.</p>
        <a href="index.html" class="btn btn--primary">Continue Shopping</a>
      </div>
    `;
    return;
  }

  const subtotal = cart.reduce((s, i) => s + (parseFloat(i.price) || 0) * (i.qty || 1), 0);
  const fmt = window.formatPrice || (n => '$' + n.toFixed(2));

  grid.innerHTML = `
    <div class="cart-page-items">
      ${cart.map(item => `
        <div class="cart-page-item" data-id="${item.id}">
          <div class="cart-page-item-img">
            <img src="${item.image || 'assets/product-ping-eye2-1.png'}" alt="${item.name}" />
          </div>
          <div class="cart-page-item-info">
            <p class="cart-page-item-brand">${item.brand || ''}</p>
            <p class="cart-page-item-name">${item.name}</p>
            <div class="cart-page-item-controls">
              <button class="qty-btn" onclick="cartPageUpdateQty('${item.id}', ${(item.qty||1)-1})">−</button>
              <span class="qty-num">${item.qty || 1}</span>
              <button class="qty-btn" onclick="cartPageUpdateQty('${item.id}', ${(item.qty||1)+1})">+</button>
            </div>
          </div>
          <div class="cart-page-item-price">
            <p>${fmt((parseFloat(item.price) || 0) * (item.qty || 1))}</p>
            <button class="remove-btn" onclick="cartPageRemove('${item.id}')">Remove</button>
          </div>
        </div>
      `).join('')}
    </div>
    <aside class="cart-page-summary">
      <div class="cart-page-summary-inner">
        <h2 class="cart-page-summary-title">Order Summary</h2>
        <div class="cart-summary-row"><span>Subtotal</span><span id="cartPageSubtotal">${fmt(subtotal)}</span></div>
        <div class="cart-summary-row"><span>Shipping</span><span>Calculated at checkout</span></div>
        <div class="cart-summary-divider"></div>
        <div class="cart-summary-row cart-summary-row--total">
          <span>Total</span><span>${fmt(subtotal)}</span>
        </div>
        <a href="checkout.html" class="btn btn--primary btn--full" style="margin-top:24px;">Proceed to Checkout</a>
        <a href="index.html" class="btn btn--outline btn--full" style="margin-top:10px;">Continue Shopping</a>
      </div>
    </aside>
  `;
}

function cartPageUpdateQty(id, qty) {
  if (window.updateQty) window.updateQty(id, qty);
  renderCartPage();
}

function cartPageRemove(id) {
  if (window.removeFromCart) window.removeFromCart(id);
  renderCartPage();
}

window.cartPageUpdateQty = cartPageUpdateQty;
window.cartPageRemove = cartPageRemove;
