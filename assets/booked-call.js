(function () {
  'use strict';
  var pixelId = 'TAApV4jFGBKf1cQGXuL361';
  var params = new URLSearchParams(location.search);
  var booking = new URL('https://calendly.com/isaacmarks/ros-assesment');
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (key) {
    var value = params.get(key);
    if (value && value.length < 255 && !navigator.globalPrivacyControl) booking.searchParams.set(key, value);
  });
  document.getElementById('direct-booking').href = booking.href;
  var consent = document.getElementById('measurement');
  consent.disabled = !!navigator.globalPrivacyControl;
  var seen = new Set();
  var initialized = false;
  consent.addEventListener('change', function () {
    if (navigator.globalPrivacyControl) return;
    if (!initialized && consent.checked) {
      var queue = function () { queue.q.push(arguments); };
      queue.q = [];
      window.oaiq = queue;
      queue('consent', true);
      queue('init', {pixelId: pixelId});
      var script = document.createElement('script');
      script.src = 'https://bzrcdn.openai.com/sdk/oaiq.min.js';
      script.async = true;
      document.head.appendChild(script);
      initialized = true;
    } else if (window.oaiq) {
      window.oaiq('consent', consent.checked);
    }
  });
  window.addEventListener('message', function (event) {
    var frame = document.querySelector('#calendar iframe');
    if (event.origin !== 'https://calendly.com' || !frame || event.source !== frame.contentWindow) return;
    if (!event.data || event.data.event !== 'calendly.event_scheduled') return;
    document.getElementById('booking-status').textContent = 'Your call is booked. Calendly will email your confirmation.';
    var uri = event.data.payload && event.data.payload.invitee && event.data.payload.invitee.uri;
    if (!uri || seen.has(uri) || !consent.checked || navigator.globalPrivacyControl || !window.oaiq) return;
    seen.add(uri);
    // Use the booking identifier for deduplication. No invitee names or emails are sent.
    window.oaiq('measure', 'appointment_scheduled', {type: 'customer_action'}, {event_id: uri.split('/').pop(), opt_out: true});
  });
  if (window.Calendly) Calendly.initInlineWidget({url: booking.href, parentElement: document.getElementById('calendar')});
}());
