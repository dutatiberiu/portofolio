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
//   HOVER PREVIEW TOOLTIP
// ============================================
if (window.matchMedia('(hover: hover)').matches) {
  const hoverPreview    = document.getElementById('hoverPreview');
  const hoverPreviewImg = document.getElementById('hoverPreviewImg');
  const hoverPreviewLoading = document.getElementById('hoverPreviewLoading');
  let hoverTimer = null;
  let currentUrl = null;

  function positionTooltip(card) {
    const rect = card.getBoundingClientRect();
    const w = 300, h = 220;
    let left = rect.left + rect.width / 2 - w / 2;
    let top  = rect.top - h - 12;

    left = Math.max(12, Math.min(left, window.innerWidth - w - 12));
    if (top < 8) top = rect.bottom + 12;

    hoverPreview.style.left = left + 'px';
    hoverPreview.style.top  = top  + 'px';
  }

  function showPreview(card) {
    const url = card.dataset.preview;
    if (!url) return;

    positionTooltip(card);

    // Only reload image if URL changed
    if (url !== currentUrl) {
      currentUrl = url;
      hoverPreviewImg.classList.remove('loaded');
      hoverPreviewImg.style.display = 'none';
      hoverPreviewLoading.style.display = 'flex';

      const src = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

      hoverPreviewImg.onload = () => {
        hoverPreviewLoading.style.display = 'none';
        hoverPreviewImg.style.display = 'block';
        hoverPreviewImg.classList.add('loaded');
      };
      hoverPreviewImg.onerror = () => {
        hoverPreview.classList.remove('visible');
        currentUrl = null;
      };
      hoverPreviewImg.src = src;
    }

    hoverPreview.classList.add('visible');
    hoverPreview.setAttribute('aria-hidden', 'false');
  }

  function hidePreview() {
    clearTimeout(hoverTimer);
    hoverPreview.classList.remove('visible');
    hoverPreview.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('.project-card[data-preview]').forEach(card => {
    card.addEventListener('mouseenter', () => {
      hoverTimer = setTimeout(() => showPreview(card), 700);
    });
    card.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimer);
      hidePreview();
    });
  });
}
