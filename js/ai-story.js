/** One native sticky stage and one event-driven RAF; no scroll smoothing delay. */
export function initAIStory() {
  const story = document.querySelector('.ai-story');
  if (!story || story.dataset.motionReady === 'true') return;
  story.dataset.motionReady = 'true';
  const panels = [...story.querySelectorAll('.ai-story-panel')];
  const image = story.querySelector('.ai-story-image img');
  const progressBar = story.querySelector('.ai-story-progress span');
  const desktop = matchMedia('(min-width: 1000px) and (min-height: 680px) and (prefers-reduced-motion: no-preference)');
  const clamp = value => Math.min(1, Math.max(0, value));
  const previous = panels.map(() => ({ offset: NaN, opacity: NaN }));
  let frame = 0;
  let visible = false;
  let dirty = true;
  let start = 0;
  let travel = 1;
  let rise = 0;
  let lastProgress = NaN;

  function render() {
    frame = 0;
    if (!desktop.matches) return;
    // Geometry is refreshed only after layout changes, never on routine scroll.
    if (dirty) {
      const viewport = window.innerHeight;
      const bounds = story.getBoundingClientRect();
      start = bounds.top + window.scrollY;
      travel = Math.max(1, bounds.height - viewport);
      rise = viewport * .85;
      dirty = false;
      lastProgress = NaN;
      previous.forEach(state => { state.offset = NaN; });
    }
    const progress = clamp((window.scrollY - start) / travel);
    if (progress === lastProgress) return;
    lastProgress = progress;
    const playhead = progress * 5.5;
    panels.forEach((panel, index) => {
      const local = playhead - index;
      const enter = clamp(local / .35);
      const exit = index === panels.length - 1 ? 0 : clamp((local - .72) / .38);
      const offset = (1 - enter - exit) * rise;
      const opacity = clamp(local / .2) * (1 - exit);
      const state = previous[index];
      if (offset !== state.offset) {
        panel.style.transform = `translate3d(0, calc(-50% + ${offset}px), 0)`;
        state.offset = offset;
      }
      if (opacity !== state.opacity) {
        panel.style.opacity = String(opacity);
        state.opacity = opacity;
      }
    });
    image.style.transform = `scale(${1 + progress * .045})`;
    progressBar.style.transform = `scaleX(${progress})`;
  }

  function schedule() {
    if (desktop.matches && (visible || dirty) && !frame) frame = requestAnimationFrame(render);
  }
  function invalidate() {
    dirty = true;
    schedule();
  }
  function configure() {
    cancelAnimationFrame(frame);
    frame = 0;
    story.classList.toggle('is-pinned', desktop.matches);
    story.classList.toggle('is-nearby', desktop.matches && visible);
    dirty = true;
    if (desktop.matches) schedule();
    else {
      panels.forEach(panel => {
        panel.style.removeProperty('transform');
        panel.style.removeProperty('opacity');
      });
      previous.forEach(state => { state.offset = NaN; state.opacity = NaN; });
      image.style.removeProperty('transform');
      progressBar.style.removeProperty('transform');
      lastProgress = NaN;
    }
  }

  const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    story.classList.toggle('is-nearby', visible && desktop.matches);
    // Commit the boundary state even when a large scroll skips past the stage.
    if (desktop.matches && !frame) frame = requestAnimationFrame(render);
  }, { rootMargin: '100px' });
  observer.observe(story);
  // Upstream content can move the story without a viewport resize (fonts/images).
  const layoutObserver = new ResizeObserver(invalidate);
  for (const section of document.querySelector('main').children) {
    layoutObserver.observe(section);
    if (section === story) break;
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', invalidate, { passive: true });
  window.addEventListener('pageshow', invalidate);
  window.addEventListener('load', invalidate, { once: true });
  document.fonts?.ready.then(invalidate);
  window.ScrollTrigger?.addEventListener('refresh', invalidate);
  desktop.addEventListener('change', configure);
  configure();
}
