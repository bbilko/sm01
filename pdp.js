/* pdp.js — product detail page interactions */

document.addEventListener('DOMContentLoaded', () => {
  /* --- Gallery --- */
  const mainImg = document.getElementById('pdpMainImg');
  const thumbs = document.querySelectorAll('.pdp-thumb');

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      if (mainImg) mainImg.src = thumb.dataset.src || thumb.src;
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  /* --- Quantity --- */
  const qtyInput = document.getElementById('pdpQty');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');

  if (qtyMinus) qtyMinus.addEventListener('click', () => {
    const v = parseInt(qtyInput.value) || 1;
    if (v > 1) qtyInput.value = v - 1;
  });
  if (qtyPlus) qtyPlus.addEventListener('click', () => {
    qtyInput.value = (parseInt(qtyInput.value) || 1) + 1;
  });

  /* --- Add to Cart --- */
  const addBtn = document.getElementById('addToCartBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const qty = parseInt(qtyInput?.value) || 1;
      const item = {
        id: addBtn.dataset.id || 'ping-eye2',
        name: addBtn.dataset.name || 'PING Eye 2 BeCu Iron Set',
        brand: addBtn.dataset.brand || 'PING',
        price: addBtn.dataset.price || '2000',
        image: addBtn.dataset.image || 'assets/product-ping-eye2-1.png',
        qty
      };
      window.addToCart(item);

      /* Feedback animation */
      addBtn.textContent = 'Added!';
      addBtn.classList.add('added');
      setTimeout(() => {
        addBtn.textContent = 'Add to Bag';
        addBtn.classList.remove('added');
      }, 1800);
    });
  }

  /* --- Accordion --- */
  const accordionBtns = document.querySelectorAll('.accordion-btn');
  accordionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');
      accordionBtns.forEach(b => {
        b.classList.remove('open');
        if (b.nextElementSibling) b.nextElementSibling.style.maxHeight = '0';
      });
      if (!isOpen) {
        btn.classList.add('open');
        if (panel) panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* --- Nav dropdown --- */
  const shopToggle = document.getElementById('shopToggle');
  const shopDropdown = document.getElementById('shopDropdown');
  if (shopToggle) shopToggle.addEventListener('click', e => {
    e.stopPropagation();
    const o = shopToggle.classList.toggle('open');
    shopToggle.setAttribute('aria-expanded', o);
    if (shopDropdown) shopDropdown.classList.toggle('open', o);
  });
  document.addEventListener('click', () => {
    if (shopDropdown) shopDropdown.classList.remove('open');
    if (shopToggle) { shopToggle.classList.remove('open'); shopToggle.setAttribute('aria-expanded', 'false'); }
  });

  /* --- Mobile menu --- */
  const mb = document.getElementById('mobileMenuBtn');
  const mm = document.getElementById('mobileMenu');
  if (mb) mb.addEventListener('click', () => {
    const o = mm.classList.toggle('open');
    mb.classList.toggle('open', o);
  });
});
