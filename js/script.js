const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
const toast = document.getElementById('toast');

menuButton?.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2600);
};

document.getElementById('copy-email')?.addEventListener('click', async () => {
  const email = document.getElementById('paypal-email').textContent.trim();
  try {
    await navigator.clipboard.writeText(email);
    showToast('Adresse PayPal copiée.');
  } catch {
    showToast(`Adresse PayPal : ${email}`);
  }
});

document.getElementById('contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`Demande de renseignements - ${data.get('name')}`);
  const body = encodeURIComponent(
    `Bonjour Cyrille,\n\n` +
    `Je souhaite obtenir des renseignements sur vos cours.\n\n` +
    `Nom : ${data.get('name')}\n` +
    `E-mail : ${data.get('email')}\n` +
    `Niveau de l'élève : ${data.get('level')}\n\n` +
    `Message :\n${data.get('message')}\n\n` +
    `Cordialement,`
  );
  window.location.href = `mailto:csipeuwou@yahoo.fr?subject=${subject}&body=${body}`;
});

document.getElementById('year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
