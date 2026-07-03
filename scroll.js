/* ==========================================================================
   scroll.js — Lenis smooth scroll, synced with GSAP ScrollTrigger.
   Also drives the top scroll-progress bar.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var progressFill = document.getElementById('progressFill');

  function updateProgressBar() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressFill) progressFill.style.width = pct + '%';
  }

  if (reduceMotion || typeof Lenis === 'undefined') {
    window.addEventListener('scroll', updateProgressBar, { passive: true });
    updateProgressBar();
    return;
  }

  var lenis = new Lenis({
    duration: 1.1,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.2
  });

  window.lenis = lenis;

  lenis.on('scroll', function () {
    updateProgressBar();
    if (window.ScrollTrigger) ScrollTrigger.update();
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  if (window.gsap && window.ScrollTrigger) {
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // Smooth-scroll anchor links (nav, footer, hero CTAs) through Lenis
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href');
    if (id.length < 2) return;
    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -20, duration: 1.2 });

    var mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu && mobileMenu.classList.contains('is-open')) {
      mobileMenu.classList.remove('is-open');
      var toggle = document.getElementById('navToggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  updateProgressBar();
})();
