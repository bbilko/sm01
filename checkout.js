/* checkout.js — checkout page logic */

document.addEventListener('DOMContentLoaded', () => {
  /* --- Payment method toggle --- */
  const payBtns = document.querySelectorAll('.payment-method');
  const cardFields = document.getElementById('cardFields');
  const altPayFields = document.getElementById('altPayFields');

  payBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      payBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const method = btn.dataset.pay;
      if (method === 'card') {
        if (cardFields) cardFields.style.display = '';
        if (altPayFields) altPayFields.style.display = 'none';
      } else {
        if (cardFields) cardFields.style.display = 'none';
        if (altPayFields) altPayFields.style.display = '';
      }
    });
  });

  /* --- Shipping option toggle --- */
  const shippingOptions = document.querySelectorAll('.shipping-option');
  shippingOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      shippingOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      updateOrderTotals();
    });
  });

  /* --- Card number formatting --- */
  const cardInput = document.getElementById('cardNumber');
  if (cardInput) {
    cardInput.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '').substring(0, 16);
      e.target.value = v.replace(/(.{4})/g, '$1 ').trim();
    });
  }

  const expiryInput = document.getElementById('expiry');
  if (expiryInput) {
    expiryInput.addEventListener('input', e => {
      let v = e.target.value.replace(/\D/g, '').substring(0, 4);
      if (v.length >= 3) v = v.substring(0, 2) + ' / ' + v.substring(2);
      e.target.value = v;
    });
  }

  /* --- Render order summary from cart --- */
  renderCheckoutSummary();

  /* --- Place order --- */
  const placeOrderBtn = document.getElementById('placeOrder');
  const checkoutMain = document.getElementById('checkoutMain');
  const orderConfirm = document.getElementById('orderConfirm');

  if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', () => {
      if (!validateCheckoutForm()) return;
      /* Save order snapshot then clear cart and redirect to success */
      const cart = window.getCart ? window.getCart() : [];
      localStorage.setItem('skratch_last_order', JSON.stringify(cart));
      localStorage.removeItem('skratch_cart');
      window.location.href = 'success.html';
    });
  }
});

function validateCheckoutForm() {
  const required = ['firstName', 'lastName', 'address1', 'city', 'state', 'zip', 'email'];
  let valid = true;
  required.forEach(id => {
    const el = document.getElementById(id);
    if (el && !el.value.trim()) {
      el.classList.add('error');
      valid = false;
      el.addEventListener('input', () => el.classList.remove('error'), { once: true });
    }
  });
  if (!valid) {
    const firstErr = document.querySelector('.checkout-input.error');
    if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  return valid;
}

function renderCheckoutSummary() {
  const itemsEl = document.getElementById('checkoutSummaryItems');
  const totalsEl = document.getElementById('checkoutSummaryTotals');
  if (!itemsEl || !totalsEl) return;

  const cart = window.getCart ? window.getCart() : [];
  const fmt = window.formatPrice || (n => '$' + n.toFixed(2));
  const subtotal = cart.reduce((s, i) => s + (parseFloat(i.price) || 0) * (i.qty || 1), 0);

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p style="font-size:13px;color:var(--color-gray-mid)">Your bag is empty.</p>';
  } else {
    itemsEl.innerHTML = cart.map(item => `
      <div class="checkout-summary-item">
        <div class="checkout-summary-item-img">
          <img src="${item.image || 'assets/product-ping-eye2-1.png'}" alt="${item.name}" />
        </div>
        <div class="checkout-summary-item-info">
          <p class="checkout-summary-item-name">${item.name}</p>
          <p class="checkout-summary-item-price">${fmt((parseFloat(item.price)||0)*(item.qty||1))}</p>
        </div>
      </div>
    `).join('');
  }

  const shipping = getSelectedShipping();
  totalsEl.innerHTML = `
    <div class="checkout-totals">
      <div class="checkout-total-row"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
      <div class="checkout-total-row"><span>Shipping</span><span>${shipping.price === 0 ? 'Free' : fmt(shipping.price)}</span></div>
      <div class="checkout-total-divider"></div>
      <div class="checkout-total-row checkout-total-row--final"><span>Total</span><span>${fmt(subtotal + shipping.price)}</span></div>
    </div>
  `;
}

function getSelectedShipping() {
  const selected = document.querySelector('.shipping-option.selected');
  if (!selected) return { name: 'Standard', price: 0 };
  const method = selected.dataset.shipping;
  if (method === 'express') return { name: 'Express', price: 24 };
  if (method === 'overnight') return { name: 'Overnight', price: 48 };
  return { name: 'Standard', price: 0 };
}

function updateOrderTotals() {
  renderCheckoutSummary();
}
