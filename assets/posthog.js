/* PostHog website analytics for recruitcloud.io. Loaded on every live page.
   Not loaded when the browser sends a Global Privacy Control signal, or off the live domain.
   Typed fields are always masked. The data-removal pages are not recorded and have no click capture.
   Query strings are reduced to utm_* before anything is sent. */
(function () {
  var host = location.hostname;
  if (host !== 'recruitcloud.io' && host !== 'www.recruitcloud.io') return;
  if (navigator.globalPrivacyControl) return;
  var quiet = /^\/(remove-my-data|opt-out|unsubscribe|do-not-sell)(\.html|\/|$)/.test(location.pathname);
  function scrub(v) {
    if (typeof v !== 'string' || v.indexOf('?') < 0 || !/^(https?:\/\/|\/)/.test(v)) return v;
    var parts = v.split('?'), q = parts[1].split('#')[0].split('&'), keep = [];
    for (var i = 0; i < q.length; i++) if (/^utm_[a-z]+$/.test(q[i].split('=')[0])) keep.push(q[i]);
    return parts[0] + (keep.length ? '?' + keep.join('&') : '');
  }
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}p||((p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",p.onerror=function(){p=null},(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r));var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],Object.defineProperty(u,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e}}),Object.defineProperty(u.people,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(){return u.toString(1)+".people (stub)"}}),o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  posthog.init('phc_wYoCegULbCKVELneVPUrDsgbGwCjR8Xf9DqaQf6sST84', {
    api_host: 'https://us.i.posthog.com',
    defaults: '2026-08-30',
    person_profiles: 'identified_only',
    autocapture: !quiet,
    disable_session_recording: quiet,
    session_recording: { maskAllInputs: true },
    before_send: function (ev) {
      if (!ev) return ev;
      var groups = [ev.properties, ev.$set, ev.$set_once];
      for (var g = 0; g < groups.length; g++) {
        var o = groups[g];
        if (o) for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) o[k] = scrub(o[k]);
      }
      return ev;
    }
  });
  posthog.register({ site: 'recruitcloud' });
  // Named events for the booking path: a click on any "Book" link, then the choice made on the booking page.
  document.addEventListener('click', function (e) {
    try {
      var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
      if (!a) return;
      var u = new URL(a.href, location.href);
      if (u.hostname === host && /^\/book(\.html)?\/?$/.test(u.pathname)) posthog.capture('booking_click', { from_page: location.pathname });
      else if (a.id === 'consent-booking') posthog.capture('booking_continue', { measurement: 'allowed' });
      else if (u.hostname === 'calendar.app.google') posthog.capture('booking_continue', { measurement: 'declined' });
    } catch (err) {}
  }, true);
})();
