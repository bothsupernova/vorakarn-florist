(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'ปิดเมนู' : 'เปิดเมนู');
      nav.classList.toggle('open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'เปิดเมนู');
    }));
  }

  const galleryItems = [...document.querySelectorAll('.gallery-card')];
  const tabs = [...document.querySelectorAll('.gallery-tabs .tab')];
  let visibleItems = galleryItems;
  function applyFilter(tab) {
    const filter = tab.dataset.filter;
    tabs.forEach(other => {
      const active = tab === other;
      other.classList.toggle('active', active);
      other.setAttribute('aria-pressed', String(active));
    });
    visibleItems = galleryItems.filter(item => filter === 'all' || item.dataset.cat === filter);
    galleryItems.forEach(item => { item.hidden = !visibleItems.includes(item); });
  }

  function filterFromUrl() {
    const requestedFilter = new URLSearchParams(window.location.search).get('type');
    return tabs.find(tab => tab.dataset.filter === requestedFilter) || tabs.find(tab => tab.dataset.filter === 'all');
  }

  tabs.forEach(tab => tab.addEventListener('click', () => {
    applyFilter(tab);
    const url = new URL(window.location.href);
    if (tab.dataset.filter === 'all') url.searchParams.delete('type');
    else url.searchParams.set('type', tab.dataset.filter);
    if (url.href !== window.location.href) window.history.pushState(null, '', url);
  }));

  if (tabs.length) {
    applyFilter(filterFromUrl());
    window.addEventListener('popstate', () => applyFilter(filterFromUrl()));
  }

  const lightbox = document.getElementById('lightbox');
  const mainImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
  const caption = lightbox ? lightbox.querySelector('.lightbox-caption') : null;
  const close = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  let currentIndex = 0;
  let lastFocused = null;
  function showImage(index) {
    currentIndex = (index + visibleItems.length) % visibleItems.length;
    const item = visibleItems[currentIndex];
    mainImg.src = item.dataset.image;
    mainImg.alt = item.dataset.alt;
    const categoryLabels = { wreath: 'พวงหรีดแสดงความอาลัย', bouquet: 'แจกันและช่อดอกไม้', event: 'งานตกแต่งสถานที่' };
    caption.textContent = `${categoryLabels[item.dataset.cat] || 'ผลงานดอกไม้'} · Vorakarn Florist`;
  }
  galleryItems.forEach(item => item.addEventListener('click', () => {
    lastFocused = item;
    showImage(visibleItems.indexOf(item));
    if (typeof lightbox.showModal === 'function') lightbox.showModal();
  }));
  if (close) close.addEventListener('click', () => lightbox.close());
  if (lightbox) lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showImage(currentIndex - 1));
  if (lightbox) lightbox.querySelector('.lightbox-next').addEventListener('click', () => showImage(currentIndex + 1));
  if (lightbox) lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });
  if (lightbox) lightbox.addEventListener('close', () => { mainImg.removeAttribute('src'); if (lastFocused) lastFocused.focus(); });
  document.addEventListener('keydown', event => {
    if (!lightbox || !lightbox.open) return;
    if (event.key === 'ArrowRight') showImage(currentIndex + 1);
    if (event.key === 'ArrowLeft') showImage(currentIndex - 1);
  });
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('js-reveal');
    const observer = new IntersectionObserver((entries, obs) => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('visible'); obs.unobserve(entry.target);
      }
    }, { threshold: .07, rootMargin: '0px 0px 70px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
})();
