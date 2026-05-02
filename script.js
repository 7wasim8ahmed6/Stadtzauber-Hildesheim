(function () {
  'use strict';

  const qs  = (sel, ctx) => (ctx || document).querySelector(sel);
  const qsa = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];

  // ── Opening hours constants ──────────────────────────────────
  // [openHour, openMinute, closeHour, closeMinute]
  const HOURS_WEEKDAY = [8, 30, 16, 30]; // Mon–Fri
  const HOURS_WEEKEND = [9, 0,  16, 0];  // Sat–Sun

  // ── 1. Navbar scroll behavior ────────────────────────────────
  function initNavbar() {
    const navbar = qs('#navbar');
    if (!navbar) return;

    let ticking = false;

    function updateNavbar() {
      if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
      }
    }, { passive: true });
  }

  // ── 2. Smooth scroll for anchor links ───────────────────────
  function initSmoothScroll() {
    const navHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
      10
    ) || 72;

    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const target = qs(link.getAttribute('href'));
      if (!target) return;

      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });

      // Close mobile menu if open
      document.body.classList.remove('nav-open');
      const toggle = qs('.nav-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }

  // ── 3. Active nav link on scroll ────────────────────────────
  function initActiveNavLinks() {
    const sections = qsa('main section[id]');
    const navLinks = qsa('.nav-links a');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      });
    }, { threshold: 0.35 });

    sections.forEach(function (section) { observer.observe(section); });
  }

  // ── 4. Scroll reveal animations ─────────────────────────────
  function initRevealAnimations() {
    const elements = qsa('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(function (el) { observer.observe(el); });
  }

  // ── 5. Mobile navigation ────────────────────────────────────
  function initMobileMenu() {
    const toggle  = qs('.nav-toggle');
    const overlay = qs('.nav-overlay');
    if (!toggle) return;

    function openMenu() {
      document.body.classList.add('nav-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Menü schließen');
      if (overlay) overlay.removeAttribute('aria-hidden');
    }

    function closeMenu() {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Menü öffnen');
      if (overlay) overlay.setAttribute('aria-hidden', 'true');
    }

    toggle.addEventListener('click', function () {
      document.body.classList.contains('nav-open') ? closeMenu() : openMenu();
    });

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        closeMenu();
        toggle.focus();
      }
    });
  }

  // ── 6. Menu tabs ────────────────────────────────────────────
  function initMenuTabs() {
    const tabList = qs('[role="tablist"]');
    if (!tabList) return;

    const buttons = qsa('.tab-btn', tabList);
    const panels  = qsa('.menu-panel');

    function activateTab(btn) {
      const targetId = 'tab-' + btn.dataset.tab;

      buttons.forEach(function (b) {
        const isActive = b === btn;
        b.classList.toggle('tab-btn--active', isActive);
        b.setAttribute('aria-selected', String(isActive));
      });

      panels.forEach(function (panel) {
        const isTarget = panel.id === targetId;
        panel.classList.toggle('menu-panel--active', isTarget);
        if (isTarget) {
          panel.removeAttribute('hidden');
          // Re-trigger reveal animations in newly shown panel
          qsa('.reveal', panel).forEach(function (el) {
            if (!el.classList.contains('is-visible')) {
              el.classList.add('is-visible');
            }
          });
        } else {
          panel.setAttribute('hidden', '');
        }
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () { activateTab(btn); });
    });

    // Arrow key navigation
    tabList.addEventListener('keydown', function (e) {
      const idx = buttons.indexOf(document.activeElement);
      if (idx === -1) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        buttons[(idx + 1) % buttons.length].focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        buttons[(idx - 1 + buttons.length) % buttons.length].focus();
      }
    });
  }

  // ── 7. WhatsApp button delayed fade-in ──────────────────────
  function initWhatsAppButton() {
    const btn = qs('#whatsapp-btn');
    if (!btn) return;

    setTimeout(function () {
      btn.classList.add('visible');
      // Trigger pulse after the button appears
      setTimeout(function () {
        btn.classList.add('pulse');
        btn.addEventListener('animationend', function () {
          btn.classList.remove('pulse');
        }, { once: true });
      }, 600);
    }, 1500);
  }

  // ── 8. Live opening hours indicator ─────────────────────────
  function initHoursIndicator() {
    const container = qs('#hours-status');
    if (!container) return;

    const now  = new Date();
    const day  = now.getDay();     // 0=Sun … 6=Sat
    const h    = now.getHours();
    const m    = now.getMinutes();
    const mins = h * 60 + m;

    const isWeekend = day === 0 || day === 6;
    const rule = isWeekend ? HOURS_WEEKEND : HOURS_WEEKDAY;

    const openMins  = rule[0] * 60 + rule[1];
    const closeMins = rule[2] * 60 + rule[3];

    const badge = document.createElement('span');
    badge.className = 'hours-badge';

    const dot = document.createElement('span');
    dot.className = 'hours-badge__dot';
    badge.appendChild(dot);

    const label = document.createElement('span');

    if (mins >= openMins && mins < closeMins) {
      badge.classList.add('hours-badge--open');
      const closeH = rule[2].toString().padStart(2, '0');
      const closeM = rule[3].toString().padStart(2, '0');
      label.textContent = 'Jetzt geöffnet · Schließt um ' + closeH + ':' + closeM + ' Uhr';
    } else {
      badge.classList.add('hours-badge--closed');
      if (mins < openMins) {
        const openH = rule[0].toString().padStart(2, '0');
        const openM = rule[1].toString().padStart(2, '0');
        label.textContent = 'Heute geschlossen · Öffnet um ' + openH + ':' + openM + ' Uhr';
      } else {
        // Determine next opening
        const nextIsWeekend = day === 5 || day === 6; // Fri eve→Sat, Sat eve→Sun
        const nextRule = (day === 5 || day === 6) ? HOURS_WEEKEND : HOURS_WEEKDAY;
        const nextH = nextRule[0].toString().padStart(2, '0');
        const nextM = nextRule[1].toString().padStart(2, '0');
        label.textContent = 'Heute geschlossen · Morgen ab ' + nextH + ':' + nextM + ' Uhr';
      }
    }

    badge.appendChild(label);
    container.appendChild(badge);
  }

  // ── 9. Hero parallax ────────────────────────────────────────
  function initHeroParallax() {
    const bg = qs('.hero-bg');
    if (!bg) return;

    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(function () {
          const y = window.scrollY;
          bg.style.transform = 'translateY(' + y * 0.35 + 'px)';
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ── 10. Gallery collapse toggle ──────────────────────────────
  function initGalleryCollapse() {
    const btn        = qs('#gallery-toggle-btn');
    const collapsible = qs('#gallery-collapsible');
    const label      = btn && qs('.gallery-toggle__label', btn);
    if (!btn || !collapsible) return;

    btn.addEventListener('click', function () {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      if (isExpanded) {
        collapsible.classList.add('collapsed');
        btn.setAttribute('aria-expanded', 'false');
        label.textContent = 'Anzeigen';
      } else {
        collapsible.classList.remove('collapsed');
        btn.setAttribute('aria-expanded', 'true');
        label.textContent = 'Ausblenden';
      }
    });
  }

  // ── Init ────────────────────────────────────────────────────
  function init() {
    initNavbar();
    initSmoothScroll();
    initActiveNavLinks();
    initRevealAnimations();
    initMobileMenu();
    initMenuTabs();
    initWhatsAppButton();
    initHoursIndicator();
    initGalleryCollapse();
    if (window.matchMedia('(min-width: 769px)').matches) {
      initHeroParallax();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
