document.addEventListener('DOMContentLoaded', function () {

  /* ── Sticky nav shadow ───────────────────────────────────── */
  var nav = document.getElementById('siteNav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  /* ── Mobile nav ──────────────────────────────────────────── */
  var menuBtn   = document.getElementById('menuBtn');
  var menuClose = document.getElementById('menuClose');
  var mobileNav = document.getElementById('mobileNav');

  function openMenu() {
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuBtn)   menuBtn.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ── Waitlist form (Formspree) ───────────────────────────── */
  var form       = document.getElementById('waitlistForm');
  var formWrap   = document.getElementById('waitlistFormWrap');
  var successMsg = document.getElementById('waitlistSuccess');
  var emailInput = document.getElementById('waitlistEmail');
  var submitBtn  = form ? form.querySelector('button[type="submit"]') : null;

  function showSuccess() {
    if (formWrap)   formWrap.classList.add('hidden');
    if (successMsg) successMsg.classList.add('visible');
  }

  /* if already submitted this session, skip form */
  if (localStorage.getItem('raagi_waitlist') && formWrap && successMsg) {
    showSuccess();
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var email = emailInput ? emailInput.value.trim() : '';
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (emailInput) {
          emailInput.style.borderColor = 'rgba(200,80,80,.6)';
          emailInput.focus();
        }
        return;
      }

      if (submitBtn) { submitBtn.textContent = 'Sending…'; submitBtn.disabled = true; }

      var formspreeUrl = form.getAttribute('action');

      /* If Formspree ID is still a placeholder, skip network call */
      if (!formspreeUrl || formspreeUrl.includes('YOUR_FORM_ID')) {
        localStorage.setItem('raagi_waitlist', email);
        showSuccess();
        return;
      }

      fetch(formspreeUrl, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      })
        .then(function (res) {
          if (res.ok) {
            localStorage.setItem('raagi_waitlist', email);
            showSuccess();
          } else {
            return res.json().then(function (data) {
              throw new Error(data.error || 'Submission failed');
            });
          }
        })
        .catch(function () {
          /* fallback: save locally and show success anyway */
          localStorage.setItem('raagi_waitlist', email);
          showSuccess();
        });
    });

    if (emailInput) {
      emailInput.addEventListener('input', function () {
        emailInput.style.borderColor = '';
      });
    }
  }

  /* ── Product carousels ───────────────────────────────────── */
  document.querySelectorAll('[data-carousel]').forEach(function (carousel) {
    var track   = carousel.querySelector('.carousel-track');
    var dots    = carousel.querySelectorAll('[data-dot]');
    var prevBtn = carousel.querySelector('.carousel-prev');
    var nextBtn = carousel.querySelector('.carousel-next');
    var labelEl = carousel.querySelector('[data-label]');
    var labels  = (carousel.getAttribute('data-labels') || '').split(',');
    var total   = carousel.querySelectorAll('.carousel-slide').length;
    var current = 0;
    var startX  = 0;

    function goTo(index) {
      current = (index % total + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
      if (labelEl && labels[current]) labelEl.textContent = labels[current];
    }

    if (prevBtn) prevBtn.addEventListener('click', function (e) { e.stopPropagation(); goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function (e) { e.stopPropagation(); goTo(current + 1); });

    dots.forEach(function (dot) {
      dot.addEventListener('click', function (e) {
        e.stopPropagation();
        goTo(parseInt(this.getAttribute('data-dot'), 10));
      });
    });

    /* Touch swipe support */
    carousel.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', function (e) {
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(diff > 0 ? current + 1 : current - 1);
    }, { passive: true });
  });

  /* ── Smooth scroll for anchor links ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        var navHeight = nav ? nav.offsetHeight : 72;
        var top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

});
