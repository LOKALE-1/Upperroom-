// Upper Room Ministries — site interactions
document.addEventListener('DOMContentLoaded', function () {

  /* Sticky header */
  var header = document.querySelector('.site-header');
  function onScroll () {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile nav toggle */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('open');
      nav.classList.toggle('mobile-open');
      document.body.style.overflow = nav.classList.contains('mobile-open') ? 'hidden' : '';
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.classList.remove('open');
        nav.classList.remove('mobile-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* Reveal on scroll */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '150px 0px -10% 0px' });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 0.08 + 's';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* Active nav link */
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a[data-nav]').forEach(function (a) {
    if (a.getAttribute('data-nav') === path) a.classList.add('active');
  });

  /* Lightbox gallery */
  var galleryItems = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
  var lightbox = document.querySelector('.lightbox');
  if (galleryItems.length && lightbox) {
    var lbImg = lightbox.querySelector('img');
    var idx = 0;
    function show (i) {
      idx = (i + galleryItems.length) % galleryItems.length;
      var full = galleryItems[idx].getAttribute('data-full') || galleryItems[idx].querySelector('img').src;
      lbImg.src = full;
    }
    galleryItems.forEach(function (item, i) {
      item.addEventListener('click', function () {
        show(i);
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    var close = lightbox.querySelector('.lightbox-close');
    var prev = lightbox.querySelector('.lightbox-prev');
    var next = lightbox.querySelector('.lightbox-next');
    function closeLb () {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
    if (close) close.addEventListener('click', closeLb);
    if (prev) prev.addEventListener('click', function () { show(idx - 1); });
    if (next) next.addEventListener('click', function () { show(idx + 1); });
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  /* Contact form -> mailto (no backend on static hosting) */
  var contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = contactForm.name.value.trim();
      var email = contactForm.email.value.trim();
      var phone = contactForm.phone ? contactForm.phone.value.trim() : '';
      var branch = contactForm.branch ? contactForm.branch.value : '';
      var message = contactForm.message.value.trim();
      var body = 'Name: ' + name + '\nEmail: ' + email + (phone ? '\nPhone: ' + phone : '') + (branch ? '\nBranch: ' + branch : '') + '\n\n' + message;
      var mailto = 'mailto:info@urm.org.za?subject=' + encodeURIComponent('Website enquiry from ' + name) + '&body=' + encodeURIComponent(body);
      window.location.href = mailto;
    });
  }

  /* Copy-to-clipboard (bank details) */
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    var defaultHTML = btn.innerHTML;
    var checkHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy') || '';
      function markCopied () {
        btn.classList.add('copied');
        btn.innerHTML = checkHTML;
        setTimeout(function () {
          btn.classList.remove('copied');
          btn.innerHTML = defaultHTML;
        }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(markCopied, markCopied);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        markCopied();
      }
    });
  });

  /* Back to top */
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    function onBackToTopScroll () {
      if (window.scrollY > 700) backToTop.classList.add('show');
      else backToTop.classList.remove('show');
    }
    onBackToTopScroll();
    window.addEventListener('scroll', onBackToTopScroll, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    backToTop.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /* Cookie consent */
  var cookieConsent = document.querySelector('.cookie-consent');
  if (cookieConsent) {
    try {
      if (!localStorage.getItem('urm-cookie-consent')) {
        setTimeout(function () { cookieConsent.classList.add('show'); }, 600);
      }
    } catch (e) {
      setTimeout(function () { cookieConsent.classList.add('show'); }, 600);
    }
    var acceptCookies = cookieConsent.querySelector('.cookie-accept');
    if (acceptCookies) {
      acceptCookies.addEventListener('click', function () {
        cookieConsent.classList.remove('show');
        try { localStorage.setItem('urm-cookie-consent', 'accepted'); } catch (e) {}
      });
    }
  }

  /* Current year in footer */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
});
