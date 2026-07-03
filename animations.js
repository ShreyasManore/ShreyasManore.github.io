/* ==========================================================================
   animations.js — GSAP / ScrollTrigger orchestration
   ========================================================================== */

(function () {
  'use strict';

  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initAll() {
    heroEntrance();
    scrollReveals();
    navbarState();
    timelineProgress();
    backgroundParallax();
    galleryReveal();
  }

  /* ---------------------------- Hero entrance ---------------------------- */
  function heroEntrance() {
    var tl = gsap.timeline({ delay: reduceMotion ? 0 : 0.15 });

    tl.from('.hero__badge', { y: 16, opacity: 0, duration: 0.6, ease: 'power3.out' })
      .from('.hero__title .line span', {
        yPercent: 110,
        opacity: 0,
        duration: 0.9,
        ease: 'power4.out',
        stagger: 0.08
      }, '-=0.3')
      .from('.hero__typed-row', { y: 14, opacity: 0, duration: 0.5 }, '-=0.4')
      .from('.hero__lines p', { y: 14, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.3')
      .from('.hero__ctas .btn', { y: 14, opacity: 0, duration: 0.5, stagger: 0.1 }, '-=0.3')
      .from('.hero__visual', { opacity: 0, scale: 0.92, duration: 1, ease: 'power3.out' }, '-=0.9')
      .from('.scroll-indicator', { opacity: 0, duration: 0.6 }, '-=0.3');
  }

  /* ---------------------------- Generic reveals ---------------------------- */
  function scrollReveals() {
    var items = gsap.utils.toArray('[data-reveal]');
    items.forEach(function (el) {
      gsap.fromTo(el,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Stagger inner children for card grids
    gsap.utils.toArray('.card-grid, .skills__grid, .projects__grid, .testimonials__track').forEach(function (grid) {
      var children = grid.children;
      gsap.from(children, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: grid,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    });

    // Counters
    gsap.utils.toArray('[data-counter]').forEach(function (el) {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        once: true,
        onEnter: function () { animateCounter(el); }
      });
    });
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: function () { el.textContent = Math.round(obj.val); }
    });
  }

  /* ---------------------------- Navbar state ---------------------------- */
  function navbarState() {
    var navbar = document.getElementById('navbar');
    if (!navbar) return;
    ScrollTrigger.create({
      start: 40,
      end: 99999,
      onUpdate: function (self) {
        if (self.scroll() > 40) navbar.classList.add('is-scrolled');
        else navbar.classList.remove('is-scrolled');
      }
    });

    // Active link highlight
    var sections = gsap.utils.toArray('main section[id]');
    var links = document.querySelectorAll('.navbar__link[data-nav]');
    sections.forEach(function (section) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onToggle: function (self) {
          if (!self.isActive) return;
          links.forEach(function (l) { l.classList.remove('is-active'); });
          var match = document.querySelector('.navbar__link[href="#' + section.id + '"]');
          if (match) match.classList.add('is-active');
        }
      });
    });
  }

  /* ---------------------------- Timeline progress ---------------------------- */
  function timelineProgress() {
    var track = document.getElementById('timeline-track');
    var progress = document.getElementById('timelineProgress');
    var items = gsap.utils.toArray('[data-timeline-item]');
    if (!track || !progress) return;

    gsap.to(progress, {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: track,
        start: 'top 60%',
        end: 'bottom 80%',
        scrub: 0.6
      }
    });

    items.forEach(function (item) {
      ScrollTrigger.create({
        trigger: item,
        start: 'top 65%',
        toggleActions: 'play none none reverse',
        onEnter: function () { item.classList.add('is-active'); },
        onLeaveBack: function () { item.classList.remove('is-active'); }
      });
    });
  }

  /* ---------------------------- Background parallax ---------------------------- */
  function backgroundParallax() {
    if (reduceMotion) return;
    var topRight = document.getElementById('glowTopRight');
    var bottomLeft = document.getElementById('glowBottomLeft');
    if (!topRight || !bottomLeft) return;

    gsap.to(topRight, {
      y: 120,
      x: -40,
      ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.2 }
    });
    gsap.to(bottomLeft, {
      y: -100,
      x: 30,
      ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1.2 }
    });
  }

  /* ---------------------------- Gallery masonry reveal ---------------------------- */
  function galleryReveal() {
    gsap.utils.toArray('.gallery__item').forEach(function (item, i) {
      gsap.from(item, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 92%',
          toggleActions: 'play none none reverse'
        },
        delay: (i % 4) * 0.06
      });
    });
  }

  window.addEventListener('site:loaded', function () {
    initAll();
    ScrollTrigger.refresh();
  }, { once: true });
})();
