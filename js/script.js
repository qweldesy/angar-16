/* ANGAR16 — логика */
(function () {
  'use strict';

  if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();

  var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Motion: reveal on scroll ---------- */
  function initMotion() {
    var m = window.__motion;
    if (!m || REDUCED || !('IntersectionObserver' in window)) {
      document.documentElement.classList.remove('motion-ready');
      document.querySelectorAll('.rvl').forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      var batch = [];
      entries.forEach(function (en) {
        if (en.isIntersecting) { batch.push(en.target); io.unobserve(en.target); }
      });
      if (batch.length) {
        m.animate(batch, { opacity: [0, 1], y: [16, 0] }, {
          duration: 0.45, ease: 'easeOut',
          delay: m.stagger(0.06),
        });
        batch.forEach(function (el) { el.classList.add('is-in'); });
      }
    }, { threshold: 0.14 });
    document.querySelectorAll('.rvl').forEach(function (el) { io.observe(el); });

    /* hero: последовательное появление при загрузке */
    var heroItems = document.querySelectorAll('.hero .rvl');
    m.animate(heroItems, { opacity: [0, 1], y: [18, 0] }, {
      duration: 0.5, ease: 'easeOut', delay: m.stagger(0.09, { startDelay: 0.15 }),
    }).finished.then(function () {
      heroItems.forEach(function (el) { el.classList.add('is-in'); });
    }).catch(function () {});
  }
  document.addEventListener('motion-ready', initMotion);
  if (window.__motion) initMotion();
  /* фолбэк, если CDN не загрузился за 2.5с */
  setTimeout(function () {
    if (!window.__motion) {
      document.documentElement.classList.remove('motion-ready');
      document.querySelectorAll('.rvl').forEach(function (el) { el.classList.add('is-in'); });
    }
  }, 2500);

  /* ---------- меню ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) { nav.classList.remove('is-open'); burger.classList.remove('is-open'); }
  });

  /* ---------- дефисы в номере — той же ширины, что цифры ---------- */
  document.querySelectorAll('.nav__phone,.hphone').forEach(function (el) {
    el.innerHTML = el.textContent.split('').map(function (c) {
      return c === '-' ? '<span class="hd">-</span>' : c;
    }).join('');
  });

  /* ---------- маска телефона ---------- */
  var phone = document.getElementById('fPhone');
  phone.addEventListener('input', function () {
    var d = this.value.replace(/\D/g, '');
    if (d.startsWith('8')) d = '7' + d.slice(1);
    if (d && !d.startsWith('7')) d = '7' + d;
    d = d.slice(0, 11);
    var out = d.length ? '+7' : '';
    if (d.length > 1) out += ' (' + d.slice(1, 4);
    if (d.length >= 4) out += ')';
    if (d.length > 4) out += ' ' + d.slice(4, 7);
    if (d.length > 7) out += '-' + d.slice(7, 9);
    if (d.length > 9) out += '-' + d.slice(9, 11);
    this.value = out;
  });

  /* ---------- форма -> WhatsApp ---------- */
  document.getElementById('waForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.getElementById('fName');
    var msg = document.getElementById('fMsg');
    var car = document.getElementById('fCar');
    var okName = name.value.trim().length > 1;
    var okPhone = phone.value.replace(/\D/g, '').length === 11;
    name.classList.toggle('is-err', !okName);
    phone.classList.toggle('is-err', !okPhone);
    if (!okName || !okPhone) return;
    var text = 'Здравствуйте! Заявка с сайта ANGAR16.\nИмя: ' + name.value.trim() +
      '\nТелефон: ' + phone.value + '\nАвто: ' + (car.value.trim() || '—') +
      '\nЧто случилось: ' + (msg.value.trim() || '—');
    window.open('https://wa.me/79872256116?text=' + encodeURIComponent(text), '_blank');
  });
})();
