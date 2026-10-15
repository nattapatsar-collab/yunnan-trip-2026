/* ================================================
   app.js — Yunnan Travel Brochure
   ================================================ */

// ---- NAV SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ---- MOBILE NAV ----
const navToggle = document.getElementById('navToggle');
const navLinks  = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ---- DAY TABS ----
const dayTabs    = document.querySelectorAll('.day-tab');
const dayContents = document.querySelectorAll('.day-content');

dayTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.day;

    dayTabs.forEach(t => t.classList.remove('active'));
    dayContents.forEach(c => c.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(target).classList.add('active');
  });
});

// ---- SMOOTH ANCHOR SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const id = anchor.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- INTERSECTION OBSERVER (fade-in on scroll) ----
const observerOpts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOpts);

// Add animation class to elements
const animatables = [
  '.overview-card',
  '.highlight-card',
  '.budget-item',
  '.tip-card',
  '.route-node',
  '.tl-body',
];
animatables.forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`;
    observer.observe(el);
  });
});

// Add visible state via CSS
const style = document.createElement('style');
style.textContent = `.visible { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);

// ---- BUDGET BAR ANIMATION ----
const budgetObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.bi-fill').forEach(bar => {
        const targetW = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => { bar.style.width = targetW; }, 100);
      });
      budgetObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const budgetGrid = document.querySelector('.budget-grid');
if (budgetGrid) budgetObserver.observe(budgetGrid);

// ---- ACTIVE NAV LINK ON SCROLL ----
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sTop = section.offsetTop - 120;
    if (window.scrollY >= sTop) current = section.id;
  });
  navLinkEls.forEach(link => {
    link.style.color = link.getAttribute('href') === `#${current}`
      ? 'var(--gold)'
      : '';
  });
}, { passive: true });

// ---- PARALLAX HERO ----
const heroBg = document.querySelector('.hero-img');
window.addEventListener('scroll', () => {
  if (heroBg && window.scrollY < window.innerHeight) {
    heroBg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.15}px)`;
  }
}, { passive: true });

// ---- CURSOR GLOW (desktop only) ----
if (window.matchMedia('(pointer:fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    pointer-events:none; position:fixed; width:300px; height:300px;
    border-radius:50%; top:0; left:0; z-index:0;
    background: radial-gradient(circle, rgba(212,168,83,0.06) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: top 0.1s, left 0.1s;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
}

console.log('%c🐉 ยูนนาน ดินแดนมังกร 🐉', 'color: #D4A853; font-size: 18px; font-weight: bold;');
console.log('%c24–31 ตุลาคม 2569 · ลี่เจียง · Tiger Leaping Gorge · แชงกรี-ลา', 'color: #888; font-size: 12px;');
