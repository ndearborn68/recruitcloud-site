// moltsets-tailwind.js — header UI behavior (resources dropdown).
// NOTE: Tailwind is no longer configured here. The theme moved to
// tailwind.config.js and is compiled to /assets/tailwind.css at build time
// (replacing the old render-blocking Tailwind CDN runtime JIT).

// ── Header submenu (resources dropdown) — click toggle + outside-click close ──
(function(){
  function init(){
    const subs = document.querySelectorAll('.mh-sub');
    if(!subs.length) return;
    subs.forEach(sub => {
      const trigger = sub.querySelector('.mh-sub-trigger');
      if(!trigger) return;
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const wasOpen = sub.classList.contains('open');
        document.querySelectorAll('.mh-sub.open').forEach(s => s.classList.remove('open'));
        if(!wasOpen){
          sub.classList.add('open');
          trigger.setAttribute('aria-expanded','true');
        } else {
          trigger.setAttribute('aria-expanded','false');
        }
      });
    });
    document.addEventListener('click', (e) => {
      if(!e.target.closest('.mh-sub')){
        document.querySelectorAll('.mh-sub.open').forEach(s => {
          s.classList.remove('open');
          const t = s.querySelector('.mh-sub-trigger');
          if(t) t.setAttribute('aria-expanded','false');
        });
      }
    });
    document.addEventListener('keydown', (e) => {
      if(e.key === 'Escape'){
        document.querySelectorAll('.mh-sub.open').forEach(s => s.classList.remove('open'));
      }
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
