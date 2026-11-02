(() => {
  'use strict';

  // Keep local development and Cloudflare preview visits out of production reports.
  if (!['vorakarn.com', 'www.vorakarn.com'].includes(window.location.hostname)) return;
  if (window.vorakarnAnalyticsReady) return;
  window.vorakarnAnalyticsReady = true;

  const measurementId = 'G-WRJ5EJ80PT';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());

  // Only known gallery filters are included; arbitrary queries and hashes are omitted.
  const page = new URL(window.location.href);
  const category = page.searchParams.get('type');
  page.search = '';
  page.hash = '';
  if (page.pathname === '/gallery/' && ['bouquet', 'wreath', 'event'].includes(category)) {
    page.searchParams.set('type', category);
  }
  let referrer = '';
  try {
    const referrerUrl = new URL(document.referrer);
    referrer = referrerUrl.origin + referrerUrl.pathname;
  } catch (_) { /* No referrer on direct visits. */ }

  window.gtag('config', measurementId, {
    page_location: page.href,
    page_referrer: referrer,
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.appendChild(tag);

  document.addEventListener('click', event => {
    const link = event.target.closest && event.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    let method;
    if (href.startsWith('tel:')) method = 'phone';
    else {
      try {
        const url = new URL(href, window.location.href);
        if (['facebook.com', 'www.facebook.com', 'm.facebook.com'].includes(url.hostname)) {
          method = 'facebook';
        }
      } catch (_) { return; }
    }
    if (method) window.gtag('event', 'contact_click', { contact_method: method });
  });

  document.querySelectorAll('.lead-form').forEach(form => {
    // Track interactions only. Never read or transmit customer field values.
    form.addEventListener('focusin', () => {
      window.gtag('event', 'inquiry_start');
    }, { once: true });
    form.addEventListener('submit', () => {
      if (form.checkValidity()) window.gtag('event', 'inquiry_submit');
    });
  });
})();
