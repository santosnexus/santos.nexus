/* ============================================
   Santos.Nexus — Common JS
   - Navigation behaviors
   - Scroll reveals
   - Smooth scroll
   ============================================ */

// === Nav: scroll detection ===
const nav = document.querySelector('.nav');
if (nav) {
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 8) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
    lastScroll = y;
  }, { passive: true });
}

// === Nav: mobile toggle ===
const mobileBtn = document.querySelector('.nav__mobile-btn');
if (mobileBtn) {
  mobileBtn.addEventListener('click', () => {
    nav.classList.toggle('is-mobile-open');
  });
}

// === Scroll reveals (Intersection Observer) ===
const reveals = document.querySelectorAll('.reveal');
if (reveals.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

  reveals.forEach((el) => observer.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-in'));
}

// === Animated counters ===
const counters = document.querySelectorAll('[data-counter]');
if (counters.length && 'IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.counter);
        const suffix = el.dataset.suffix || '';
        const duration = 1500;
        const start = performance.now();
        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = target * eased;
          if (target >= 1000) {
            el.textContent = Math.floor(value).toLocaleString() + suffix;
          } else if (target % 1 !== 0) {
            el.textContent = value.toFixed(1) + suffix;
          } else {
            el.textContent = Math.floor(value) + suffix;
          }
          if (progress < 1) requestAnimationFrame(animate);
          else {
            if (target >= 1000) el.textContent = Math.floor(target).toLocaleString() + suffix;
            else if (target % 1 !== 0) el.textContent = target.toFixed(1) + suffix;
            else el.textContent = target + suffix;
          }
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach((el) => counterObserver.observe(el));
}

// === Form submission (contact) ===
const form = document.querySelector('form[data-form]');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = 'Sending...';
    button.disabled = true;

    setTimeout(() => {
      // Simulate submission
      const success = document.createElement('div');
      success.className = 'form__success';
      success.style.cssText = 'background:#2A9D8F;color:white;padding:1rem 1.5rem;border-radius:8px;margin-top:1rem;font-weight:600;';
      success.textContent = '✓ Thanks! We received your message and will respond within 24 hours.';
      form.appendChild(success);
      form.reset();
      button.textContent = originalText;
      button.disabled = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 800);
  });
}
