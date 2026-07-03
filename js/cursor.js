/* ==========================================================================
   cursor.js — custom cursor: outer glow ring + inner dot, smooth lerp,
   enlarges on interactive elements, shrinks on click.
   ========================================================================== */

(function () {
  'use strict';

  var isCoarsePointer = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (isCoarsePointer) {
    document.body.classList.add('no-cursor');
    return;
  }

  var cursor = document.getElementById('cursor');
  var dot = document.getElementById('cursorDot');
  if (!cursor || !dot) return;

  var mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  var ring = { x: mouse.x, y: mouse.y };
  var speed = reduceMotion ? 1 : 0.16;

  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    dot.style.transform = 'translate(' + mouse.x + 'px,' + mouse.y + 'px) translate(-50%,-50%)';
  });

  function raf() {
    ring.x += (mouse.x - ring.x) * speed;
    ring.y += (mouse.y - ring.y) * speed;
    cursor.style.transform = 'translate(' + ring.x + 'px,' + ring.y + 'px) translate(-50%,-50%)';
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  var hoverSelector = 'a, button, .skill-chip, .glass-card, .gallery__item, input, textarea, [data-cursor-hover]';

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest && e.target.closest(hoverSelector)) {
      cursor.classList.add('cursor--hover');
    }
  });
  document.addEventListener('mouseout', function (e) {
    if (e.target.closest && e.target.closest(hoverSelector)) {
      cursor.classList.remove('cursor--hover');
    }
  });

  document.addEventListener('mousedown', function () {
    cursor.classList.add('cursor--click');
    dot.classList.add('cursor-dot--click');
  });
  document.addEventListener('mouseup', function () {
    cursor.classList.remove('cursor--click');
    dot.classList.remove('cursor-dot--click');
  });

  document.addEventListener('mouseleave', function () {
    cursor.style.opacity = '0';
    dot.style.opacity = '0';
  });
  document.addEventListener('mouseenter', function () {
    cursor.style.opacity = '1';
    dot.style.opacity = '1';
  });
})();
