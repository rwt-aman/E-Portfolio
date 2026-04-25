// ─── DISABLE EDITING (SAFEGUARD) ───
document.designMode = 'off';

// ─── NAV TOGGLE ───
function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
}

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

// ─── NAV SHRINK ON SCROLL ───
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScrollY = window.scrollY;
});

// ─── ACTIVE NAV ON SCROLL ───
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 220) current = sec.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// ─── SCROLL ANIMATIONS (staggered) ───
const observerOptions = { threshold: 0.06, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      const parent = entry.target.parentElement;
      const siblings = parent ? Array.from(parent.children).filter(c => c.classList.contains('fade-in')) : [];
      const childIndex = siblings.indexOf(entry.target);
      const delay = childIndex >= 0 ? childIndex * 80 : 0;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in, .tl-item').forEach(el => observer.observe(el));

// ─── TYPEWRITER ───
const roles = ['Full Stack Developer', 'React Developer', 'Open Source Contributor', 'Problem Solver'];
let ri = 0, ci = 0, deleting = false;
const typeEl = document.getElementById('typewriterText');

function typeWriter() {
  const role = roles[ri];
  typeEl.textContent = deleting ? role.slice(0, --ci) : role.slice(0, ++ci);
  if (!deleting && ci === role.length) { deleting = true; setTimeout(typeWriter, 2000); return; }
  if (deleting && ci === 0)            { deleting = false; ri = (ri + 1) % roles.length; }
  setTimeout(typeWriter, deleting ? 45 : 85);
}
setTimeout(typeWriter, 800);

// ─── VIDEO UPLOAD ───
function uploadVideo(event) {
  const file = event.target.files[0];
  if (!file) return;
  const video       = document.getElementById('introVideo');
  const placeholder = document.getElementById('videoPlaceholder');
  video.src         = URL.createObjectURL(file);
  video.style.display       = 'block';
  placeholder.style.display = 'none';
  document.getElementById('videoBox').style.cursor = 'default';
  document.getElementById('videoBox').onclick = null;
}

// ─── PROFILE PIC UPLOAD ───
function uploadPic(event) {
  const file = event.target.files[0];
  if (!file) return;
  const img         = document.getElementById('profileImg');
  const placeholder = document.getElementById('picPlaceholder');
  img.src           = URL.createObjectURL(file);
  img.style.display = 'block';
  placeholder.style.display = 'none';
}

// ─── RESUME UPLOAD ───
let resumeURL = null;

function uploadResume(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (resumeURL) URL.revokeObjectURL(resumeURL);
  resumeURL = URL.createObjectURL(file);
  document.getElementById('resumeFilename').textContent  = file.name;
  document.getElementById('resumeFilesize').textContent  = formatBytes(file.size);
  document.getElementById('resumeDownload').href         = resumeURL;
  document.getElementById('resumeDownload').download     = file.name;
  document.getElementById('resumePreview').classList.add('visible');
  document.getElementById('resumeZone').style.display    = 'none';
}

function clearResume() {
  document.getElementById('resumePreview').classList.remove('visible');
  document.getElementById('resumeZone').style.display = 'block';
  document.getElementById('resume-input').value       = '';
  if (resumeURL) { URL.revokeObjectURL(resumeURL); resumeURL = null; }
}

function formatBytes(bytes) {
  if (bytes < 1024)        return bytes + ' B';
  if (bytes < 1048576)     return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(2) + ' MB';
}

// ─── SMOOTH PAGE LOAD ───
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity    = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });
});

// ─── PARALLAX ORBS ON MOUSE MOVE ───
const orbs = document.querySelectorAll('.hero-orb');
const heroSection = document.getElementById('hero');

if (heroSection && orbs.length) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 15;
      orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });
}

// ─── COUNTER ANIMATION FOR STATS ───
function animateCounters() {
  const stats = document.querySelectorAll('.stat-n');
  stats.forEach(stat => {
    if (stat.dataset.animated) return;
    const text = stat.textContent.trim();
    const match = text.match(/^([\d.]+)(\+?)$/);
    if (!match) return;

    const target = parseFloat(match[1]);
    const suffix = match[2] || '';
    const isDecimal = text.includes('.');
    const duration = 1200;
    const start = performance.now();

    stat.dataset.animated = 'true';
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      stat.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ─── TILT EFFECT ON PROJECT CARDS ───
document.querySelectorAll('.project-card, .skill-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateX = (y - 0.5) * -6;
    const rotateY = (x - 0.5) * 6;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'box-shadow 0.35s, border-color 0.35s';
  });
});
