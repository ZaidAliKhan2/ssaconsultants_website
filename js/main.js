import "./components.js";
import { initNavigation } from "./navigation.js";
import { initHeroAtmosphere } from "./interactions.js";
import { initAnimations } from "./animations.js";
import { initAIStory } from "./ai-story.js";
import { initWhySSA } from "./why-ssa.js";

function boot() {
  initNavigation();
  initHeroAtmosphere();
  initAIStory();
  initWhySSA();
  if (window.lucide) window.lucide.createIcons({ attrs: { "stroke-width": 1.6 } });
  initAnimations();
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
else boot();
