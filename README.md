# SSA Consulting Inc. website

A static, framework-free website built with semantic HTML, modular CSS and JavaScript ES modules.

## Run locally

Because the page uses JavaScript modules, serve the folder through a local web server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

Run `npm test` for lightweight syntax, import and local asset checks only. No browser is launched. Visual review is manual.

## Structure

- `index.html` — semantic page sections and content
- `services.html` — five editorial service sections, service index, FAQ and CTA
- `about.html` — editorial company introduction, principles, capability links and CTA
- `why-ssa.html` — connected-support argument, interactive comparison, reasons and outcomes
- `contact.html` — company contact details, Web3Forms inquiry form and next steps
- `privacy.html` and `terms.html` — legal content, linked from the shared footer
- `css/legal.css` and `js/legal.js` — legal page styling and shared navigation initialization
- `css/` — global tokens, reusable components, sections and responsive rules
- `js/components.js` — reusable site header and footer
- `js/navigation.js` — sticky header and accessible mobile menu
- `js/services.js` and `css/services.css` — service index highlighting, responsive editorial layouts and sticky AI use cases
- `js/about.js`, `js/about-principles.js` and `css/about.css` — About page layouts, principle image selection and restrained GSAP motion
- `js/why-page.js`, `js/why-comparison.js` and `css/why-page.css` — standalone Why SSA page motion and approach comparison
- `js/contact.js`, `js/contact-form.js` and `css/contact.css` — Contact page, service selections and inline validation
- `js/interactions.js` — subtle hero background depth and motion controls
- `js/animations.js` — GSAP entrance and scroll reveals
- `js/ai-story.js` and `css/ai-story.css` — sticky photographic AI story and scroll-scrubbed panels
- `assets/` — favicon, social preview, and locally served responsive WebP photographs
- `assets/images/SOURCES.md` — photography source links and license reference

## Before launch

Privacy and Terms are available through the shared footer. Confirm governing-law wording with the client or legal advisor before launch; a developer-only comment in `terms.html` marks the insertion point. Verify production delivery through Web3Forms and the destination inbox before launch.

## Editorial imagery and AI story

The hero uses a lightweight CSS/SVG atmosphere. Section photographs load lazily with local responsive WebP sources and intrinsic dimensions. Photography is illustrative, not a claim that the subjects are SSA employees or customers.

At widths of at least 1000px and heights of at least 680px, with reduced motion off, the AI section occupies 420vh. Its 100vh stage sticks while five foreground panels rise through the viewport. Native scroll position drives transforms and opacity through one requestAnimationFrame per scroll frame; no scrolling is intercepted. The final panel holds before normal scrolling resumes. A skip link leads to How We Work.

Smaller screens, reduced-motion preferences, or unavailable JavaScript show the complete story in normal flow. Media-query changes clear the animated styles. GSAP is used for the existing entrance/reveal personality, but the AI story does not depend on its CDN.

## Why SSA interaction

`js/why-ssa.js` and `css/why-ssa.css` control the three editorial image states. One Partner is selected initially. Hover, keyboard focus, arrow keys and taps select a corresponding photograph; the last selection remains active. Descriptions remain readable for every state, including on touch devices. Images crossfade over 650ms after decoding, and rapid selections discard stale decode requests. Reduced motion disables the transitions and pointer crop movement. The AI pinned-story logic is unchanged.

## Official branding and scroll performance

Header and footer use the transparent white `assets/images/logo-white.png` directly on their dark backgrounds, without a box or CSS recoloring. The dark `assets/images/logo.png` remains available for light backgrounds and as the source for the SSA-only favicon.

`scripts/create-favicon.py` derives transparent 32px, 48px and 180px icons from the central SSA mark only. The crop in the 3600px source is `(660, 1130, 3020, 2010)`, excluding the surrounding circle and subtitle, then trimmed to its alpha bounds. Pillow is needed only to regenerate these committed assets.

The AI story retains its native sticky stage and original sequencing. Its single event-driven RAF reads cached section geometry on ordinary scroll; geometry is invalidated on resize, upstream section resizing, font readiness, load/pageshow and existing ScrollTrigger refreshes. Repeated initialization is guarded, unchanged style writes are skipped, and compositor hints apply only near the visible pinned section. Reduced motion and smaller-screen fallbacks still clear animated styles. No browser or visual performance profiling was performed.

## Hero atmosphere

`css/hero.css` owns the centered hero composition, static fine grid, slow light fields and curved SVG paths. The curved form, arc lines and light field loop independently over 12, 9 and 7 seconds, with one small signal following an arc over 10 seconds. Negative animation delays start the scene already in motion. `js/interactions.js` uses one scheduled RAF for eased desktop pointer depth and scroll-exit offsets, with cached geometry. Off-screen detection and tab visibility pause the atmosphere. Mobile uses static linework; reduced motion disables all background movement. The heading, supporting paragraph and CTA destinations are retained.

## Services page

Open `services.html` through the same local server. Its service anchors are `#pos-solutions`, `#web-development`, `#customer-support`, `#digital-marketing` and `#ai-automation`. Homepage service links and shared footer links point to these anchors. The shared header marks Services as the current page, links About to `about.html` and Why SSA to `why-ssa.html`, and sends Home back to the homepage.

