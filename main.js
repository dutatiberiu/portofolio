// ============================================
//   CUSTOM CURSOR
// ============================================
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX - 4 + 'px';
  dot.style.top  = mouseY - 4 + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  ring.style.left = ringX - 18 + 'px';
  ring.style.top  = ringY - 18 + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Hover detection for cursor ring enlargement
document.querySelectorAll('a, button, .project-card, .skill-chip').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
});

// ============================================
//   TYPING ANIMATION
// ============================================
const phrases = [
  'Landing pages that convert visitors into customers.',
  'Clean code. Bold design.',
  'Making pixels dance with purpose.',
  'Building simple but modern, responsive web experiences'
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;
const typeTarget = document.getElementById('heroSubtitle');

function typeLoop() {
  const current = phrases[phraseIdx];
  typeTarget.classList.add('typing-cursor');

  if (!isDeleting) {
    typeTarget.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      isDeleting = true;
      setTimeout(typeLoop, 2000);
      return;
    }
    setTimeout(typeLoop, 60 + Math.random() * 40);
  } else {
    typeTarget.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typeLoop, 400);
      return;
    }
    setTimeout(typeLoop, 30);
  }
}
typeLoop();

// ============================================
//   SCROLL REVEAL
// ============================================
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

reveals.forEach(el => revealObserver.observe(el));

// ============================================
//   PARALLAX
// ============================================
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.querySelectorAll('.parallax-element').forEach(el => {
    const speed = parseFloat(el.dataset.speed) || 0.02;
    el.style.transform = `translateY(${scrollY * speed * 100}px)`;
  });
});

// ============================================
//   MOBILE NAV
// ============================================
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

function toggleMobileNav() {
  const isOpen = mobileNav.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', isOpen);
}

hamburger.addEventListener('click', toggleMobileNav);

// Close mobile nav when a link is clicked
mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', toggleMobileNav);
});

// ============================================
//   CONTACT FORM — Web3Forms
// ============================================
const contactForm = document.getElementById('contactForm');

async function handleSubmit(e) {
  e.preventDefault();
  const btn = contactForm.querySelector('.submit-btn');
  const originalText = btn.textContent;

  // Loading state
  btn.textContent = 'Sending...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  try {
    const formData = new FormData(contactForm);
    const payload = JSON.stringify(Object.fromEntries(formData));

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: payload
    });

    const result = await response.json();

    if (result.success) {
      btn.textContent = 'Message Sent ✓';
      btn.style.background = 'var(--accent-cool)';
      btn.style.opacity = '1';
      contactForm.reset();
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    } else {
      throw new Error(result.message || 'Submission failed');
    }
  } catch (err) {
    btn.textContent = 'Error — Try Again';
    btn.style.background = '#e55';
    btn.style.opacity = '1';
    btn.disabled = false;
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 3000);
  }
}

contactForm.addEventListener('submit', handleSubmit);

// ============================================
//   SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================
//   FOOTER YEAR (auto-update)
// ============================================
const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
