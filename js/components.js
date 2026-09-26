const currentPage = document.body.dataset.page || "home";
const currentPageLabel = { home: "Home", services: "Services", about: "About", why: "Why SSA", contact: "Contact" }[currentPage];
const homeLink = anchor => currentPage === "home" ? anchor : `index.html${anchor}`;
const navItems = [
  ["Home", homeLink("#home")], ["Services", "services.html"],
  ["About", "about.html"], ["Why SSA", "why-ssa.html"], ["Contact", "contact.html"]
];
const serviceItems = [
  ["Sales &amp; POS Solutions", "sales-pos"], ["Web Development", "web-development"],
  ["Customer Experience", "customer-experience"], ["Digital Marketing", "digital-marketing"],
  ["AI &amp; Automation", "ai-automation"]
];

const brand = `
  <a class="brand" href="${homeLink("#home")}" aria-label="SSA Consulting Inc. home">
    <img class="brand-logo" src="assets/images/logo-white.png" alt="SSA Consultants Inc." width="3600" height="3600" decoding="async">
  </a>`;

export class SiteHeader extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendered === "true") return;
    this.dataset.rendered = "true";
    const links = navItems.map(([label, href]) => `<a href="${href}"${label === currentPageLabel ? ' aria-current="page"' : ""}>${label}</a>`).join("");
    this.innerHTML = `
      <header class="site-header">
        <nav class="nav container" aria-label="Main navigation">
          ${brand}
          <div class="nav-links">${links}</div>
          <a class="button button-primary button-small nav-cta" href="contact.html#inquiry">Let's Talk <span aria-hidden="true">↗</span></a>
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu"><span></span><span></span></button>
        </nav>
      </header>
      <div class="mobile-panel" id="mobile-menu" aria-hidden="true">${links}<a class="button button-primary" href="contact.html#inquiry">Let's Talk <span aria-hidden="true">↗</span></a></div>`;
  }
}

export class SiteFooter extends HTMLElement {
  connectedCallback() {
    if (this.dataset.rendered === "true") return;
    this.dataset.rendered = "true";
    this.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-top">
          <div class="footer-brand">${brand}<p>Business growth,<br>powered by technology.</p></div>
          <div class="footer-columns">
            <div class="footer-column"><h3>Company</h3><a href="${homeLink("#home")}">Home</a><a href="about.html">About</a><a href="why-ssa.html">Why SSA</a><a href="contact.html">Contact</a></div>
            <div class="footer-column"><h3>Services</h3>${serviceItems.map(([label, id]) => `<a href="services.html#${id}">${label}</a>`).join("")}</div>
            <div class="footer-column" id="footer-contact">
              <h3>Contact</h3>
              <div class="footer-contact-item">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
                <a href="mailto:info@ssaconsultantinc.com">info@ssaconsultantinc.com</a>
              </div>
              <div class="footer-contact-item">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.79a2 2 0 0 1-.45 2.11L8.09 9.89a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.83.58 2.79.7A2 2 0 0 1 22 16.92z"/></svg>
                <a href="tel:+12893051049">289-305-1049</a>
              </div>
              <div class="footer-contact-item">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.5"/></svg>
                <span>Mississauga, Ontario</span>
              </div>
            </div>
          </div>
        </div>
        <div class="container footer-bottom"><div class="footer-copyright"><span>© 2026 SSA Consulting Inc.</span><span class="footer-credit"><span class="footer-credit-separator" aria-hidden="true">·</span>Powered by <a class="footer-agency" href="https://www.auroveon.com" target="_blank" rel="noopener noreferrer">Auroveon</a></span></div><div class="footer-legal"><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a></div></div>
      </footer>`;
  }
}

if (!customElements.get("site-header")) customElements.define("site-header", SiteHeader);
if (!customElements.get("site-footer")) customElements.define("site-footer", SiteFooter);
