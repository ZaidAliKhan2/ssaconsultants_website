import './components.js';
import { initNavigation } from './navigation.js';

function initServiceFaq() {
  const items = [...document.querySelectorAll('.faq-item')].map(item => ({
    item,
    button: item.querySelector('.faq-question'),
    answer: item.querySelector('.faq-answer')
  }));

  function setExpanded(entry, expanded) {
    entry.button.setAttribute('aria-expanded', String(expanded));
    entry.item.classList.toggle('is-collapsed', !expanded);
    entry.answer.inert = !expanded;
    entry.answer.setAttribute('aria-hidden', String(!expanded));
  }

  items.forEach(entry => {
    setExpanded(entry, false);
    // Native buttons provide Enter / Space activation and ordinary Tab navigation.
    entry.button.addEventListener('click', () => {
      const expand = entry.button.getAttribute('aria-expanded') !== 'true';
      items.forEach(item => setExpanded(item, item === entry && expand));
    });
  });
}

function initServiceNavigation() {
  const navigation = document.querySelector('.service-navigation');
  const track = navigation.querySelector('.service-navigation-track');
  const links = [...track.querySelectorAll('a')];
  const sections = [...document.querySelectorAll('[data-service-section]')];
  const cases = [...document.querySelectorAll('[data-use-case]')];
  let geometry = [];
  let caseGeometry = [];
  let offset = 0;
  let dirty = true;
  let frame = 0;
  let currentLink = null;
  let currentCase = cases[0];

  function measure() {
    const scrollY = window.scrollY;
    offset = parseFloat(getComputedStyle(navigation).top) + navigation.offsetHeight + 24;
    geometry = sections.map(section => {
      const rect = section.getBoundingClientRect();
      return { section, top: rect.top + scrollY, bottom: rect.bottom + scrollY };
    });
    caseGeometry = cases.map(element => ({ element, top: element.getBoundingClientRect().top + scrollY }));
    dirty = false;
  }

  function render() {
    frame = 0;
    // Body locking temporarily changes scrollY; wait for the menu to close.
    if (document.body.classList.contains('menu-open')) return;
    if (dirty) measure();
    const readingLine = window.scrollY + offset + 1;
    const active = geometry.find(item => item.top <= readingLine && item.bottom > readingLine);
    const nextLink = active ? links.find(link => link.hash === `#${active.section.id}`) : null;
    if (nextLink !== currentLink) {
      currentLink?.removeAttribute('aria-current');
      nextLink?.setAttribute('aria-current', 'location');
      currentLink = nextLink;
      if (nextLink) {
        // Scroll only the horizontal index; never move the page during scrollspy.
        const linkRect = nextLink.getBoundingClientRect();
        const trackRect = track.getBoundingClientRect();
        if (linkRect.left < trackRect.left || linkRect.right > trackRect.right) {
          track.scrollTo({ left: track.scrollLeft + linkRect.left - trackRect.left - (trackRect.width - linkRect.width) / 2, behavior: 'auto' });
        }
      }
    }
    const caseLine = window.scrollY + Math.max(offset + 100, window.innerHeight * .5);
    const focusedCase = caseGeometry.filter(item => item.top <= caseLine).at(-1)?.element || cases[0];
    if (focusedCase !== currentCase) {
      currentCase?.classList.remove('is-active');
      focusedCase.classList.add('is-active');
      currentCase = focusedCase;
    }
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(render); }
  function invalidate() { dirty = true; schedule(); }
  const observer = new ResizeObserver(invalidate);
  document.querySelectorAll('main > section, .automation-use-case, .service-navigation').forEach(section => observer.observe(section));
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', invalidate, { passive: true });
  window.addEventListener('hashchange', schedule);
  window.addEventListener('pageshow', invalidate);
  document.fonts?.ready.then(invalidate);
  window.ScrollTrigger?.addEventListener('refresh', invalidate);
  schedule();
}

function initServiceReveals() {
  if (!window.gsap || !window.ScrollTrigger) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  // MatchMedia reverts animation styles if reduced motion is enabled later.
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    // Direct links open with the destination already readable.
    if (!location.hash) {
      gsap.from('.services-intro-label, .services-hero-heading > *', {
        opacity: 0, y: 18, duration: .75, stagger: .1, ease: 'power3.out', clearProps: 'transform,opacity'
      });
    }
    document.querySelectorAll('[data-service-reveal]').forEach(element => {
      if (element.closest(location.hash && /^#[a-z-]+$/.test(location.hash) ? location.hash : '#no-anchor-target')) return;
      gsap.from(element, {
        opacity: 0, y: 22, duration: .75, ease: 'power3.out', clearProps: 'transform,opacity',
        scrollTrigger: { trigger: element, start: 'top 92%', once: true }
      });
    });
  });
}

function boot() {
  initNavigation();
  initServiceFaq();
  if (window.lucide) window.lucide.createIcons({ attrs: { 'stroke-width': 1.6 } });
  initServiceNavigation();
  initServiceReveals();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
