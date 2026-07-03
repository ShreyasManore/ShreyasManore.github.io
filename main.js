// Main JavaScript File
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initIcons();
    initMobileMenu();
    initContactForm();
    initTypedText();
  });


  function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }


  function initMobileMenu() {
    var toggle = document.getElementById('navToggle');
    var menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    menu.querySelectorAll('[data-nav-mobile]').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }


  function initTypedText() {
    var el = document.getElementById('typedText');
    if (!el) return;

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var words = ['Engineering Student', 'Developer', 'Traveller', 'Photographer', 'Content Creator'];

    if (reduceMotion) {
      el.textContent = words[0];
      return;
    }

    var wordIndex = 0;
    var charIndex = 0;
    var typingSpeed = 55;
    var deletingSpeed = 30;
    var pauseAfterType = 1400;
    var pauseAfterDelete = 300;

    function tick() {
      var current = words[wordIndex];

      if (charIndex <= current.length) {
        el.textContent = current.slice(0, charIndex);
        charIndex++;
        setTimeout(tick, typingSpeed);
      } else {
        setTimeout(deleteTick, pauseAfterType);
      }
    }

    function deleteTick() {
      var current = words[wordIndex];
      if (charIndex > 0) {
        charIndex--;
        el.textContent = current.slice(0, charIndex);
        setTimeout(deleteTick, deletingSpeed);
      } else {
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(tick, pauseAfterDelete);
      }
    }

   
    if (document.body.classList.contains('loaded')) {
      setTimeout(tick, 900);
    } else {
      window.addEventListener('site:loaded', function () { setTimeout(tick, 900); }, { once: true });
    }
  }

 
  function initContactForm() {
    var form = document.getElementById('contactForm');
    var status = document.getElementById('formStatus');
    if (!form || !status) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        status.textContent = 'Please fill in every field before sending.';
        status.style.color = '#F87171';
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      var originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Sendingâ€¦</span>';
      submitBtn.disabled = true;

     
      setTimeout(function () {
        status.textContent = 'Message sent â€” I\'ll get back to you soon.';
        status.style.color = '#3B82F6';
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        if (window.lucide) window.lucide.createIcons();
        form.reset();
      }, 900);
    });
  }
})();
