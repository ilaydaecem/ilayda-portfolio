'use strict';

// ── Navbar: add .scrolled class on scroll ──────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Mobile menu toggle ─────────────────────────────────────────────────────
const menuBtn    = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

function closeMobileMenu() {
  mobileMenu.classList.add('hidden');
}

// ── Typed text effect ──────────────────────────────────────────────────────
function typeText(element, text, speed = 60) {
  return new Promise(resolve => {
    let i = 0;
    element.textContent = '';
    const tick = () => {
      if (i < text.length) {
        element.textContent += text[i++];
        setTimeout(tick, speed);
      } else {
        resolve();
      }
    };
    tick();
  });
}

async function runHeroTyping() {
  const nameEl    = document.getElementById('typed-name');
  const taglineEl = document.getElementById('typed-tagline');

  await typeText(nameEl, 'İlayda Öztürk', 85);
  nameEl.classList.add('done');

  await new Promise(r => setTimeout(r, 350));

  await typeText(
    taglineEl,
    'Full-stack engineer with a backend focus — Java, Spring Boot, and Docker. SDU Computer Engineering graduate · Erasmus @ Transilvania University.',
    16
  );
}

// ── Intersection Observer factory for scroll-reveal ────────────────────────
function observeAll(selector, delay = 0) {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80 + delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  els.forEach(el => observer.observe(el));
}

function observeFadeUp(selector, delay = 0) {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;
  els.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(14px)';
    el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
  });
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 100 + delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  els.forEach(el => observer.observe(el));
}

// ── Footer clock ───────────────────────────────────────────────────────────
function updateClock() {
  const el = document.getElementById('footer-time');
  if (!el) return;
  el.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false });
}

// ── Active nav highlight on scroll ────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'text-terminal-cyan',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { rootMargin: '-40% 0px -40% 0px' }
);

sections.forEach(s => sectionObserver.observe(s));

// ══════════════════════════════════════════════════
// LIGHTBOX
// ══════════════════════════════════════════════════
function initLightbox() {
  const overlay  = document.getElementById('lb-overlay');
  const lbImg    = document.getElementById('lb-img');
  const caption  = document.getElementById('lb-caption');
  const closeBtn = document.getElementById('lb-close');
  if (!overlay) return;

  function openLightbox(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt;
    caption.textContent = alt;
    overlay.classList.add('lb-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.classList.remove('lb-open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 350);
  }

  document.querySelectorAll('[data-lb-src]').forEach(el => {
    el.addEventListener('click', () => {
      openLightbox(el.dataset.lbSrc, el.dataset.lbAlt || el.alt || '');
    });
  });

  closeBtn.addEventListener('click', closeLightbox);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('lb-open')) closeLightbox();
  });
}

// ══════════════════════════════════════════════════
// CONTACT FORM  (static — simulates a send)
// ══════════════════════════════════════════════════
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const original = btn.textContent;

    btn.textContent = '// sending...';
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      btn.textContent = original;
      btn.disabled = false;
      success.classList.remove('hidden');
      setTimeout(() => success.classList.add('hidden'), 6000);
    }, 1300);
  });
}

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  runHeroTyping();

  observeAll('.section-heading');
  observeAll('.skill-group', 80);
  observeAll('.stat-card',   50);

  observeFadeUp('.exp-card',  0);
  observeFadeUp('.edu-card',  0);
  observeFadeUp('.mini-card', 60);

  initLightbox();
  initContactForm();

  updateClock();
  setInterval(updateClock, 1000);
});
