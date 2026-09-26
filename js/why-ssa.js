/** Hover, focus and tap share a single image-selection state. */
export function initWhySSA() {
  const section = document.querySelector('[data-why-ssa]');
  if (!section) return;
  const buttons = [...section.querySelectorAll('[data-why-state]')];
  const photos = [...section.querySelectorAll('[data-why-photo]')];
  const imageArea = section.querySelector('.why-image');
  const caption = imageArea.querySelector('figcaption');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let request = 0;
  let frame = 0;

  async function select(index) {
    const ticket = ++request;
    if (index === active) return;
    const incoming = photos[index];
    // Keep the current photograph visible until the new one is ready.
    incoming.loading = 'eager';
    try { await incoming.decode(); } catch { return; }
    if (ticket !== request) return;
    active = index;
    photos.forEach((photo, i) => {
      photo.classList.toggle('is-active', i === index);
      photo.setAttribute('aria-hidden', String(i !== index));
    });
    buttons.forEach((button, i) => {
      button.setAttribute('aria-pressed', String(i === index));
      button.closest('.reason').classList.toggle('is-active', i === index);
    });
    caption.textContent = incoming.dataset.caption;
  }

  buttons.forEach((button, index) => {
    button.closest('.reason').addEventListener('pointerenter', event => {
      if (!finePointer.matches || event.pointerType === 'touch') return;
      // Scrolling under a stationary pointer must not override keyboard focus.
      if (buttons.some(other => other !== button && other.matches(':focus-visible'))) return;
      select(index);
    });
    button.addEventListener('focus', () => select(index));
    button.addEventListener('click', () => select(index));
    button.addEventListener('keydown', event => {
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].focus();
    });
  });

  // Warm all three images shortly before the section enters the viewport.
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    photos.forEach(photo => { photo.loading = 'eager'; photo.decode().catch(() => {}); });
    observer.disconnect();
  }, { rootMargin: '500px' });
  observer.observe(section);

  function resetDepth() {
    cancelAnimationFrame(frame);
    imageArea.style.removeProperty('--why-x');
    imageArea.style.removeProperty('--why-y');
  }
  imageArea.addEventListener('pointermove', event => {
    if (!finePointer.matches || reducedMotion.matches) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const box = imageArea.getBoundingClientRect();
      imageArea.style.setProperty('--why-x', `${((event.clientX - box.left) / box.width - .5) * 10}px`);
      imageArea.style.setProperty('--why-y', `${((event.clientY - box.top) / box.height - .5) * 8}px`);
    });
  });
  imageArea.addEventListener('pointerleave', resetDepth);
  reducedMotion.addEventListener('change', resetDepth);
  finePointer.addEventListener('change', resetDepth);
}
