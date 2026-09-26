export function initAnimations() {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!window.gsap || !window.ScrollTrigger || reduceMotion) {
    document.querySelectorAll(".process-dot span").forEach(dot => { dot.style.transform = "scale(1)"; });
    const processLine = document.querySelector(".process-line span");
    if (processLine) processLine.style.width = "100%";
    return;
  }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  const load = gsap.timeline({ defaults: { ease: "power3.out" } });
  load.from(".site-header", { opacity: 0, y: -20, duration: .7 })
    .from(".title-line > span", { yPercent: 110, duration: .9, stagger: .11 }, "-=.25")
    .from(".hero-copy, .hero .button-row", { opacity: 0, y: 20, duration: .65, stagger: .11 }, "-=.45");

  gsap.utils.toArray(".reveal-group").forEach(group => {
    gsap.from(group.children, { scrollTrigger: { trigger: group, start: "top 82%", once: true }, opacity: 0, y: 28, duration: .75, stagger: .1, ease: "power3.out" });
  });

  gsap.from(".service-feature", { scrollTrigger: { trigger: ".services-grid", start: "top 80%", once: true }, opacity: 0, y: 35, duration: .75, stagger: .09, ease: "power3.out" });
  gsap.from(".journey-step", { scrollTrigger: { trigger: ".journey", start: "top 75%", once: true }, opacity: 0, y: 28, duration: .6, stagger: .11, ease: "power3.out" });
  gsap.from(".reason", { scrollTrigger: { trigger: ".reasons", start: "top 75%", once: true }, opacity: 0, x: 24, duration: .7, stagger: .15, ease: "power3.out" });

  const process = gsap.timeline({ scrollTrigger: { trigger: ".process-timeline", start: "top 80%", once: true } });
  process.to(".process-line span", { width: "100%", duration: 1.2, ease: "power2.inOut" })
    .to(".process-dot span", { scale: 1, duration: .28, stagger: .14, ease: "back.out(2)" }, "<")
    .from(".process-step > p, .process-step h3", { opacity: 0, y: 12, duration: .45, stagger: .04 }, "-=.65");
}
