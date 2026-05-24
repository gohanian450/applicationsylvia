// EmailJS
emailjs.init('4mrs42qJFqwonrBLx');

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

// ===== BOOKING =====
function submitBooking(e) {
  e.preventDefault();

  const name  = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const phone = document.getElementById('f-phone').value.trim();

  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = currentLang === 'fr' ? 'Envoi en cours...' : 'Sending...';

  emailjs.send('service_zhpbs5j', 'template_9krldo8', {
    name:    name,
    message: 'Courriel : ' + email + '\nTéléphone : ' + phone,
  })
  .then(() => {
    const modal = document.getElementById('modal');
    document.getElementById('modal-title').textContent = currentLang === 'fr' ? 'Demande envoyée !' : 'Request Sent!';
    document.getElementById('modal-body').innerHTML = currentLang === 'fr'
      ? `Merci <strong>${name}</strong> !<br>Nous vous contacterons bientôt au <strong>${phone}</strong> ou à <strong>${email}</strong>.`
      : `Thank you <strong>${name}</strong>!<br>We will contact you soon at <strong>${phone}</strong> or <strong>${email}</strong>.`;
    modal.classList.add('open');
    document.getElementById('booking-form').reset();
  })
  .catch(() => {
    alert(currentLang === 'fr'
      ? 'Erreur lors de l\'envoi. Veuillez réessayer ou nous appeler au 514-274-2537.'
      : 'Sending failed. Please try again or call us at 514-274-2537.');
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = currentLang === 'fr' ? 'Envoyer la demande' : 'Send Request';
  });
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

// ===== SMOOTH SCROLL =====
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
