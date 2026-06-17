/* ===== PORTFOLIO SHARED JS ===== */

// Hide/show nav on scroll
(function () {
  const nav = document.querySelector('.nav');
  let last = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y <= 0) { nav.style.transform = 'translateY(0)'; return; }
    nav.style.transform = y > last && y > 120 ? 'translateY(-100%)' : 'translateY(0)';
    last = y;
  });
})();

// Mobile nav toggle
(function () {
  const btn   = document.querySelector('.nav__menu-btn');
  const links = document.querySelector('.nav__links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => links.classList.toggle('open'));
})();

// Scroll progress bar
(function () {
  const bar = document.getElementById('progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    bar.style.width = (pct * 100) + '%';
  });
})();
