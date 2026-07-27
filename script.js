/* ============================================
   Abdul Mannan Butt — Portfolio
   Core interactions: nav, typing effect,
   live "days in DevOps" counter, network bg
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Nav: scrolled state ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

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
          setTimeout(type, 1600);
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
      setTimeout(type, deleting ? 35 : 65);
    };
    type();
  }

  /* ---------- Live "days in DevOps" counter ---------- */
  const uptimeCounter = document.getElementById('uptimeCounter');
  if (uptimeCounter) {
    // Career start date: DevOps Engineer Intern @ 360XpertSolutions
    const startDate = new Date('2026-02-01T00:00:00');
    const now = new Date();
    const diffDays = Math.max(0, Math.floor((now - startDate) / (1000 * 60 * 60 * 24)));

    let current = 0;
    const duration = 900; // ms
    const startTime = performance.now();

    const animateCount = (t) => {
      const progress = Math.min(1, (t - startTime) / duration);
      current = Math.floor(progress * diffDays);
      uptimeCounter.textContent = current;
      if (progress < 1) requestAnimationFrame(animateCount);
      else uptimeCounter.textContent = diffDays;
    };
    requestAnimationFrame(animateCount);
  }

  /* ---------- Network SVG (ambient nodes + lines) ---------- */
  const svg = document.getElementById('networkSvg');
  if (svg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const NS = 'http://www.w3.org/2000/svg';
    const W = 1440, H = 900;
    const NODE_COUNT = 26;
    const nodes = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
      });
    }

    const linesGroup = document.createElementNS(NS, 'g');
    const dotsGroup = document.createElementNS(NS, 'g');
    linesGroup.setAttribute('stroke', 'var(--cyan, #4fd1ff)');
    linesGroup.setAttribute('stroke-opacity', '0.14');
    dotsGroup.setAttribute('fill', 'var(--cyan, #4fd1ff)');
    dotsGroup.setAttribute('fill-opacity', '0.5');
    svg.appendChild(linesGroup);
    svg.appendChild(dotsGroup);

    const dotEls = nodes.map(() => {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('r', '1.6');
      dotsGroup.appendChild(c);
      return c;
    });

    const MAX_DIST = 170;

    const render = () => {
      // update positions
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      // update dots
      nodes.forEach((n, i) => {
        dotEls[i].setAttribute('cx', n.x.toFixed(1));
        dotEls[i].setAttribute('cy', n.y.toFixed(1));
      });

      // rebuild lines (only nearby pairs)
      let linesHTML = '';
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const op = (1 - dist / MAX_DIST) * 0.5;
            linesHTML += `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke-opacity="${op.toFixed(2)}" />`;
          }
        }
      }
      linesGroup.innerHTML = linesHTML;

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
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
