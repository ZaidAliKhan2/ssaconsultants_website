import './components.js';
import { initNavigation } from './navigation.js';
import { initContactForm } from './contact-form.js';

function boot() {
  initNavigation();
  initContactForm();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
else boot();
