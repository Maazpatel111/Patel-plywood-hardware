/* Patel Plywood & Hardware — main.js */

// ── NAV SCROLL ──────────────────────────────
const nav = document.getElementById('nav');
if (nav && !nav.classList.contains('scrolled')) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ── HAMBURGER ───────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}

// ── BACK TO TOP ─────────────────────────────
const btt = document.getElementById('btt');
if (btt) {
  window.addEventListener('scroll', () => {
    btt.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── SCROLL REVEAL ───────────────────────────
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => ro.observe(el));
}

// ── PRODUCT / GALLERY FILTER ─────────────────
const filterBar = document.getElementById('filterBar');
if (filterBar) {
  const btns  = filterBar.querySelectorAll('.filter-btn');
  const grid  = document.getElementById('productsGrid') || document.getElementById('galleryGrid');
  const cards = grid ? grid.querySelectorAll('[data-cat]') : [];

  // Read ?cat= from URL and auto-activate on products page
  const urlCat = new URLSearchParams(window.location.search).get('cat');
  if (urlCat) {
    btns.forEach(b => {
      b.classList.toggle('active', b.dataset.filter === urlCat);
    });
    cards.forEach(c => {
      c.classList.toggle('hidden', c.dataset.cat !== urlCat);
    });
  }

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      cards.forEach(c => {
        c.classList.toggle('hidden', f !== 'all' && c.dataset.cat !== f);
      });
    });
  });
}

// ── LIGHTBOX ────────────────────────────────
(function initLightbox() {
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  const lbPrev  = document.getElementById('lbPrev');
  const lbNext  = document.getElementById('lbNext');
  if (!lb || !lbImg) return;

  let items = [];
  let current = 0;

  function open(idx) {
    current = idx;
    lbImg.src = items[current].src;
    lbImg.alt = items[current].alt;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  }

  function prev() { current = (current - 1 + items.length) % items.length; open(current); }
  function next() { current = (current + 1) % items.length; open(current); }

  function collectItems() {
    const galItems = document.querySelectorAll('.gal-item');
    items = Array.from(galItems).map(el => ({
      src: el.dataset.src || el.querySelector('img')?.src || '',
      alt: el.querySelector('img')?.alt || ''
    }));
    galItems.forEach((el, i) => {
      el.addEventListener('click', () => open(i));
    });
  }

  collectItems();

  lbClose.addEventListener('click', close);
  lbPrev.addEventListener('click', prev);
  lbNext.addEventListener('click', next);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });
})();

// ── COUNTER ANIMATION ───────────────────────
const counters = document.querySelectorAll('.about-stat-num');
if (counters.length) {
  const co = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const raw = el.textContent.trim();
      const num = parseInt(raw);
      if (isNaN(num)) return;
      co.unobserve(el);
      const dur = 1600;
      const step = num / (dur / 16);
      let val = 0;
      const suffix = raw.replace(String(num), '');
      const t = setInterval(() => {
        val += step;
        if (val >= num) { el.textContent = num + suffix; clearInterval(t); }
        else el.textContent = Math.floor(val) + suffix;
      }, 16);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => co.observe(c));
}

// ── CONTACT FORM ─────────────────────────────
const contactForm = document.getElementById('contactForm');
const formMsg     = document.getElementById('formMsg');
if (contactForm && formMsg) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('fname')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    if (!name || !email) {
      formMsg.textContent = 'Please enter your name and email.';
      formMsg.className   = 'form-msg err';
      return;
    }
    formMsg.textContent = '';
    formMsg.className   = 'form-msg';
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = 'Sending… <i class="fas fa-spinner fa-spin"></i>';
    setTimeout(() => {
      formMsg.textContent = `Thank you, ${name}! We'll be in touch shortly.`;
      formMsg.className   = 'form-msg ok';
      contactForm.reset();
      btn.disabled = false;
      btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
    }, 1400);
  });
}