The service index sits beneath the fixed header. CSS anchor offsets account for both navigation bars; mobile keeps the index on one horizontally scrollable line. Scroll highlighting uses cached section measurements and a scheduled animation frame. The AI introduction sticks on sufficiently large/tall viewports while the five use cases scroll normally; reduced motion and smaller screens use normal document flow. GSAP reveals are optional, with readable content if the library is unavailable.

The new page reuses existing photography plus a locally optimized retail-payment image (see `assets/images/SOURCES.md`). Contact CTAs lead to `contact.html#inquiry`; service-specific CTAs include the matching `service` query parameter. Contact details are shared consistently with the Contact page.

`npm test` performs code-only checks on all HTML pages, including rendered shared-component links, current navigation states, anchor targets, image paths and module syntax. It does not launch a browser.

## About page

Open `about.html` through the same local server. The page reuses the shared navbar, footer, buttons and CTA. Its dark hero blends into a photograph that reaches the page edge; Who We Are pairs a photograph with concise copy. A wide collaboration image leads into How We Think, followed by an image-led soft-blue capability section and the existing dark CTA. There are no team profiles, invented history, statistics or decorative principle numbers.

Seven fresh Pexels photographs are served locally as responsive WebP assets, distinct from Home and Services. Source and license references are in `assets/images/SOURCES.md`. The hero loads eagerly; below-fold photographs load lazily.

On screens wider than 900px, How We Think switches between three photographs on hover, focus or activation. Native buttons support Tab, Enter and Space, plus Up/Down and Home/End navigation. All descriptions remain visible. Incoming images decode before a 600ms crossfade, with stale requests discarded. At 900px and below, every principle appears with its own photograph; no hover is required. The same complete layout is available without JavaScript.

Hero motion is limited to an entrance mask and gentle photo hover scaling. The wide image has a small scroll-linked crop shift above 620px. No sections are pinned. Reduced-motion preferences disable reveals, image movement and crossfade transitions, and changes to the preference revert GSAP styles. Visual review remains manual; no browser automation was used.

## Why SSA page

Open `why-ssa.html` through the same local server. The standalone page uses six content sections: a dark typographic hero, a fragmentation/connection visual, three editorial reasons, an interactive comparison, four outcome rows and the shared CTA. It uses local HTML/CSS/SVG graphics without stock photography or additional libraries. The homepage's existing Why SSA section and its image interaction remain independent.

The comparison uses two native buttons for mouse, touch, Enter and Space activation, with Left/Right and Home/End shortcuts. Only the selected view is exposed after enhancement, and a polite status message announces changes. Without JavaScript, both complete approaches are visible. Reduced motion removes the transitions and connecting-line motion while preserving all content and controls.

GSAP optionally resolves the fragmentation graphic over a short scrolling interval and reveals editorial content. Nothing is pinned. Shared header/footer links route to the new page, and Why SSA uses the existing active navigation state. `npm test` checks all four pages without launching a browser; visual QA remains manual.

## Contact page

Open `contact.html` through the same local server. The page contains a compact dark hero, contact details alongside an integrated inquiry form, and a small What Happens Next section. Shared Contact navigation links open `contact.html`; header Let's Talk and general inquiry CTAs open `contact.html#inquiry`. Contact receives the existing active navigation state. Approved page content remains unchanged.

Confirmed contact details: **info@ssaconsultantinc.com**, **289-305-1049**, **Mississauga, Ontario**. Email and phone are functional links on the Contact page and shared footer.

The form requires name, a valid email and a nonblank message. Company and services remain optional. `js/contact-form.js` sends a POST to `https://api.web3forms.com/submit` using the configured hidden access key, subject and sender name. Selected service values become readable names in one `services` field. A hidden `botcheck` checkbox supplies the provider's honeypot field. Integration follows [Web3Forms' JavaScript documentation](https://docs.web3forms.com/how-to-guides/html-and-javascript).

While sending, controls are temporarily disabled and duplicate submissions are ignored. HTTP success **and** JSON `success: true` are required before resetting the form and showing the native confirmation dialog. The dialog supports Escape, a Done button, background inertness and focus restoration. Failures, unreadable responses and the 30-second timeout preserve entries and show a direct-email fallback. No raw API errors are displayed. Without JavaScript, visitors can use the email link; the submit button stays disabled to avoid redirecting to a provider page.

Submission handling is checked with mocked responses only, without sending test inquiries or verifying mailbox delivery. Live testing remains manual.

The page uses native controls and static brand graphics with no additional animation library. `npm test` checks all five pages without opening a browser. Visual QA remains manual.

Contact routing uses `contact.html?service=<value>#inquiry` for service inquiries. The five accepted values are `pos-solutions`, `web-development`, `customer-support`, `digital-marketing` and `ai-automation`. The form matches the query value against native service checkboxes and sets `checked`, so the choice is part of form data and remains freely editable. Unknown values are ignored. The inquiry section uses the existing 100px anchor offset for the fixed header. Informational service links still lead to Services sections; no contact-form modal is used; the only dialog confirms an accepted submission.
