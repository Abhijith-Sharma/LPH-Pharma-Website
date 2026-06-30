/* ============================================================
   M/s. LPH PHARMA PVT LTD — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ── Navbar scroll behavior ── */
  var navbar = document.getElementById('navbar');
  if (navbar) {
    function handleScroll() {
      if (window.scrollY > 10) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ── Mobile nav ── */
  var hamburger     = document.getElementById('hamburger');
  var mobileNav     = document.getElementById('mobileNav');
  var mobileClose   = document.getElementById('mobileClose');
  var mobileOverlay = document.getElementById('mobileNavOverlay');

  function openMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    if (!mobileNav) return;
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (hamburger)     hamburger.addEventListener('click', openMobileNav);
  if (mobileClose)   mobileClose.addEventListener('click', closeMobileNav);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);

  /* Close when a primary link is clicked */
  if (mobileNav) {
    mobileNav.querySelectorAll('.mobile-nav-link').forEach(function (link) {
      link.addEventListener('click', closeMobileNav);
    });
  }

  /* Accordion groups — Place Order / Sales Statement */
  if (mobileNav) {
    mobileNav.querySelectorAll('.mobile-nav-group-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isOpen = btn.classList.contains('open');
        /* Collapse all groups */
        mobileNav.querySelectorAll('.mobile-nav-group-btn').forEach(function (b) {
          b.classList.remove('open');
          var sub = b.nextElementSibling;
          if (sub) sub.classList.remove('open');
        });
        /* Expand this one if it was closed */
        if (!isOpen) {
          btn.classList.add('open');
          var subLinks = btn.nextElementSibling;
          if (subLinks) subLinks.classList.add('open');
        }
      });
    });
  }

  /* Close mobile nav on Escape key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileNav();
  });

  /* ── Active nav link (anchor tags only) ── */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPage === '') currentPage = 'index.html';

  document.querySelectorAll('a.nav-link').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    if (
      (currentPage === 'index.html' && href === 'index.html') ||
      (currentPage === 'contact.html' && href === 'contact.html')
    ) {
      link.classList.add('active');
    }
  });

  /* ── Dropdown — click-toggle + keyboard ── */
  document.querySelectorAll('.nav-item.has-dropdown').forEach(function (item) {
    var trigger  = item.querySelector('button.nav-link');
    var dropdown = item.querySelector('.nav-dropdown');
    if (!trigger || !dropdown) return;

    /* Click toggles */
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = item.classList.contains('dropdown-open');
      closeAllDropdowns();
      if (!isOpen) {
        item.classList.add('dropdown-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    /* Keyboard */
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      }
      if (e.key === 'Escape') closeAllDropdowns();
    });

    /* Keep open while mouse is inside item or dropdown */
    var closeTimer;
    item.addEventListener('mouseenter', function () { clearTimeout(closeTimer); });
    item.addEventListener('mouseleave', function () {
      closeTimer = setTimeout(function () {
        item.classList.remove('dropdown-open');
        trigger.setAttribute('aria-expanded', 'false');
      }, 120);
    });
  });

  function closeAllDropdowns() {
    document.querySelectorAll('.nav-item.has-dropdown').forEach(function (item) {
      item.classList.remove('dropdown-open');
      var btn = item.querySelector('button.nav-link');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.nav-item')) closeAllDropdowns();
  });

  /* ── Scroll reveal ── */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ── Counter animation ── */
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

    function animateCounter(el) {
      var target   = parseFloat(el.dataset.count);
      var suffix   = el.dataset.suffix || '';
      var decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
      var duration = 1800;
      var start    = performance.now();

      function step(now) {
        var elapsed  = now - start;
        var progress = Math.min(elapsed / duration, 1);
        var value    = easeOutQuart(progress) * target;
        var display  = decimals ? value.toFixed(decimals) : Math.floor(value);
        /* Format numbers >= 1000 with comma */
        if (!decimals && value >= 1000) {
          display = Math.floor(value).toLocaleString();
        }
        el.textContent = display + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ── Contact form ── */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn        = form.querySelector('.form-submit');
      var successMsg = document.getElementById('formSuccess');

      btn.disabled = true;
      btn.innerHTML =
        '<svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:white;animation:spin 0.8s linear infinite">' +
        '<path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>' +
        '</svg> Sending…';

      setTimeout(function () {
        btn.disabled = false;
        btn.innerHTML =
          'Submit Enquiry <svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:white;">' +
          '<path d="M2 21l21-9L2 3v7l15 2-15 2z"/></svg>';
        if (successMsg) {
          successMsg.classList.add('show');
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        form.reset();
        setTimeout(function () {
          if (successMsg) successMsg.classList.remove('show');
        }, 5000);
      }, 1800);
    });
  }

  /* ── Quote Slider ── */
  var quoteSlider = document.getElementById('quoteSlider');
  if (quoteSlider) {
    var slides      = quoteSlider.querySelectorAll('.quote-slide');
    var dots        = document.querySelectorAll('#quoteDots .quote-dot');
    var currentSlide = 0;
    var totalSlides  = slides.length;
    var slideTimer;

    function goToQuote(nextIdx) {
      if (nextIdx === currentSlide) return;
      var prev = currentSlide;

      slides[prev].classList.remove('active');
      slides[prev].classList.add('exiting');
      if (dots[prev]) dots[prev].classList.remove('active');

      slides[nextIdx].classList.add('active');
      if (dots[nextIdx]) dots[nextIdx].classList.add('active');

      var exitEl = slides[prev];
      setTimeout(function () { exitEl.classList.remove('exiting'); }, 700);

      currentSlide = nextIdx;
    }

    function nextQuote() { goToQuote((currentSlide + 1) % totalSlides); }

    function startSlider() { slideTimer = setInterval(nextQuote, 4500); }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        clearInterval(slideTimer);
        goToQuote(i);
        startSlider();
      });
    });

    startSlider();
  }

  /* ── Smooth anchor scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var hash   = this.getAttribute('href');
      if (hash === '#') return;
      var target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        var offset = 88;
        var top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* ── Spin keyframe ── */
  var style = document.createElement('style');
  style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(style);

  /* ── Page transition ── */
  document.body.classList.add('page-transition');

})();
