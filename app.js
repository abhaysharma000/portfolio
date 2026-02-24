/* === CUSTOM CURSOR === */
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
window.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  cursorDot.style.left = e.clientX + 'px';
  cursorDot.style.top = e.clientY + 'px';
}, { passive: true });

document.querySelectorAll('a, button, .proj-card, .skill-card, .contact-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
});

/* === SPOTLIGHT EFFECT === */
document.querySelectorAll('.proj-card, .skill-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  }, { passive: true });
});

/* === NAVBAR SCROLL === */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* === HAMBURGER MENU === */
const ham = document.getElementById('ham');
const mobileNav = document.getElementById('mobileNav');
ham.addEventListener('click', () => mobileNav.classList.toggle('open'));
document.querySelectorAll('.mnl').forEach(l => l.addEventListener('click', () => mobileNav.classList.remove('open')));

// Close mobile nav when clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    mobileNav.classList.remove('open');
  }
});

/* === PARTICLE CANVAS === */
(function initParticles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: null, y: null };
  let resizeTimer;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();

  // Debounced resize to prevent flicker on mobile scroll (address bar)
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 100);
  }, { passive: true });

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });

  const COLORS = ['rgba(124,58,237,', 'rgba(6,182,212,', 'rgba(139,92,246,'];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 2 + .5;
      this.vx = (Math.random() - .5) * .4;
      this.vy = (Math.random() - .5) * .4;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = Math.random() * .6 + .1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < 110; i++) particles.push(new Particle());

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124,58,237,${.12 * (1 - dist / 120)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
      // Mouse interaction
      if (mouse.x !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(6,182,212,${.2 * (1 - dist / 150)})`;
          ctx.lineWidth = .7;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
})();

/* === SCROLL REVEAL === */
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => revealObs.observe(el));

/* === SKILL BAR ANIMATION === */
const bars = document.querySelectorAll('.fill');
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('animated');
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
bars.forEach(b => barObs.observe(b));

/* === PROJECT MODALS === */
const modals = {
  m1: {
    icon: '🕵️',
    title: 'Mule Trace – Financial Fraud Detection',
    tag: 'Live Demo Available',
    desc: 'A high-performance financial forensics platform that uses <strong>Johnson\'s Algorithm</strong> for cycle detection, temporal windowing for smurfing analysis, and heuristic scoring to expose money muling networks with forensic precision.',
    problem: 'Traditional AML systems miss sophisticated layered shell networks and circular fund cycling schemes.',
    tech: ['Python', 'FastAPI', 'NetworkX', 'Pandas', 'React', 'Vite', 'Vercel'],
    github: 'https://github.com/abhaysharma000/MULE-TRACE',
    demo: 'https://mule-trace-alpha.vercel.app/'
  },
  m2: {
    icon: '🎭',
    title: 'Deepfake Detection System',
    tag: 'AI / Deep Learning',
    desc: 'Real-time deepfake detection powered by a fine-tuned <strong>Vision Transformer (ViT)</strong> from HuggingFace. Integrated into video call workflows to flag manipulated facial content during live streams.',
    problem: 'Video call fraud and identity spoofing via AI-generated deepfakes is increasingly hard to detect.',
    tech: ['Python', 'ViT', 'HuggingFace', 'OpenCV', 'TensorFlow', 'FastAPI'],
    github: 'https://github.com/abhaysharma000',
    demo: null
  },
  m3: {
    icon: '👁️',
    title: 'Face Recognition Attendance',
    tag: 'Computer Vision',
    desc: 'An automated attendance system using <strong>OpenCV + dlib</strong> facial recognition pipeline. Detects & recognizes faces in real-time from camera feed, logs attendance to CSV with timestamps.',
    problem: 'Manual attendance is time-consuming and prone to proxy errors in educational institutions.',
    tech: ['Python', 'OpenCV', 'dlib', 'face-recognition', 'Pandas', 'CSV'],
    github: 'https://github.com/abhaysharma000/face-recognition-project',
    demo: null
  },
  m4: {
    icon: '🌿',
    title: 'Localized Air Quality Monitor',
    tag: 'IoT / AI',
    desc: 'Smart pollution monitoring system using sensor data and <strong>ML-based anomaly detection</strong> to track hyperlocal air quality, identify pollution spikes, and trigger real-time community alerts.',
    problem: 'Air quality monitoring infrastructure is sparse and data is often delayed or inaccurate.',
    tech: ['Python', 'Scikit-Learn', 'FastAPI', 'React', 'Pandas'],
    github: 'https://github.com/abhaysharma000',
    demo: null
  }
};

const overlay = document.getElementById('modalOverlay');
const modalBox = document.getElementById('modalBox');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.classList.contains('pl') || e.target.closest('.pl')) return;
    const key = card.dataset.modal;
    const m = modals[key];
    if (!m) return;
    modalContent.innerHTML = `
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;">
        <span style="font-size:2.5rem;">${m.icon}</span>
        <div>
          <h2 style="font-size:1.2rem;font-weight:800;margin-bottom:.25rem;">${m.title}</h2>
          <span style="font-size:.72rem;font-family:var(--mono);color:var(--blue);">${m.tag}</span>
        </div>
      </div>
      <p style="color:var(--muted);margin-bottom:1.25rem;font-size:.9rem;line-height:1.7;">${m.desc}</p>
      <div style="background:rgba(124,58,237,.07);border:1px solid rgba(124,58,237,.2);border-radius:10px;padding:1rem;margin-bottom:1.25rem;">
        <p style="font-size:.78rem;color:var(--purple);font-family:var(--mono);margin-bottom:.4rem;">PROBLEM SOLVED</p>
        <p style="font-size:.88rem;color:var(--muted);">${m.problem}</p>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:1.5rem;">
        ${m.tech.map(t => `<span style="font-size:.72rem;font-family:var(--mono);padding:.2rem .6rem;background:rgba(6,182,212,.08);border:1px solid rgba(6,182,212,.2);border-radius:6px;color:var(--blue);">${t}</span>`).join('')}
      </div>
      <div style="display:flex;gap:1rem;flex-wrap:wrap;">
        <a href="${m.github}" target="_blank" rel="noopener noreferrer" class="btn-primary" style="font-size:.85rem;padding:.6rem 1.4rem;">View on GitHub</a>
        ${m.demo ? `<a href="${m.demo}" target="_blank" rel="noopener noreferrer" class="btn-outline" style="font-size:.85rem;padding:.6rem 1.4rem;">Live Demo</a>` : ''}
      </div>
    `;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

/* === CONTACT FORM (mailto fallback) === */
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('fname').value.trim();
  const email = document.getElementById('femail').value.trim();
  const message = document.getElementById('fmsg').value.trim();
  const msg = document.getElementById('formMsg');

  // Open mailto with pre-filled content as a reliable no-backend approach
  const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  window.open(`mailto:abhaysharma6368@gmail.com?subject=${subject}&body=${body}`);

  msg.textContent = '✅ Opening your email client…';
  msg.style.color = '#06b6d4';
  e.target.reset();
  setTimeout(() => { msg.textContent = ''; }, 5000);
});

/* === ACTIVE NAV LINK === */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 100) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--blue)' : '';
  });
}, { passive: true });

/* === RESUME DOWNLOAD CHECK === */
(function checkResume() {
  const resumeBtn = document.getElementById('resumeBtn');
  if (!resumeBtn) return;
  fetch('resume.pdf', { method: 'HEAD' }).then(res => {
    if (!res.ok) {
      resumeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.open('https://www.linkedin.com/in/abhay-sharma001/', '_blank', 'noopener,noreferrer');
      });
      resumeBtn.title = 'Resume coming soon \u2014 view LinkedIn profile';
    }
  }).catch(() => { /* silently keep original behaviour */ });
})();

/* === MAGNETIC BUTTONS === */
document.querySelectorAll('.btn-primary, .btn-outline, .hero-badge').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});
