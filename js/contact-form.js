/** Validate locally, then confirm Web3Forms acceptance before resetting or opening the dialog. */
export function initContactForm() {
  const form = document.getElementById('inquiry-form');
  if (!form) return;
  // Match only real checkbox values: unknown URL values never become markup
  // or selectors. Native checked state also supplies the eventual form data.
  const requestedService = new URLSearchParams(window.location.search).get('service');
  if (requestedService) {
    const service = [...form.querySelectorAll('input[name="services"]')]
      .find(input => input.value === requestedService);
    if (service) service.checked = true;
  }
  const fields = ['name', 'email', 'message'].map(name => form.elements.namedItem(name));
  const status = document.getElementById('inquiry-status');
  const deliveryHelp = document.getElementById('inquiry-delivery-help');
  const submit = form.querySelector('button[type="submit"]');
  const submitLabel = submit.querySelector('[data-submit-label]');
  const confirmation = document.getElementById('inquiry-confirmation');
  const serviceNames = {
    'pos-solutions': 'POS Solutions', 'web-development': 'Web Development',
    'customer-support': 'Customer Support', 'digital-marketing': 'Digital Marketing',
    'ai-automation': 'AI & Automation'
  };
  const touched = new Set();
  let sending = false;

  confirmation.querySelector('[data-confirmation-close]').addEventListener('click', () => confirmation.close());
  confirmation.addEventListener('close', () => {
    document.body.classList.remove('inquiry-confirmation-open');
    submit.focus({ preventScroll: true });
  });

  function validate(field) {
    const value = field.value.trim();
    let message = '';
    if (!value) {
      message = { name: 'Please enter your full name.', email: 'Please enter your email address.', message: 'Please tell us what you have in mind.' }[field.name];
    } else if (field.name === 'email' && field.validity.typeMismatch) {
      message = 'Please enter a valid email address, such as name@example.com.';
    } else if (field.validity.tooLong) {
      message = `Please keep this field to ${field.maxLength} characters or fewer.`;
    }
    const error = document.getElementById(`${field.id}-error`);
    error.textContent = message;
    error.hidden = !message;
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
    return !message;
  }

  fields.forEach(field => {
    field.addEventListener('blur', () => { touched.add(field); validate(field); });
    field.addEventListener('input', () => {
      if (touched.has(field)) validate(field);
      status.textContent = '';
    });
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending) return;
    deliveryHelp.hidden = true;
    const invalid = fields.filter(field => {
      touched.add(field);
      return !validate(field);
    });
    if (invalid.length) {
      status.textContent = 'Please check the highlighted fields. Your inquiry has not been sent.';
      invalid[0].focus();
      return;
    }
    const data = new FormData(form);
    data.set('services', data.getAll('services').map(value => serviceNames[value]).filter(Boolean).join(', ') || 'Not specified');
    ['name', 'email', 'company', 'message'].forEach(name => data.set(name, String(data.get(name) || '').trim()));
    const controls = [...form.elements].map(control => ({ control, disabled: control.disabled }));
    controls.forEach(({ control }) => { control.disabled = true; });
    sending = true;
    form.setAttribute('aria-busy', 'true');
    submitLabel.textContent = 'Sending…';
    status.textContent = 'Sending your inquiry…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    let accepted = false;
    try {
      const response = await fetch(form.action, {
        method: 'POST', body: data, headers: { Accept: 'application/json' }, signal: controller.signal
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) throw new Error('Submission not accepted');
      accepted = true;
    } catch {
      status.textContent = 'We couldn’t confirm your message was sent. Please try again.';
      deliveryHelp.hidden = false;
    } finally {
      clearTimeout(timeout);
      controls.forEach(({ control, disabled }) => { control.disabled = disabled; });
      sending = false;
      form.removeAttribute('aria-busy');
      submitLabel.textContent = 'Send Inquiry';
    }
    if (!accepted) {
      status.focus();
      return;
    }
    form.reset();
    touched.clear();
    fields.forEach(field => {
      field.removeAttribute('aria-invalid');
      const error = document.getElementById(`${field.id}-error`);
      error.hidden = true;
      error.textContent = '';
    });
    status.textContent = 'Thank you. Your inquiry has been sent successfully.';
    // A native modal occupies the top layer, makes the background inert and
    // supplies focus containment and Escape dismissal without touching menu logic.
    if (typeof confirmation.showModal === 'function') {
      confirmation.showModal();
      document.body.classList.add('inquiry-confirmation-open');
    } else status.focus();
  });

  // Enable only after the preventing handler is installed. Without JS, the
  // disabled submit button prevents accidental navigation or posting form data.
  form.noValidate = true;
  submit.disabled = false;
}
