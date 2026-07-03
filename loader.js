/* ==========================================================================
   loader.js — animated loading screen
   Sequence: S → SH → SHR → SHRE → SHREYAS ↓ MANORE, then fade into the site.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var loader = document.getElementById('loader');
  var line1 = document.getElementById('loaderLine1');
  var line2 = document.getElementById('loaderLine2');
  var barFill = document.getElementById('loaderBarFill');

  var fullName = 'SHREYAS';
  var surname = 'MANORE';
  var frames = [];
  for (var i = 1; i <= fullName.length; i++) frames.push(fullName.slice(0, i));

  // Lock scroll while loading
  document.documentElement.style.overflow = 'hidden';

  function finishLoading() {
    document.documentElement.style.overflow = '';
    loader.setAttribute('aria-hidden', 'true');
    document.body.classList.add('loaded');
    window.dispatchEvent(new CustomEvent('site:loaded'));

    if (window.gsap) {
      gsap.to(loader, {
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power2.out',
        onComplete: function () {
          loader.style.display = 'none';
        }
      });
    } else {
      loader.style.transition = 'opacity .6s ease';
      loader.style.opacity = '0';
      setTimeout(function () { loader.style.display = 'none'; }, 650);
    }
  }

  if (reduceMotion) {
    line1.textContent = fullName;
    line2.textContent = surname;
    barFill.style.width = '100%';
    setTimeout(finishLoading, 400);
    return;
  }

  var frameIndex = 0;
  var totalDuration = 1500; // ms to cycle through letters
  var stepTime = totalDuration / frames.length;

  var interval = setInterval(function () {
    line1.textContent = frames[frameIndex];
    barFill.style.width = Math.round(((frameIndex + 1) / (frames.length + 1)) * 100) + '%';
    frameIndex++;
    if (frameIndex >= frames.length) {
      clearInterval(interval);
      line2.textContent = surname;
      barFill.style.width = '100%';
      setTimeout(finishLoading, 500);
    }
  }, stepTime);
})();
