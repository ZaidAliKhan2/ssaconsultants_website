/** Desktop image selection; smaller screens retain complete image/text pairs. */
export function initAboutPrinciples() {
  const section = document.querySelector('[data-about-principles]');
  if (!section) return;
  const entries = [...section.querySelectorAll('.about-principle')].map(item => ({
    item,
    button: item.querySelector('[data-principle-button]'),
    label: item.querySelector('[data-principle-label]'),
    photo: item.querySelector('.about-principle-photo'),
    image: item.querySelector('img')
  }));
  const desktop = matchMedia('(min-width: 901px)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let active = 0;
  let request = 0;

  function render() {
    section.classList.toggle('is-interactive', desktop.matches);
    entries.forEach((entry, index) => {
      const selected = index === active;
      entry.item.classList.toggle('is-active', selected);
      entry.button.hidden = !desktop.matches;
      entry.label.hidden = desktop.matches;
      entry.button.setAttribute('aria-pressed', String(selected));
      entry.photo.setAttribute('aria-hidden', String(desktop.matches && !selected));
    });
  }

  async function select(index) {
    const ticket = ++request;
    if (!desktop.matches || index === active) return;
    const image = entries[index].image;
    image.loading = 'eager';
    try { await image.decode(); } catch { return; }
    // Fast hover/focus changes cannot let a stale decode overwrite the latest choice.
    if (ticket !== request || !desktop.matches) return;
    active = index;
    render();
  }

  entries.forEach((entry, index) => {
    entry.item.querySelector('.about-principle-copy').addEventListener('pointerenter', event => {
      if (!finePointer.matches || event.pointerType === 'touch') return;
      if (entries.some(other => other !== entry && other.button.matches(':focus-visible'))) return;
      select(index);
    });
    entry.button.addEventListener('focus', () => select(index));
    entry.button.addEventListener('click', () => select(index));
    entry.button.addEventListener('keydown', event => {
      if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? entries.length - 1
        : (index + (event.key === 'ArrowDown' ? 1 : -1) + entries.length) % entries.length;
      entries[next].button.focus();
    });
  });
  desktop.addEventListener('change', () => { ++request; render(); });
  render();

  // Decode shortly before arrival so the first interaction can crossfade promptly.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(records => {
      if (!records.some(record => record.isIntersecting)) return;
      entries.forEach(({ image }) => { image.loading = 'eager'; image.decode().catch(() => {}); });
      observer.disconnect();
    }, { rootMargin: '400px' });
    observer.observe(section);
  }
}
