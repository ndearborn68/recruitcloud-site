// Preserve campaign attribution through site navigation and completed Calendly bookings.
(function () {
  'use strict';
  var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var page = new URL(window.location.href);
  var attribution = new URLSearchParams();
  if (navigator.globalPrivacyControl) return;
  keys.forEach(function (key) {
    var value = page.searchParams.get(key);
    if (value && value.length < 255) attribution.set(key, value);
  });
  if (!attribution.size) return;

  function attributedUrl(value) {
    var url = new URL(value, page);
    var booking = url.origin === 'https://calendly.com' &&
      url.pathname.replace(/\/$/, '') === '/isaacmarks/ros-assesment';
    var internal = url.origin === page.origin &&
      (url.pathname.endsWith('.html') || url.pathname.endsWith('/'));
    if (!booking && !internal) return value;
    // An explicitly tagged destination starts its own campaign attribution.
    if (keys.some(function (key) { return url.searchParams.has(key); })) return value;
    attribution.forEach(function (value, key) { url.searchParams.set(key, value); });
    return url.href;
  }

  document.querySelectorAll('a[href]').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#')) return;
    link.setAttribute('href', attributedUrl(href));
  });
  document.querySelectorAll('button[onclick]').forEach(function (button) {
    var handler = button.getAttribute('onclick');
    var match = handler.match(/^window\.location\.href=['"](https:\/\/calendly\.com\/isaacmarks\/ros-assesment)['"]$/);
    if (!match) return;
    var destination = attributedUrl(match[1]);
    button.removeAttribute('onclick');
    button.addEventListener('click', function () { window.location.href = destination; });
  });
}());
