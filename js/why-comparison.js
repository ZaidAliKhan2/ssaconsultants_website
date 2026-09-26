/** Native buttons support touch, mouse and keyboard; both views exist without JS. */
export function initWhyComparison() {
  const section = document.querySelector('[data-why-comparison]');
  if (!section) return;
  const controls = section.querySelector('.why-comparison-controls');
  const buttons = [...section.querySelectorAll('[data-comparison-choice]')];
  const views = [...section.querySelectorAll('[data-comparison-view]')];
  const status = section.querySelector('.why-comparison-status');
  let current = null;

  function select(value, announce = true) {
    if (value === current || !views.some(view => view.dataset.comparisonView === value)) return;
    current = value;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.comparisonChoice === value)));
    views.forEach(view => {
      const active = view.dataset.comparisonView === value;
      view.hidden = !active;
      view.classList.toggle('is-active', active);
    });
    if (announce) status.textContent = value === 'connected'
      ? 'SSA connected approach: shared context, clearer coordination and aligned execution.'
      : 'Fragmented approach: separate providers, repeated context and more handoffs to coordinate.';
    // Keep optional reveal trigger positions accurate if the selected copy changes height.
    window.ScrollTrigger?.refresh();
  }

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(button.dataset.comparisonChoice));
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1
        : (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].focus();
      select(buttons[next].dataset.comparisonChoice);
    });
  });
  section.classList.add('is-enhanced');
  controls.hidden = false;
  select('fragmented', false);
}
