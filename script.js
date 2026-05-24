// Year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Language toggle
let currentLang = 'fr';

function toggleLang() {
  currentLang = currentLang === 'fr' ? 'en' : 'fr';
  document.getElementById('lang-btn').textContent = currentLang === 'fr' ? 'EN' : 'FR';
  document.documentElement.lang = currentLang;

  document.querySelectorAll('[data-fr]').forEach(el => {
    const text = el.getAttribute('data-' + currentLang);
    if (text) el.innerHTML = text;
  });
}

// Mobile menu
function toggleMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}

// Close mobile menu on outside click
document.addEventListener('click', (e) => {
  const menu = document.getElementById('mobile-menu');
  const hamburger = document.getElementById('hamburger');
  if (!menu.contains(e.target) && e.target !== hamburger) {
    menu.classList.remove('open');
  }
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
