import './components.js';
import { initNavigation } from './navigation.js';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavigation, { once: true });
} else {
  initNavigation();
}
