export function initNavigation() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const panel = document.querySelector(".mobile-panel");
  if (!header || !toggle || !panel) return;
  if (header.dataset.navigationReady === "true") return;
  header.dataset.navigationReady = "true";

  let lockedScrollY = 0;
  const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 24);
  const closeMenu = () => {
    if (toggle.getAttribute("aria-expanded") !== "true") return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
    document.body.style.removeProperty("top");
    const scrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, lockedScrollY);
    document.documentElement.style.scrollBehavior = scrollBehavior;
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") !== "true";
    if (!open) {
      closeMenu();
      return;
    }
    lockedScrollY = window.scrollY;
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
  });
  panel.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key !== "Escape" || toggle.getAttribute("aria-expanded") !== "true") return;
    closeMenu();
    toggle.focus();
  });
  matchMedia("(max-width: 900px)").addEventListener("change", event => {
    if (!event.matches) closeMenu();
  });
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();
}
