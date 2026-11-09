/* ================= PRELOADER ================= */
const preloader = document.getElementById('preloader');
if (preloader) {
  const hide = () => preloader.classList.add('done');
  window.addEventListener('load', () => setTimeout(hide, 500));
  setTimeout(hide, 3000);
}

/* ================= CLEAR OLD THEME PREFERENCE ================= */
try { 
  localStorage.removeItem('theme'); 
  document.documentElement.removeAttribute('data-theme'); 
} catch {}

/* ================= CUSTOM CURSOR ================= */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
const hasFinePointer = window.matchMedia('(pointer:fine)').matches;
if (cursorDot && cursorRing && hasFinePointer) {
  document.body.classList.add('js-cursor');
  let mx = 0, my = 0, rx = 0, ry = 0, moved = false;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (!moved) { moved = true; document.body.classList.add('cursor-ready'); }
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top = my + 'px';
  }, { passive: true });

  (function follow() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top = ry + 'px';
    requestAnimationFrame(follow);
  })();

  const hoverSel = 'a,button,.btn,.card,.project-card,.cert,.cert-item,.service,.course,.socials a,.stat,.edu,.story-block,.pricing-card';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSel)) cursorRing.classList.add('hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSel)) cursorRing.classList.remove('hover');
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 900) {
      document.body.classList.remove('js-cursor', 'cursor-ready');
      document.body.style.cursor = 'auto';
    } else {
      document.body.classList.add('js-cursor');
    }
  });
}

/* ================= HEADER / BURGER ================= */
const header = document.getElementById('header');
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
if (burger && menu) {
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }));
}

/* ================= SCROLL & PROGRESS ================= */
const progress = document.getElementById('progress');
const topBtn = document.getElementById('top');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
  if (progress) progress.style.width = scrolled + '%';
  if (header) header.classList.toggle('scrolled', h.scrollTop > 40);
  if (topBtn) topBtn.classList.toggle('show', h.scrollTop > 500);
}, { passive: true });
if (topBtn) topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ================= REVEAL ON SCROLL ================= */
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 70);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ================= COUNTERS (FIXED) ================= */
const counters = document.querySelectorAll('[data-count]');
if (counters.length) {
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 45));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current;
      }, 28);
      obs.unobserve(el);
    });
  }, { threshold: 0.1 }); // Changed to 0.1 so it fires correctly
  counters.forEach(c => counterObserver.observe(c));
}

/* ================= SKILL BARS ================= */
const skillBars = document.querySelectorAll('.skill-bar-fill');
if (skillBars.length) {
  const barObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        setTimeout(() => { el.style.width = el.dataset.level + '%'; }, 200);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  skillBars.forEach(b => barObserver.observe(b));
}

/* ================= TYPING EFFECT ================= */
const typedEl = document.getElementById('typed');
if (typedEl) {
  const roles = [
    'Software Engineer & Product Builder',
    'AI & Machine Learning Enthusiast',
    'Cloud Computing Specialist',
    'DevOps Practitioner',
    'Full-Stack Web Developer',
    'SaaS Builder & Problem Solver'
  ];
  let rIdx = 0, chIdx = 0, deleting = false;

  (function typeLoop() {
    const word = roles[rIdx];
    typedEl.textContent = word.slice(0, chIdx);

    if (!deleting && chIdx === word.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
    } else if (deleting && chIdx === 0) {
      deleting = false;
      rIdx = (rIdx + 1) % roles.length;
      setTimeout(typeLoop, 320);
    } else {
      chIdx += deleting ? -1 : 1;
      setTimeout(typeLoop, deleting ? 40 : 80);
    }
  })();
}

