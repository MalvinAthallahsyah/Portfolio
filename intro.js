// The Gate of Truth — click-to-enter intro
// Session-based: shown once per browsing session, never on repeat
(function () {
  'use strict';

  var SEEN_KEY = 'gate_v1_seen';
  var intro    = document.getElementById('gate-intro');
  if (!intro) return;

  // ── Respect prefers-reduced-motion
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Skip immediately if already seen this session
  if (sessionStorage.getItem(SEEN_KEY)) {
    intro.classList.add('gi--hidden');
    return;
  }

  // ── Lock scroll while gate is showing
  document.body.style.overflow = 'hidden';

  var enterBtn = document.getElementById('gi-enter');
  var skipBtn  = document.getElementById('gi-skip');

  // ── Dismiss: fade out + reveal portfolio
  function dismiss(withAnimation) {
    // Always mark seen so session won't repeat
    sessionStorage.setItem(SEEN_KEY, '1');

    if (!withAnimation || still) {
      intro.classList.add('gi--hidden');
      document.body.style.overflow = '';
      return;
    }

    // 1. Content fades + doors slide open
    intro.classList.add('gi--open');

    // 2. After doors are ~80% open, begin overlay fade
    setTimeout(function () {
      intro.classList.add('gi--fade');
    }, 1100);

    // 3. Fully hide once fade completes
    setTimeout(function () {
      intro.classList.add('gi--hidden');
      document.body.style.overflow = '';
    }, 2100);
  }

  // ── Enter click
  if (enterBtn) {
    enterBtn.addEventListener('click', function () {
      dismiss(true);
    });
  }

  // ── Skip click
  if (skipBtn) {
    skipBtn.addEventListener('click', function () {
      dismiss(false);
    });
  }

  // ── Keyboard: Escape to skip, Enter/Space on the button already handled natively
  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Escape') {
      document.removeEventListener('keydown', handler);
      dismiss(false);
    }
  });

})();
