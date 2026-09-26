import './components.js';
import { initNavigation } from './navigation.js';
import { initAboutPrinciples } from './about-principles.js';

function initAboutReveals() {
  if (!window.gsap || !window.ScrollTrigger) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  // Revert inline animation styles when reduced-motion preferences change.
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    if (!location.hash) {
      gsap.from('[data-about-intro]', {
        opacity: 0, y: 16, duration: .8, stagger: .09,
        ease: 'power2.out', clearProps: 'transform,opacity'
      });
      gsap.from('.about-hero-photo', {
        clipPath: 'inset(0 0 0 10%)', duration: 1.1, ease: 'power2.out', clearProps: 'clipPath'
      });
    }
    const destination = document.getElementById(location.hash.slice(1));
    document.querySelectorAll('[data-about-reveal]').forEach(element => {
      if (destination?.contains(element)) return;
      gsap.from(element, {
        opacity: 0, y: 16, duration: .7, ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: { trigger: element, start: 'top 92%', once: true }
      });
    });
  });
  // Each statement resolves as it enters the reading area; the page never pins.
  media.add({
    motion: '(prefers-reduced-motion: no-preference)',
    mobile: '(max-width: 620px)'
  }, context => {
    if (!context.conditions.motion) return;
    const mobile = context.conditions.mobile;
    document.querySelectorAll('[data-connection-reveal]').forEach(statement => {
      gsap.from(statement, {
        opacity: .15, y: mobile ? 0 : 32, ease: 'none',
        scrollTrigger: {
          trigger: statement.parentElement, start: 'top 92%',
          end: mobile ? 'top 75%' : 'top 55%', scrub: .5
        }
      });
    });
    gsap.from('.about-connections-rule span', {
      scaleX: 0, ease: 'none',
      scrollTrigger: { trigger: '.about-connections', start: 'top 85%', end: 'bottom 85%', scrub: .5 }
    });
  });
}

function boot() {
  initNavigation();
  initAboutPrinciples();
  initAboutReveals();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
