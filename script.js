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

  /* close on any link inside mobile nav */
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* close on Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ── Waitlist form ───────────────────────────────────────── */
  var form       = document.getElementById('waitlistForm');
  var formWrap   = document.getElementById('waitlistFormWrap');
  var successMsg = document.getElementById('waitlistSuccess');
  var emailInput = document.getElementById('waitlistEmail');

  /* pre-fill from localStorage if already signed up */
  var saved = localStorage.getItem('raagi_waitlist');
  if (saved && formWrap && successMsg) {
    formWrap.classList.add('hidden');
    successMsg.classList.add('visible');
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var email = emailInput ? emailInput.value.trim() : '';

      /* basic validation */
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (emailInput) {
          emailInput.style.borderColor = 'rgba(200,80,80,.6)';
          emailInput.focus();
        }
        return;
      }

      /* persist to localStorage */
      var entries = JSON.parse(localStorage.getItem('raagi_waitlist_entries') || '[]');
      if (!entries.includes(email)) {
        entries.push(email);
        localStorage.setItem('raagi_waitlist_entries', JSON.stringify(entries));
      }
      localStorage.setItem('raagi_waitlist', email);

      /* show success */
      if (formWrap)   formWrap.classList.add('hidden');
      if (successMsg) successMsg.classList.add('visible');
    });

    /* reset error styling on input */
    if (emailInput) {
      emailInput.addEventListener('input', function () {
        emailInput.style.borderColor = '';
      });
    }
  }

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
