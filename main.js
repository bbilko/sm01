/* main.js — shared nav, mobile menu, header scroll */

document.addEventListener('DOMContentLoaded', () => {
  /* Nav dropdown */
  const shopToggle = document.getElementById('shopToggle');
  const shopDropdown = document.getElementById('shopDropdown');
  if (shopToggle) {
    shopToggle.addEventListener('click', e => {
      e.stopPropagation();
      const open = shopToggle.classList.toggle('open');
      shopToggle.setAttribute('aria-expanded', open);
      if (shopDropdown) shopDropdown.classList.toggle('open', open);
    });
  }
  document.addEventListener('click', () => {
    if (shopDropdown) shopDropdown.classList.remove('open');
    if (shopToggle) { shopToggle.classList.remove('open'); shopToggle.setAttribute('aria-expanded', 'false'); }
  });

  /* Mobile menu */
  const mb = document.getElementById('mobileMenuBtn');
  const mm = document.getElementById('mobileMenu');
  if (mb && mm) {
    mb.addEventListener('click', () => {
      const open = mm.classList.toggle('open');
      mb.classList.toggle('open', open);
    });
  }
});
