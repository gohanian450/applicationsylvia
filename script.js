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

  renderCalendar();
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
const MONTHS = {
  fr: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
  en: ['January','February','March','April','May','June','July','August','September','October','November','December']
};
const DAYS = {
  fr: ['Di','Lu','Ma','Me','Je','Ve','Sa'],
  en: ['Su','Mo','Tu','We','Th','Fr','Sa']
};

// Lun–Jeu : 8h00–17h00 | Ven : 8h00–14h00 | Sam–Dim : Fermé
const SLOTS_WEEK = ['8:00','9:00','10:00','11:00','13:00','14:00','15:00','16:00'];
const SLOTS_FRI  = ['8:00','9:00','10:00','11:00','13:00'];

let calMonth = new Date().getMonth();
let calYear  = new Date().getFullYear();
let selectedDate = null;
let selectedTime = null;
let selectedMethod = null;

function selectMethod(method) {
  selectedMethod = method;
  document.querySelectorAll('.method-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('method-' + method).classList.add('selected');
}

function renderCalendar() {
  const today = new Date(); today.setHours(0,0,0,0);
  const months = MONTHS[currentLang];
  const days   = DAYS[currentLang];

  document.getElementById('cal-title').textContent = months[calMonth] + ' ' + calYear;

  const firstDay    = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  let html = days.map(d => `<div class="cal-day-name">${d}</div>`).join('');
  for (let i = 0; i < firstDay; i++) html += `<div class="cal-day empty"></div>`;

  for (let d = 1; d <= daysInMonth; d++) {
    const date    = new Date(calYear, calMonth, d);
    const isPast  = date < today;
    const dow     = date.getDay();
    const isWeekend = dow === 0 || dow === 6;
    const isToday = date.getTime() === today.getTime();
    const isSel   = selectedDate &&
      selectedDate.getDate() === d &&
      selectedDate.getMonth() === calMonth &&
      selectedDate.getFullYear() === calYear;

    const disabled = isPast || isWeekend;
    const cls = ['cal-day', disabled ? 'disabled' : '', isSel ? 'selected' : '', isToday && !isSel ? 'today' : ''].filter(Boolean).join(' ');
    html += `<div class="${cls}"${!disabled ? ` onclick="selectDate(${calYear},${calMonth},${d})"` : ''}>${d}</div>`;
  }

  document.getElementById('cal-grid').innerHTML = html;
}

function prevMonth() {
  if (calMonth === 0) { calMonth = 11; calYear--; } else calMonth--;
  renderCalendar();
}

function nextMonth() {
  if (calMonth === 11) { calMonth = 0; calYear++; } else calMonth++;
  renderCalendar();
}

function selectDate(year, month, day) {
  selectedDate = new Date(year, month, day);
  selectedTime = null;
  renderCalendar();
  renderTimeSlots();
}

function renderTimeSlots() {
  const hint  = document.getElementById('time-hint');
  const slots = document.getElementById('time-slots');
  if (!selectedDate) { hint.style.display = 'block'; slots.innerHTML = ''; return; }
  hint.style.display = 'none';

  const isFri   = selectedDate.getDay() === 5;
  const options = isFri ? SLOTS_FRI : SLOTS_WEEK;

  slots.innerHTML = options.map(t => {
    const cls = selectedTime === t ? 'time-slot selected' : 'time-slot';
    return `<button type="button" class="${cls}" onclick="selectTime('${t}')">${t}</button>`;
  }).join('');
}

function selectTime(time) {
  selectedTime = time;
  renderTimeSlots();
}

function submitBooking(e) {
  e.preventDefault();

  const name      = document.getElementById('f-name').value.trim();
  const vehicle   = document.getElementById('f-vehicle').value.trim();
  const email     = document.getElementById('f-email').value.trim();
  const phone     = document.getElementById('f-phone').value.trim();
  const sms       = document.getElementById('f-sms').checked ? 'Oui' : 'Non';
  const insurance = document.getElementById('f-insurance').value.trim();
  const policy    = document.getElementById('f-policy').value.trim();
  const claim     = document.getElementById('f-claim').value.trim();
  const comment   = document.getElementById('f-comment').value.trim();

  if (!selectedMethod) {
    alert(currentLang === 'fr' ? 'Veuillez sélectionner une méthode.' : 'Please select a method.');
    return;
  }
  if (!selectedDate) {
    alert(currentLang === 'fr' ? 'Veuillez sélectionner une date.' : 'Please select a date.');
    return;
  }
  if (!selectedTime) {
    alert(currentLang === 'fr' ? 'Veuillez sélectionner une heure.' : 'Please select a time.');
    return;
  }

  const months = MONTHS[currentLang];
  const dateStr = `${selectedDate.getDate()} ${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
  const methodLabel = selectedMethod === 'location'
    ? (currentLang === 'fr' ? 'Sur place' : 'On Location')
    : (currentLang === 'fr' ? 'Évaluation par photo' : 'Photo Appraisal');

  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = currentLang === 'fr' ? 'Envoi en cours...' : 'Sending...';

  const message = [
    '--- RENDEZ-VOUS ---',
    'Méthode   : ' + methodLabel,
    'Date      : ' + dateStr,
    '',
    '--- CLIENT ---',
    'Téléphone : ' + phone,
    'Courriel  : ' + (email || 'Non fourni'),
    'SMS       : ' + sms,
    'Véhicule  : ' + vehicle,
    '',
    '--- ASSURANCE ---',
    'Compagnie : ' + (insurance || 'Non fourni'),
    'Police    : ' + (policy   || 'Non fourni'),
    'Réclamation: ' + (claim   || 'Non fourni'),
    '',
    '--- COMMENTAIRE ---',
    comment || 'Aucun',
  ].join('\n');

  emailjs.send('service_zhpbs5j', 'template_9krldo8', {
    name:    name,
    time:    selectedTime,
    message: message,
  })
  .then(() => {
    const modal = document.getElementById('modal');
    document.getElementById('modal-title').textContent = currentLang === 'fr' ? 'Rendez-vous confirmé !' : 'Appointment Confirmed!';
    document.getElementById('modal-body').innerHTML = currentLang === 'fr'
      ? `Merci <strong>${name}</strong> !<br>Votre rendez-vous <em>${methodLabel}</em> est prévu le <strong>${dateStr} à ${selectedTime}</strong>.<br><br>Nous vous contacterons au <strong>${phone}</strong> pour confirmer.`
      : `Thank you <strong>${name}</strong>!<br>Your <em>${methodLabel}</em> appointment is set for <strong>${dateStr} at ${selectedTime}</strong>.<br><br>We will contact you at <strong>${phone}</strong> to confirm.`;
    modal.classList.add('open');

    document.getElementById('booking-form').reset();
    selectedDate = selectedTime = selectedMethod = null;
    document.querySelectorAll('.method-card').forEach(c => c.classList.remove('selected'));
    renderCalendar();
    renderTimeSlots();
  })
  .catch(() => {
    alert(currentLang === 'fr'
      ? 'Erreur lors de l\'envoi. Veuillez réessayer ou nous appeler au 514-274-2537.'
      : 'Sending failed. Please try again or call us at 514-274-2537.');
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = currentLang === 'fr' ? 'Confirmer le rendez-vous' : 'Confirm Appointment';
  });
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
}

renderCalendar();
renderTimeSlots();

// ===== SMOOTH SCROLL =====
// Smooth scroll offset for sticky navbar
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
