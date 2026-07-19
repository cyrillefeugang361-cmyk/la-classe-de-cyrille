const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');

if (menuToggle && navigation) {
  menuToggle.addEventListener('click', () => {
    const open = navigation.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navigation.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

const toast = document.getElementById('toast');
const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2300);
};

const copyButton = document.getElementById('copy-email');
const paypalEmail = document.getElementById('paypal-email');
if (copyButton && paypalEmail) {
  copyButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(paypalEmail.textContent.trim());
      showToast('Adresse PayPal copiée');
    } catch {
      showToast('Sélectionnez puis copiez l’adresse PayPal');
    }
  });
}

const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(contactForm);
    const nom = String(data.get('nom') || '').trim();
    const email = String(data.get('email') || '').trim();
    const niveau = String(data.get('niveau') || '').trim();
    const message = String(data.get('message') || '').trim();
    const subject = encodeURIComponent(`Demande de renseignements - ${niveau || 'cours de soutien'}`);
    const body = encodeURIComponent(`Bonjour Cyrille,\n\nNom : ${nom}\nAdresse e-mail : ${email}\nNiveau de l'élève : ${niveau}\n\nMessage :\n${message}\n\nCordialement,\n${nom}`);
    window.location.href = `mailto:cyrillefeugang361@gmail.com?subject=${subject}&body=${body}`;
  });
}


const cookieBanner = document.getElementById('cookie-banner');
const cookieAccept = document.getElementById('cookie-accept');
const cookieRefuse = document.getElementById('cookie-refuse');
const cookieSettings = document.getElementById('cookie-settings');
const consentKey = window.LCDCAnalytics?.key || 'lcdc_analytics_consent';

function openCookieBanner() {
  if (cookieBanner) cookieBanner.hidden = false;
}

function closeCookieBanner() {
  if (cookieBanner) cookieBanner.hidden = true;
}

if (cookieBanner && !localStorage.getItem(consentKey)) {
  openCookieBanner();
}

cookieAccept?.addEventListener('click', () => {
  window.LCDCAnalytics?.applyConsent('accepted');
  closeCookieBanner();
  showToast(window.LCDCAnalytics?.configured() ? 'Mesure d’audience acceptée' : 'Préférence enregistrée — Analytics sera actif après ajout de l’identifiant');
});

cookieRefuse?.addEventListener('click', () => {
  window.LCDCAnalytics?.applyConsent('refused');
  closeCookieBanner();
  showToast('Mesure d’audience refusée');
});

cookieSettings?.addEventListener('click', openCookieBanner);

// V6 — carrousel automatique des avis
const reviewsCarousel = document.querySelector('[data-carousel]');
if (reviewsCarousel) {
  const track = reviewsCarousel.querySelector('.carousel-track');
  const slides = Array.from(reviewsCarousel.querySelectorAll('.review-slide'));
  const prevButton = reviewsCarousel.querySelector('.carousel-prev');
  const nextButton = reviewsCarousel.querySelector('.carousel-next');
  const dotsContainer = reviewsCarousel.querySelector('.carousel-dots');
  let index = 0;
  let timer = null;

  const visibleCount = () => window.innerWidth <= 620 ? 1 : (window.innerWidth <= 900 ? 2 : 3);
  const maxIndex = () => Math.max(0, slides.length - visibleCount());

  const buildDots = () => {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i <= maxIndex(); i += 1) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Afficher l’avis ${i + 1}`);
      dot.addEventListener('click', () => {
        index = i;
        updateCarousel();
        restartTimer();
      });
      dotsContainer.appendChild(dot);
    }
  };

  const updateCarousel = () => {
    index = Math.min(index, maxIndex());
    const firstSlide = slides[0];
    if (!firstSlide) return;
    const gap = 20;
    const offset = index * (firstSlide.getBoundingClientRect().width + gap);
    track.style.transform = `translateX(-${offset}px)`;
    dotsContainer?.querySelectorAll('.carousel-dot').forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === index);
      dot.setAttribute('aria-current', dotIndex === index ? 'true' : 'false');
    });
  };

  const next = () => {
    index = index >= maxIndex() ? 0 : index + 1;
    updateCarousel();
  };

  const previous = () => {
    index = index <= 0 ? maxIndex() : index - 1;
    updateCarousel();
  };

  const stopTimer = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };

  const startTimer = () => {
    stopTimer();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timer = window.setInterval(next, 5000);
    }
  };

  const restartTimer = () => {
    stopTimer();
    startTimer();
  };

  prevButton?.addEventListener('click', () => { previous(); restartTimer(); });
  nextButton?.addEventListener('click', () => { next(); restartTimer(); });
  reviewsCarousel.addEventListener('mouseenter', stopTimer);
  reviewsCarousel.addEventListener('mouseleave', startTimer);
  reviewsCarousel.addEventListener('focusin', stopTimer);
  reviewsCarousel.addEventListener('focusout', startTimer);
  window.addEventListener('resize', () => {
    buildDots();
    updateCarousel();
  });

  buildDots();
  updateCarousel();
  startTimer();
}
