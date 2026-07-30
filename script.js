/* ============================================
   Abdul Mannan Butt — Portfolio
   Core interactions: nav, typing effect,
   live "days in DevOps" counter, network bg
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Cache-bust Resume/CV PDF links ----------
     Browsers (and phones especially) aggressively cache PDFs by URL.
     Since the filename never changes when the file is updated, appending
     a fresh version each page load guarantees visitors always get the
     current file instead of a stale cached copy. */
  document.querySelectorAll('a[href$=".pdf"]').forEach(link => {
    const base = link.getAttribute('href').split('?')[0];
    link.setAttribute('href', `${base}?v=${Date.now()}`);
  });

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav: scrolled state ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const toggleBackToTop = () => {
      if (window.scrollY > 700) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    };
    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Nav: mobile toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------- Typing effect ---------- */
  const typeTarget = document.getElementById('typeTarget');
  const roles = [
    'DevOps Engineer',
    'Cloud Infrastructure Engineer',
    'Kubernetes & Terraform',
    'DevOps Educator',
    'CI/CD · GitOps'
  ];
  if (typeTarget) {
    let roleIndex = 0, charIndex = 0, deleting = false;

    const type = () => {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        typeTarget.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(type, 1100);
          return;
        }
      } else {
        charIndex--;
        typeTarget.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(type, deleting ? 24 : 48);
    };
    type();
  }

  /* ---------- Count-up stats (365+, 40+, 15+) on scroll into view ---------- */
  const countEls = document.querySelectorAll('.metric-value[data-count-to]');
  if (countEls.length) {
    const animateCount = (el) => {
      const target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 1400;
      const startTime = performance.now();
      const easeOutQuad = (t) => 1 - (1 - t) * (1 - t);

      const step = (now) => {
        const progress = Math.min(1, (now - startTime) / duration);
        const eased = easeOutQuad(progress);
        const value = Math.round(eased * target);
        el.textContent = value + (progress >= 1 ? suffix : '');
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
      const countIo = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countIo.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      countEls.forEach(el => countIo.observe(el));
    } else {
      countEls.forEach(el => {
        const target = parseInt(el.getAttribute('data-count-to'), 10) || 0;
        el.textContent = target + (el.getAttribute('data-suffix') || '');
      });
    }
  }

  /* ---------- Reveal-on-scroll for sections/cards ---------- */
  const revealTargets = document.querySelectorAll('.timeline-card, .project-card, .skill-group');
  if ('IntersectionObserver' in window && revealTargets.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(el => io.observe(el));
  }

});
