import './components.js';
import { initNavigation } from './navigation.js';
import { initWhyComparison } from './why-comparison.js';

function initWhyPageMotion() {
  if (!window.gsap || !window.ScrollTrigger) return;
  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    if (!location.hash) gsap.from('[data-why-intro]', {
      opacity: 0, y: 18, duration: .8, stagger: .1, ease: 'power2.out', clearProps: 'transform,opacity'
    });
    const destination = document.getElementById(location.hash.slice(1));
    document.querySelectorAll('[data-why-reveal]').forEach(element => {
      if (destination?.contains(element)) return;
      gsap.from(element, {
        opacity: 0, y: 18, duration: .65, ease: 'power2.out', clearProps: 'transform,opacity',
        scrollTrigger: { trigger: element, start: 'top 92%', once: true }
      });
    });
    const map = document.querySelector('[data-connection-map]');
    const connection = gsap.timeline({
      scrollTrigger: { trigger: map, start: 'top 88%', end: 'center 48%', scrub: .6 }
    });
    connection.from(map.querySelectorAll('.why-map-node'), {
      opacity: .4, x: index => index % 2 ? 12 : -12, y: 8, duration: .5, stagger: .04, ease: 'power1.out'
    }).from(map.querySelectorAll('path'), {
      strokeDashoffset: 1, duration: .8, stagger: .08, ease: 'none'
    }, .2);
  });
}

function boot() {
  initNavigation();
  initWhyComparison();
  initWhyPageMotion();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
