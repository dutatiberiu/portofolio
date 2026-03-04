// ============================================
//   CUSTOM CURSOR (desktop/hover devices only)
// ============================================
if (window.matchMedia('(hover: hover)').matches) {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let ringDirty = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX - 4 + 'px';
    dot.style.top  = mouseY - 4 + 'px';
    ringDirty = true;
  });

  function animateRing() {
    if (ringDirty || Math.abs(mouseX - ringX) > 0.5 || Math.abs(mouseY - ringY) > 0.5) {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX - 18 + 'px';
      ring.style.top  = ringY - 18 + 'px';
      ringDirty = false;
    }
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover detection for cursor ring enlargement
  document.querySelectorAll('a, button, .project-card, .skill-chip').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
}

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
//   PARALLAX (cached + rAF throttled)
// ============================================
const parallaxEls = [...document.querySelectorAll('.parallax-element')];
let scrollTicking = false;

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.speed) || 0.02;
        el.style.transform = `translateY(${scrollY * speed * 100}px)`;
      });
      scrollTicking = false;
    });
    scrollTicking = true;
  }
});

// ============================================
//   MOBILE NAV
// ============================================
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

function toggleMobileNav() {
  const isOpen = mobileNav.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', isOpen);
  mobileNav.setAttribute('aria-hidden', !isOpen);
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
//   SMOOTH SCROLL (with fixed nav offset)
// ============================================
const navHeight = document.querySelector('nav').offsetHeight;

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - navHeight - 16,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
//   SCROLL PROGRESS BAR
// ============================================
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  scrollProgress.style.width = pct + '%';
}, { passive: true });

// ============================================
//   PROJECT PREVIEW MODAL
// ============================================
const previewModal  = document.getElementById('previewModal');
const previewFrame  = document.getElementById('previewFrame');
const previewUrl    = document.getElementById('previewUrl');
const previewOpenBtn = document.getElementById('previewOpenBtn');
const previewClose  = document.getElementById('previewClose');
const previewBlocked = document.getElementById('previewBlocked');
const previewBlockedLink = document.getElementById('previewBlockedLink');

function openPreview(url) {
  previewUrl.textContent = url;
  previewOpenBtn.href = url;
  previewBlockedLink.href = url;
  previewBlocked.style.display = 'none';
  previewFrame.style.display = 'block';
  previewFrame.src = url;
  previewModal.classList.add('open');
  previewModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closePreview() {
  previewModal.classList.remove('open');
  previewModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  // Reset iframe after transition
  setTimeout(() => { previewFrame.src = ''; }, 300);
}

// Detect iframe load errors (sites that block embedding)
previewFrame.addEventListener('load', () => {
  try {
    // Accessing contentDocument throws if cross-origin with X-Frame-Options deny
    const doc = previewFrame.contentDocument;
    if (!doc || doc.body.innerHTML === '') {
      previewFrame.style.display = 'none';
      previewBlocked.style.display = 'flex';
    }
  } catch (e) {
    // Cross-origin — iframe loaded but we can't inspect; assume it worked
  }
});

previewFrame.addEventListener('error', () => {
  previewFrame.style.display = 'none';
  previewBlocked.style.display = 'flex';
});

// Intercept project link clicks
document.querySelectorAll('.project-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    openPreview(link.href);
  });
});

previewClose.addEventListener('click', closePreview);

// Close on overlay click (outside inner box)
previewModal.addEventListener('click', (e) => {
  if (e.target === previewModal) closePreview();
});

// Close on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && previewModal.classList.contains('open')) closePreview();
});
