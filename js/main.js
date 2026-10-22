// Small interactions for the portfolio. No libraries.
(function () {
  'use strict';

  const header = document.querySelector('.site-header');

  const nav = document.getElementById('site-nav');

  /* ---------- Header shadow on scroll ---------- */
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Highlight the current section in the nav ---------- */
  const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = [...new Set(navLinks.map((link) => link.getAttribute('href')))]
    .map((id) => document.querySelector(id))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === '#' + entry.target.id) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Certificate filters ---------- */
  const filterBtns = [...document.querySelectorAll('.filter')];
  const certs = [...document.querySelectorAll('.cert')];

  const hasTag = (item, tag) => item.dataset.tags.split(' ').includes(tag);

  function applyFilter(tag) {
    filterBtns.forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.filter === tag)));
    certs.forEach((cert) => { cert.hidden = tag !== 'all' && !hasTag(cert, tag); });
  }

  filterBtns.forEach((btn) => {
    const tag = btn.dataset.filter;
    const count = tag === 'all' ? certs.length : certs.filter((c) => hasTag(c, tag)).length;
    btn.querySelector('.count').textContent = count;
    btn.addEventListener('click', () => applyFilter(tag));
  });

  /* ---------- Copy email ---------- */
  const copyBtn = document.querySelector('.copy-btn');

  copyBtn.addEventListener('click', async () => {
    const text = copyBtn.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      // Older browsers / non-secure context fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    copyBtn.textContent = 'Copied!';
    setTimeout(() => { copyBtn.textContent = 'Copy email'; }, 1800);
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });

    revealEls.forEach((el) => revealer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
