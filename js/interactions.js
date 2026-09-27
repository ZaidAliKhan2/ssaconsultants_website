/** Native playback handles looping; only motion preference needs scripting. */
export function initHeroAtmosphere() {
  const video = document.querySelector('.hero-video');
  if (!video || video.dataset.motionReady) return;
  video.dataset.motionReady = 'true';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  function syncMotion() {
    video.autoplay = !reduced.matches;
    if (reduced.matches) video.pause();
    else {
      video.muted = true;
      // Autoplay may be blocked; the hero keeps its dark fallback background.
      video.play().catch(() => {});
    }
  }

  reduced.addEventListener('change', syncMotion);
  syncMotion();
}
