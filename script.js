const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile navigation
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open menu');
    });
  });
}

// Scroll reveal
const revealItems = document.querySelectorAll('.reveal');
if (reduceMotion) {
  revealItems.forEach(el => el.classList.add('visible'));
} else if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealItems.forEach(el => observer.observe(el));
} else {
  revealItems.forEach(el => el.classList.add('visible'));
}

// Mouse-follow 3D tilt. Disabled on touch devices and reduced motion.
if (!reduceMotion && window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    let raf = 0;
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rx = (0.5 - y) * 8;
      const ry = (x - 0.5) * 10;

      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
      });
    });

    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf);
      card.style.transform = '';
    });
  });
}

// Cursor light on desktop
const cursorGlow = document.querySelector('.cursor-glow');
if (cursorGlow && !reduceMotion && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', event => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  }, { passive: true });
} else if (cursorGlow) {
  cursorGlow.remove();
}

// Demo lead form
const form = document.querySelector('#lead-form');
const status = document.querySelector('#form-status');

if (form && status) {
  form.addEventListener('submit', event => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();

    if (!name) {
      status.textContent = 'Please enter your name.';
      return;
    }

    status.textContent = `Thanks, ${name}! This demo form is ready to connect to your email or CRM endpoint.`;
    form.reset();
  });
}