/* ================= TEXT SCRAMBLE ================= */
document.querySelectorAll('[data-scramble]').forEach(el => {
  const originalText = el.textContent;
  const chars = '!<>-_\\/[]{}—=+*^?#________';
  let frame = 0;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !el.dataset.done) {
        el.dataset.done = '1';
        const totalFrames = 40;
        const scramble = () => {
          frame++;
          const progress = frame / totalFrames;
          const revealedLen = Math.floor(progress * originalText.length);
          el.textContent = originalText.split('').map((ch, i) => {
            if (i < revealedLen) return ch;
            if (ch === ' ') return ' ';
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('');
          if (frame < totalFrames) requestAnimationFrame(scramble);
          else el.textContent = originalText;
        };
        scramble();
      }
    });
  }, { threshold: 0.3 });
  observer.observe(el);
});

/* ================= PARTICLE CANVAS ================= */
const canvas = document.getElementById('particleCanvas');
if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const ctx = canvas.getContext('2d');
  const particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 70;
  const maxDistance = 160;
  const mouse = { x: null, y: null, radius: 170 };
  
  const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
  resize();
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
  }, { passive: true });
  window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
  window.addEventListener('resize', resize);
  
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.size = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius && dist > 0) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x += (dx / dist) * force * 2;
          this.y += (dy / dist) * force * 2;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(99, 102, 241, 0.7)';
      ctx.fill();
    }
  }
  
  for (let i = 0; i < particleCount; i++) particles.push(new Particle());
  
  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDistance) {
          const opacity = (1 - dist / maxDistance) * 0.4;
          ctx.strokeStyle = `rgba(34, 211, 238, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }
  
  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(loop);
  })();
}

/* ================= ICONS LIBRARY ================= */
const icons = {
  layers:'<svg viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
  tree:'<svg viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="5" r="2.5"/><circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M12 7.5v4M6 16.5v-3h12v3"/></svg>',
  cpu:'<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><rect x="6" y="6" width="12" height="12" rx="1"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v2M15 2v2M9 20v2M15 20v2M2 9h2M2 15h2M20 9h2M20 15h2"/></svg>',
  monitor:'<svg viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
  database:'<svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v6c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 11v6c0 1.7 4 3 9 3s9-1.3 9-3v-6"/></svg>',
  code:'<svg viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2" stroke-linecap="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg>',
  brain:'<svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44A2.5 2.5 0 0 1 4.5 17.5 2.5 2.5 0 0 1 3 15.5 2.5 2.5 0 0 1 4.5 13 2.5 2.5 0 0 1 3 10.5 2.5 2.5 0 0 1 5 8 2.5 2.5 0 0 1 6 3.5 2.5 2.5 0 0 1 9.5 2z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44A2.5 2.5 0 0 0 19.5 17.5 2.5 2.5 0 0 0 21 15.5 2.5 2.5 0 0 0 19.5 13 2.5 2.5 0 0 0 21 10.5 2.5 2.5 0 0 0 19 8 2.5 2.5 0 0 0 18 3.5 2.5 2.5 0 0 0 14.5 2z"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>',
  cloud:'<svg viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>',
  infinity:'<svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round"><path d="M18.178 8C21.265 8 24 10.686 24 14s-2.735 6-5.822 6c-2.42 0-4.514-1.43-5.888-3.535C10.917 18.57 8.823 20 6.404 20 3.317 20 .5 17.314.5 14s2.817-6 5.904-6c2.42 0 4.513 1.43 5.886 3.535C13.664 9.43 15.757 8 18.178 8z" transform="scale(0.9) translate(1.3 1.5)"/></svg>',
  globe:'<svg viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z"/></svg>',
  grid:'<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
  briefcase:'<svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  clipboard:'<svg viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>',
  megaphone:'<svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round"><path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>',
  dollar:'<svg viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  book:'<svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  scale:'<svg viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2"><path d="M12 3v18M5 7l7-4 7 4"/><path d="M5 7l-3 7a4 4 0 0 0 8 0L5 7zM19 7l-3 7a4 4 0 0 0 8 0l-3-7z"/></svg>',
  handshake:'<svg viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round"><path d="M11 17l-3 3-5-5 3-3M22 17l-3 3-5-5 3-3M14 5l-2 2-2-2M7 12l5-5 5 5"/></svg>',
  speech:'<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  laptop:'<svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M2 20h20"/></svg>',
  compass:'<svg viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
  building:'<svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>',
  bot:'<svg viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4M8 16h.01M16 16h.01"/></svg>',
  flask:'<svg viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2"><path d="M9 2v6L4 20a2 2 0 0 0 1.8 3h12.4A2 2 0 0 0 20 20L15 8V2"/><path d="M9 2h6"/></svg>',
  sparkles:'<svg viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9zM5 3l.7 1.8L8 5.5 5.7 6.2 5 8l-.7-1.8L2 5.5l2.3-.7z"/></svg>',
  trend:'<svg viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  box:'<svg viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  award:'<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M9 13.5L7 22l5-3 5 3-2-8.5"/></svg>',
  rocket:'<svg viewBox="0 0 24 24" fill="none" stroke="#22d3ee" stroke-width="2" stroke-linecap="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91 0z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>'
};

/* ================= COURSES DATA & RENDERER ================= */
const courses = [
  {t:'Discrete Structures', c:'cs', i:'grid', issuer:'Saylor University', desc:'Logic, sets, relations, graph theory, combinatorics and mathematical proofs — the mathematical backbone of computer science.'},
  {t:'Data Structures', c:'cs', i:'tree', issuer:'Saylor University', desc:'Mastered arrays, linked lists, stacks, queues, trees, graphs, and hash tables — with complexity analysis of each structure.'},
  {t:'Computer Science Fundamentals', c:'cs', i:'cpu', issuer:'Saylor University', desc:'Foundational concepts of computing: binary representation, algorithms, memory models, and computational thinking.'},
  {t:'Operating Systems', c:'cs', i:'monitor', issuer:'Saylor University', desc:'Processes, threads, scheduling, memory management, file systems, and concurrency — the foundation of all modern software.'},
  {t:'Introduction to Modern Database Systems', c:'cs', i:'database', issuer:'Saylor University', desc:'Relational modeling, SQL, normalization, transactions, ACID properties, and NoSQL systems for modern applications.'},
  {t:'Python Essentials', c:'cs', i:'code', issuer:'Cisco Networking Academy', desc:'Core Python syntax, data types, control flow, functions, OOP, and error handling — validated by Cisco certification.'},
  {t:'Python for Data Science', c:'cs', i:'chart', issuer:'Saylor University', desc:'NumPy, Pandas, Matplotlib and real data workflows for cleaning, analyzing, and visualizing structured datasets.'},
  {t:'JavaScript Essentials', c:'cs', i:'code', issuer:'Cisco Networking Academy', desc:'Modern JS: ES6+, DOM manipulation, async/await, promises, and interactive web app fundamentals.'},
  {t:'Basics of Artificial Intelligence', c:'cs', i:'brain', issuer:'Saylor University', desc:'Search algorithms, knowledge representation, expert systems, and the conceptual foundations of AI.'},
  {t:'Introduction to Modern AI', c:'cs', i:'sparkles', issuer:'Simplilearn', desc:'Modern AI landscape: neural networks, transformers, LLMs, prompt engineering, and real-world AI applications.'},
  {t:'Fundamentals of Machine Learning', c:'cs', i:'trend', issuer:'Simplilearn', desc:'Supervised & unsupervised learning, regression, classification, clustering, and model evaluation using scikit-learn.'},
  {t:'Data Analytics Essentials', c:'cs', i:'chart', issuer:'Cisco Networking Academy', desc:'Data-driven thinking, analytics lifecycle, statistical reasoning, and visualization for business insights.'},
  {t:'Big Data Analytics', c:'cs', i:'database', issuer:'Simplilearn', desc:'Hadoop ecosystem, MapReduce, Spark fundamentals, and distributed processing of large-scale datasets.'},
  {t:'Introduction to Cybersecurity', c:'cs', i:'shield', issuer:'Cisco Networking Academy', desc:'Threat landscape, security principles, cryptography basics, and defense-in-depth strategies for modern systems.'},
  {t:'Ethical Hacker', c:'cs', i:'shield', issuer:'Cisco Networking Academy', desc:'Penetration testing methodology, vulnerability assessment, reconnaissance, and ethical exploitation techniques.'},
  {t:'Cloud Computing Fundamentals', c:'cs', i:'cloud', issuer:'Simplilearn', desc:'Cloud service models (IaaS, PaaS, SaaS), deployment strategies, virtualization, and cloud provider ecosystems.'},
  {t:'DevOps Essentials', c:'cs', i:'infinity', issuer:'Simplilearn', desc:'CI/CD pipelines, infrastructure as code, monitoring, containerization, and DevOps culture and practices.'},
  {t:'Web Development Foundations', c:'cs', i:'globe', issuer:'Mindluster', desc:'HTML5, CSS3, responsive design, semantic markup, and modern layout techniques including Flexbox and Grid.'},
  {t:'SEO (Search Engine Optimization)', c:'cs', i:'trend', issuer:'HubSpot Academy', desc:'On-page SEO, keyword research, technical SEO, link building, and analytics-driven optimization.'},
  {t:'WordPress Development', c:'cs', i:'globe', issuer:'DigiSkills.pk — Virtual University', desc:'Theme customization, plugin configuration, content management, and site optimization with WordPress.'},
  {t:'Linear Algebra', c:'math', i:'grid', issuer:'Saylor University', desc:'Vectors, matrices, determinants, eigenvalues, and linear transformations — essential for ML, graphics, and data science.'},
  {t:'Introduction to Statistics', c:'math', i:'chart', issuer:'Saylor University', desc:'Descriptive statistics, probability distributions, hypothesis testing, and statistical inference.'},
  {t:'Business Statistics', c:'math', i:'chart', issuer:'Saylor University', desc:'Statistical analysis applied to business decisions: regression, forecasting, and data-driven strategy.'},
  {t:'Foundation of Real World Math', c:'math', i:'grid', issuer:'Saylor University', desc:'Applied mathematics for practical problem-solving — ratios, growth models, and analytical reasoning.'},
  {t:'Business Management Essentials', c:'business', i:'briefcase', issuer:'Management & Strategy Institute', desc:'Management theory, organizational behavior, strategic planning, and modern leadership principles.'},
  {t:'Introduction to Project Management', c:'business', i:'clipboard', issuer:'Saylor University', desc:'Project lifecycle, Agile vs Waterfall, scoping, scheduling, risk management, and team coordination.'},
  {t:'Principles of Marketing', c:'business', i:'megaphone', issuer:'Saylor University', desc:'Market research, segmentation, positioning, the 4Ps, and digital-first marketing strategy.'},
  {t:'Principle of Finance', c:'business', i:'dollar', issuer:'Saylor University', desc:'Time value of money, capital budgeting, risk-return analysis, and corporate financial decisions.'},
  {t:'Introduction to Financial Accounting', c:'business', i:'book', issuer:'Saylor University', desc:'Reading and building financial statements — balance sheets, income statements, and cash flows.'},
  {t:'Managerial Accounting', c:'business', i:'book', issuer:'Saylor University', desc:'Cost analysis, budgeting, variance analysis, and accounting for internal management decisions.'},
  {t:'Management Information Systems', c:'business', i:'layers', issuer:'Saylor University', desc:'How information systems power organizations — ERP, CRM, data warehousing, and IT strategy.'},
  {t:'Business Law', c:'business', i:'scale', issuer:'Saylor University', desc:'Contracts, torts, business formation, intellectual property, and commercial legal frameworks.'},
  {t:'Business Ethics', c:'business', i:'handshake', issuer:'Saylor University', desc:'Ethical decision-making frameworks, corporate responsibility, and stakeholder theory in business.'},
  {t:'Business Communication', c:'business', i:'speech', issuer:'Saylor University', desc:'Professional writing, presentations, cross-cultural communication, and persuasive messaging.'},
  {t:'E-Commerce Management', c:'business', i:'box', issuer:'DigiSkills.pk — Virtual University', desc:'Product listing, order fulfillment, inventory management, and marketplace operations.'},
  {t:'Virtual Assistant (Amazon)', c:'business', i:'laptop', issuer:'DigiSkills.pk — Virtual University', desc:'Amazon seller support, customer service workflows, and remote administrative operations.'},
  {t:'Advanced Software Engineering Job Simulation', c:'sim', i:'cpu', issuer:'Walmart Global Tech', desc:'Real-world software engineering workflow — code review, feature design, and shipping production-quality software.'},
  {t:'Software Engineering Job Simulation', c:'sim', i:'code', issuer:'JPMorgan Chase', desc:'Engineering practices inside a global financial institution: version control, testing, and system design.'},
  {t:'Technology Software Development Job Simulation', c:'sim', i:'laptop', issuer:'Accenture', desc:'Full software development lifecycle experience inside a consulting context.'},
  {t:'Tech Explorer Job Simulation', c:'sim', i:'compass', issuer:'Deloitte', desc:'Explored technology career paths, client-facing problem solving, and digital transformation strategy.'},
  {t:'Solutions Architecture Job Simulation', c:'sim', i:'building', issuer:'AWS', desc:'Designed scalable cloud architectures on AWS — compute, storage, networking, and cost optimization.'},
  {t:'Robotics and Controls Job Simulation', c:'sim', i:'bot', issuer:'Boston Dynamics', desc:'Explored control systems, sensor fusion, and real-time robotics engineering challenges.'},
  {t:'Data Science Job Simulation', c:'sim', i:'flask', issuer:'BCG X', desc:'Real client-facing data science — cleaning, modeling, and presenting insights to stakeholders.'},
  {t:'Data Analytics Job Simulation', c:'sim', i:'chart', issuer:'Accenture', desc:'Data cleaning, analysis, and visualization for business strategy decisions.'},
  {t:'Data Visualisation — Empowering Business with Insights', c:'sim', i:'chart', issuer:'Tata Group', desc:'Created executive dashboards and delivered data storytelling to drive business decisions.'},
  {t:'GenAI Job Simulation', c:'sim', i:'sparkles', issuer:'BCG X', desc:'Explored generative AI applications, prompt engineering, and LLM integration in enterprise contexts.'},
  {t:'Cybersecurity Job Simulation', c:'sim', i:'shield', issuer:'Mastercard', desc:'Security analysis, threat hunting, and incident response inside a global payments company.'},
  {t:'Credit Analyst Job Simulation', c:'sim', i:'dollar', issuer:'JPMorgan Chase', desc:'Analyzed financial statements, assessed credit risk, and made lending recommendations.'},
  {t:'Investment Management Job Simulation', c:'sim', i:'trend', issuer:'Citi', desc:'Portfolio analysis, market research, and investment strategy formulation.'},
  {t:'Financial Services Climate Change Job Simulation', c:'sim', i:'globe', issuer:'Bank of America', desc:'Assessed climate risk in financial portfolios and sustainable finance strategies.'},
  {t:'Project Management Job Simulation', c:'sim', i:'clipboard', issuer:'Siemens', desc:'Managed a simulated project from initiation to closure, including risk and stakeholder management.'},
  {t:'Product Management Job Simulation', c:'sim', i:'box', issuer:'Lloyds Banking Group', desc:'User research, product roadmap design, and feature prioritization for digital products.'}
];

const grid = document.getElementById('courseGrid');
if (grid) {
  const renderCourses = (filter = 'all') => {
    const list = filter === 'all' ? courses : courses.filter(c => c.c === filter);
    grid.innerHTML = list.map((c, idx) => `
      <div class="course" data-cat="${c.c}" style="animation-delay:${Math.min(idx * 20, 480)}ms">
        <div class="ico">${icons[c.i] || icons.code}</div>
        <div class="course-body">
          <h4>${c.t}</h4>
          <p class="course-desc">${c.desc}</p>
          <span class="course-issuer">✓ ${c.issuer}</span>
        </div>
      </div>
    `).join('');
  };
  renderCourses();
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCourses(btn.dataset.filter);
    });
  });
}

/* ================= CERTIFICATES DATA & RENDERER ================= */
const certificates = [
  {name:'Business Management Essentials', issuer:'Management and Strategy Institute', category:'professional', date:'October 2025'},
  {name:'SEO (Search Engine Optimization)', issuer:'HubSpot Academy', category:'professional', date:'October 2025'},
  {name:'WordPress Development', issuer:'DigiSkills.pk — Virtual University', category:'digiskills', date:'June 2023'},
  {name:'E-Commerce Management', issuer:'DigiSkills.pk — Virtual University', category:'digiskills', date:'February 2023'},
  {name:'Virtual Assistant (Amazon)', issuer:'DigiSkills.pk — Virtual University', category:'digiskills', date:'February 2023'},
  {name:'Discrete Structures', issuer:'Saylor University', category:'saylor', date:'2024'},
  {name:'Data Structures', issuer:'Saylor University', category:'saylor', date:'2024'},
  {name:'Computer Science Fundamentals', issuer:'Saylor University', category:'saylor', date:'2024'},
  {name:'Operating Systems', issuer:'Saylor University', category:'saylor', date:'2024'},
  {name:'Introduction to Modern Database Systems', issuer:'Saylor University', category:'saylor', date:'2024'},
  {name:'Python for Data Science', issuer:'Saylor University', category:'saylor', date:'2024'},
  {name:'Basics of Artificial Intelligence', issuer:'Saylor University', category:'saylor', date:'2024'},
  {name:'Linear Algebra', issuer:'Saylor University', category:'saylor', date:'2024'},
  {name:'Introduction to Statistics', issuer:'Saylor University', category:'saylor', date:'2024'},
  {name:'Business Statistics', issuer:'Saylor University', category:'saylor', date:'2024'},
  {name:'Foundation of Real World Math', issuer:'Saylor University', category:'saylor', date:'2024'},
  {name:'Introduction to Project Management', issuer:'Saylor University', category:'saylor', date:'2024'},
  {name:'Principles of Marketing', issuer:'Saylor University', category:'saylor', date:'2024'},
  {name:'Principle of Finance', issuer:'Saylor University', category:'saylor', date:'2024'},
  {name:'Introduction to Financial Accounting', issuer:'Saylor University', category:'saylor', date:'2024'},
  {name:'Managerial Accounting', issuer:'Saylor University', category:'saylor', date:'2024'},
  {name:'Management Information Systems', issuer:'Saylor University', category:'saylor', date:'2024'},
  {name:'Business Law', issuer:'Saylor University', category:'saylor', date:'2024'},
  {name:'Business Ethics', issuer:'Saylor University', category:'saylor', date:'2024'},
  {name:'Business Communication', issuer:'Saylor University', category:'saylor', date:'2024'},
  {name:'Python Essentials', issuer:'Cisco Networking Academy', category:'cisco', date:'2024'},
  {name:'JavaScript Essentials', issuer:'Cisco Networking Academy', category:'cisco', date:'2024'},
  {name:'Data Analytics Essentials', issuer:'Cisco Networking Academy', category:'cisco', date:'2024'},
  {name:'Introduction to Cybersecurity', issuer:'Cisco Networking Academy', category:'cisco', date:'2024'},
  {name:'Ethical Hacker', issuer:'Cisco Networking Academy', category:'cisco', date:'2024'},
  {name:'Introduction to Modern AI', issuer:'Simplilearn', category:'simplilearn', date:'2024'},
  {name:'Fundamentals of Machine Learning', issuer:'Simplilearn', category:'simplilearn', date:'2024'},
  {name:'Big Data Analytics', issuer:'Simplilearn', category:'simplilearn', date:'2024'},
  {name:'Cloud Computing Fundamentals', issuer:'Simplilearn', category:'simplilearn', date:'2024'},
  {name:'DevOps Essentials', issuer:'Simplilearn', category:'simplilearn', date:'2024'},
  {name:'Web Development Foundations', issuer:'Mindluster', category:'mindluster', date:'2024'},
  {name:'Advanced Software Engineering Job Simulation', issuer:'Walmart Global Tech', category:'simulation', date:'2025'},
  {name:'Software Engineering Job Simulation', issuer:'JPMorgan Chase', category:'simulation', date:'2025'},
  {name:'Technology Software Development Job Simulation', issuer:'Accenture', category:'simulation', date:'2025'},
  {name:'Tech Explorer Job Simulation', issuer:'Deloitte', category:'simulation', date:'2025'},
  {name:'Solutions Architecture Job Simulation', issuer:'AWS', category:'simulation', date:'2025'},
  {name:'Robotics and Controls Job Simulation', issuer:'Boston Dynamics', category:'simulation', date:'2025'},
  {name:'Data Science Job Simulation', issuer:'BCG X', category:'simulation', date:'2025'},
  {name:'Data Analytics Job Simulation', issuer:'Accenture', category:'simulation', date:'2025'},
  {name:'Data Visualisation — Empowering Business with Insights', issuer:'Tata Group', category:'simulation', date:'2025'},
  {name:'GenAI Job Simulation', issuer:'BCG X', category:'simulation', date:'2025'},
  {name:'Cybersecurity Job Simulation', issuer:'Mastercard', category:'simulation', date:'2025'},
  {name:'Credit Analyst Job Simulation', issuer:'JPMorgan Chase', category:'simulation', date:'2025'},
  {name:'Investment Management Job Simulation', issuer:'Citi', category:'simulation', date:'2025'},
  {name:'Financial Services Climate Change Job Simulation', issuer:'Bank of America', category:'simulation', date:'2025'},
  {name:'Project Management Job Simulation', issuer:'Siemens', category:'simulation', date:'2025'},
  {name:'Product Management Job Simulation', issuer:'Lloyds Banking Group', category:'simulation', date:'2025'}
];

const certList = document.getElementById('certList');
if (certList) {
  const renderCertificates = (filter = 'all') => {
    const list = filter === 'all' ? certificates : certificates.filter(c => c.category === filter);
    certList.innerHTML = list.map((c, idx) => `
      <div class="cert-item" style="animation:fadeUp .4s ease ${Math.min(idx * 15, 400)}ms backwards">
        <div class="verified-badge">Certificate</div>
        <h4>${c.name}</h4>
        <div class="provider">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M9 13.5L7 22l5-3 5 3-2-8.5"/></svg>
          ${c.issuer}
        </div>
        <div class="cert-meta">
          <div class="meta-row"><span class="label">Issued</span><span class="value">${c.date}</span></div>
        </div>
      </div>
    `).join('');
  };
  renderCertificates();
  document.querySelectorAll('.cert-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cert-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderCertificates(btn.dataset.filter);
    });
  });
}

/* ================= 3D TILT & GLOW ================= */
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.card, .cert, .service, .stat, .edu, .project-card, .story-block, .pricing-card').forEach(el => {
    let raf;
    el.addEventListener('mousemove', e => {
      if (!el.classList.contains('visible') && el.classList.contains('reveal')) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--rx', `${-y * 4}deg`);
        el.style.setProperty('--ry', `${x * 4}deg`);
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
    el.addEventListener('mouseleave', () => {
      cancelAnimationFrame(raf);
      el.style.removeProperty('--rx');
      el.style.removeProperty('--ry');
    });
  });
}

/* ================= TOAST NOTIFICATIONS ================= */
let toastTimer;
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.setAttribute('aria-live', 'polite');
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3600);
}

/* ================= PRICING PLANS (API + FALLBACK) ================= */
const DEFAULT_PLANS = [
  { name: 'Starter', price: '$299', suffix: 'starting', desc: 'For a clean landing page or small business site.',
    features: ['1–3 page website', 'Mobile responsive', 'Basic SEO setup', 'Contact form', '7-day support'], cta: 'Get Started' },
  { name: 'Professional', price: '$799', suffix: 'starting', desc: 'For e-commerce, SaaS tools, and serious business sites.',
    features: ['Up to 8 pages / product catalogue', 'Advanced animations', 'SEO + analytics', 'Quote / checkout flow', '30-day support'], cta: 'Get Started', featured: true },
  { name: 'Scale', price: '$1,500+', suffix: 'custom', desc: 'For AI tools, custom dashboards, and ongoing work.',
    features: ['Custom web app', 'API / AI integration', 'Admin dashboard', 'Deployment + CI/CD', 'Priority support'], cta: 'Discuss Project' }
];

function renderPricingGrid(target, plans) {
  if (!target) return;
  target.innerHTML = plans.map(p => `
    <div class="pricing-card ${p.featured ? 'featured' : ''} reveal visible">
      <div class="plan-name">${p.name}</div>
      <div class="price">${p.price} <small>${p.suffix || ''}</small></div>
      <p style="color:var(--muted);font-size:.9rem;line-height:1.7">${p.desc || ''}</p>
      <ul>${(p.features || []).map(f => `<li>${f}</li>`).join('')}</ul>
      <a class="btn primary" href="/contact.html?plan=${encodeURIComponent(p.name)}">${p.cta || 'Get Quote'}</a>
    </div>
  `).join('');
}

async function loadPricing() {
  const targets = document.querySelectorAll('#homePricing, #pricingGrid');
  if (!targets.length) return;
  let plans = DEFAULT_PLANS;
  
  try {
    const res = await fetch('/api/settings');
    if (res.ok) {
      const s = await res.json();
      if (s.pricingPlans) {
        try {
          const parsed = JSON.parse(s.pricingPlans);
          if (Array.isArray(parsed) && parsed.length) plans = parsed;
        } catch {}
      }
    }
  } catch {}
  
  targets.forEach(t => renderPricingGrid(t, plans));
}
loadPricing();

/* ================= CONTACT FORM SUBMISSION ================= */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  const params = new URLSearchParams(location.search);
  const planParam = params.get('plan');
  const typeParam = params.get('type');
  if (planParam && contactForm.plan) contactForm.plan.value = planParam;
  if (typeParam && contactForm.projectType) contactForm.projectType.value = typeParam;

  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(this).entries());
    if (!data.name || !data.email || !data.message) {
      showToast('Please fill name, email and message.');
      return;
    }
    
    const btn = this.querySelector('button[type="submit"]');
    const oldText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';

    let sent = false;
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        sent = true;
        showToast('Quote request sent. I\'ll reply within 24 hours.');
        this.reset();
      }
    } catch {}

    if (!sent) {
      const body = encodeURIComponent(
        `Name: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || ''}\n` +
        `Company: ${data.company || ''}\nProject Type: ${data.projectType || ''}\n` +
        `Plan: ${data.plan || ''}\nBudget: ${data.budget || ''}\n` +
        `Timeline: ${data.timeline || ''}\n\n${data.message}`
      );
      window.location.href = `mailto:alimalikse002@gmail.com?subject=Project%20Quote%20Request&body=${body}`;
      showToast('Opening your email client…');
    }

    btn.disabled = false;
    btn.textContent = oldText;
  });
}

/* ================= NEWSLETTER ================= */
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    showToast('Thanks for subscribing!');
    newsletterForm.reset();
  });
}

/* ================= SITE SETTINGS ================= */
fetch('/api/settings').then(r => r.ok ? r.json() : null).then(s => {
  if (!s) return;
  document.querySelectorAll('[data-setting]').forEach(el => {
    const key = el.dataset.setting;
    if (s[key]) el.textContent = s[key];
  });
}).catch(() => {});
