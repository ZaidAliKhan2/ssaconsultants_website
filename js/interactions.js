/** CSS owns the independent loops; one RAF handles decorative pointer/scroll depth. */
export function initHeroAtmosphere() {
  const hero = document.querySelector('.hero');
  if (!hero || hero.dataset.motionReady) return;
  hero.dataset.motionReady = 'true';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)');
  const desktop = matchMedia('(min-width: 901px)');
  let frame = 0;
  let inView = true;
  let bounds;
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  let lastTime = 0;
  let dirty = true;
  const enabled = () => !reduced.matches && inView && !document.hidden;

  function render(time) {
    frame = 0;
    if (!enabled()) return;
    if (dirty) {
      const rect = hero.getBoundingClientRect();
      bounds = { top: rect.top + window.scrollY, left: rect.left, width: rect.width, height: rect.height };
      dirty = false;
    }
    // Time-based pointer easing stays consistent across 60Hz and 120Hz displays.
    const elapsed = lastTime ? Math.min(time - lastTime, 64) : 16;
    lastTime = time;
    const blend = 1 - Math.exp(-elapsed / 130);
    currentX += (targetX - currentX) * blend;
    currentY += (targetY - currentY) * blend;
    hero.style.setProperty('--hero-x', `${currentX.toFixed(3)}px`);
    hero.style.setProperty('--hero-y', `${currentY.toFixed(3)}px`);
    const progress = Math.min(1, Math.max(0, (window.scrollY - bounds.top) / bounds.height));
    hero.style.setProperty('--hero-scroll', `${desktop.matches ? progress * 72 : 0}px`);
    if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > .02) schedule();
    else lastTime = 0;
  }
  function schedule() {
    if (enabled() && !frame) frame = requestAnimationFrame(render);
  }
  function resetDepth() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    targetX = targetY = currentX = currentY = 0;
    ['--hero-x', '--hero-y', '--hero-scroll'].forEach(name => hero.style.removeProperty(name));
  }
  function syncMotion() {
    hero.classList.toggle('is-motion-paused', !enabled());
    if (!enabled()) resetDepth();
    else {
      if (!pointer.matches) targetX = targetY = 0;
      schedule();
    }
  }
  function invalidate() { dirty = true; schedule(); }
  hero.addEventListener('pointermove', event => {
    if (!enabled() || !pointer.matches || !bounds || dirty) return;
    targetX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1)) * 7;
    targetY = Math.max(-1, Math.min(1, (event.clientY + window.scrollY - bounds.top) / bounds.height * 2 - 1)) * 6;
    schedule();
  });
  hero.addEventListener('pointerleave', () => { targetX = targetY = 0; schedule(); });
  window.addEventListener('resize', invalidate, { passive: true });
  window.addEventListener('scroll', schedule, { passive: true });
  new ResizeObserver(invalidate).observe(hero);
  document.fonts?.ready.then(invalidate);
  new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    syncMotion();
  }).observe(hero);
  reduced.addEventListener('change', syncMotion);
  pointer.addEventListener('change', syncMotion);
  desktop.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  syncMotion();
}
