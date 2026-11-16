// The Gate of Truth — click-to-enter intro
// Session-based: shown once per browsing session, never on repeat
(function () {
  'use strict';

  var SEEN_KEY = 'gate_v1_seen';
  function safeGet() { try { return sessionStorage.getItem(SEEN_KEY); } catch (e) { return null; } }
  function safeSet() { try { sessionStorage.setItem(SEEN_KEY, '1'); } catch (e) {} }
  var intro    = document.getElementById('gate-intro');
  if (!intro) return;

  // ── Respect prefers-reduced-motion
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Skip immediately if already seen this session
  if (safeGet()) {
    intro.classList.add('gi--hidden');
    return;
  }

  // ── Lock scroll while gate is showing
  // styles.css sets html { overflow-x: clip }, which disables the normal
  // body→viewport overflow hand-off — so the lock goes on <html> itself.
  // Also snap to the top: the gate is opaque and a mid-page restore
  // position would sit hidden behind it.
  document.documentElement.classList.add('gate-locked');
  document.documentElement.scrollTop = 0;

  var enterBtn = document.getElementById('gi-enter');
  var skipBtn  = document.getElementById('gi-skip');

  // ── Dismiss: fade out + reveal portfolio
  function dismiss(withAnimation) {
    // Always mark seen so session won't repeat
    safeSet();

    if (!withAnimation || still) {
      intro.classList.add('gi--hidden');
      document.documentElement.classList.remove('gate-locked');
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
      document.documentElement.classList.remove('gate-locked');
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
