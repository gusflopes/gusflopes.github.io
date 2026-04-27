---
name: gusflopes.dev
tagline: Editorial-tech identity bridging business strategy and advanced engineering
modes:
  - dark   # default — home, radar, dark articles
  - light  # editorial — insights, light long-form articles

colors:
  brand:
    primary:
      value: "#F97316"
      role: "Signature accent — buttons, links, focus rings, glows, brand bar"
    primary-hover:
      value: "#EA580C"
      role: "Hover state for primary surfaces"
    primary-soft:
      value: "#FB923C"
      role: "Iconography on dark surfaces, hover-lifted accent text"
    primary-bright:
      value: "#FDBA74"
      role: "Hover-lifted icon and link tint, high-contrast accent on dark"
    primary-deep:
      value: "#9A3412"
      role: "Glow tint and stamped 'shadow-orange-900/50' colored shadow"
    accent-amber:
      value: "#D97706"
      role: "Right stop of the headline gradient (orange-400 → amber-600)"
    accent-cream-100:
      value: "#FFEDD5"
      role: "Soft text on dark hero ('orange-100')"
    accent-cream-200:
      value: "#FED7AA"
      role: "Selection background in light editorial mode"
    accent-cream-900:
      value: "#7C2D12"
      role: "Selection text in light editorial mode"

  dark:
    bg-base:
      value: "#020617"
      role: "Page background — deep slate-950, near-black with cool blue cast"
    bg-elevated:
      value: "#0F172A"
      role: "Card body, alternate sections (slate-900)"
    bg-muted:
      value: "#1E293B"
      role: "Inputs, code blocks (slate-800)"
    border-subtle:
      value: "rgba(255, 255, 255, 0.05)"
      role: "Sticky header divider when scrolled"
    border-default:
      value: "#1E293B"
      role: "Section dividers, footer border (slate-800)"
    border-strong:
      value: "#334155"
      role: "Input outlines, neutral card outlines (slate-700)"
    text-primary:
      value: "#FFFFFF"
      role: "Headlines and key UI labels"
    text-body:
      value: "#E2E8F0"
      role: "Body copy on dark (slate-200)"
    text-secondary:
      value: "#CBD5E1"
      role: "Supporting paragraph text (slate-300)"
    text-muted:
      value: "#94A3B8"
      role: "Meta, captions, footer links (slate-400)"
    text-faint:
      value: "#64748B"
      role: "Timestamps, copyright, disabled labels (slate-500)"
    overlay-hero-side:
      value: "linear-gradient(to right, rgba(15,23,42,0.9), rgba(15,23,42,0.6), transparent)"
      role: "Right-fading scrim across hero photo to hold left-aligned text"
    overlay-hero-bottom:
      value: "linear-gradient(to top, #020617, transparent 50%)"
      role: "Lower fade that anchors the hero into the page"
    overlay-section:
      value: "rgba(2, 6, 23, 0.8)"
      role: "Parallax background dimmer with backdrop-blur-sm"

  light:
    bg-base:
      value: "#F5F5F0"
      role: "Warm bone/cream — used on Insights and light long-form articles"
    bg-paper:
      value: "#FFFFFF"
      role: "Quote cards, inline callouts, raised tiles"
    bg-paper-translucent:
      value: "rgba(255, 255, 255, 0.8)"
      role: "Sticky pill filter bar (with backdrop-blur-lg)"
    border-hairline:
      value: "rgba(255, 255, 255, 0.2)"
      role: "Crystalline edge on translucent pill bar"
    border-soft:
      value: "rgba(226, 232, 240, 0.6)"
      role: "Sticky header divider on cream"
    text-primary:
      value: "#0F172A"
      role: "Editorial headlines (slate-900)"
    text-body:
      value: "#334155"
      role: "Long-form body (slate-700)"
    text-secondary:
      value: "#475569"
      role: "Lead paragraphs, deck (slate-600)"
    text-muted:
      value: "#64748B"
      role: "Bylines, meta (slate-500)"
    text-faint:
      value: "#94A3B8"
      role: "Placeholder, disabled (slate-400)"

  ambient:
    glow-orange-soft:
      value: "rgba(249, 115, 22, 0.10)"
      role: "Hero halo blob (200–500px, blur ≥100px) behind page titles on dark"
    glow-orange-medium:
      value: "rgba(249, 115, 22, 0.30)"
      role: "Card edge glow at rest (shadow-[0_0_15px_-3px_…])"
    glow-orange-strong:
      value: "rgba(249, 115, 22, 0.50)"
      role: "Card edge glow on hover (shadow-[0_0_25px_-5px_…])"
    glow-cream-200:
      value: "rgba(254, 215, 170, 0.30)"
      role: "Top-right organic blob in light editorial backdrop"
    glow-cream-100:
      value: "rgba(255, 237, 213, 0.40)"
      role: "Bottom-right organic blob in light editorial backdrop"
    glow-slate-300:
      value: "rgba(203, 213, 225, 0.40)"
      role: "Mid-left organic blob in light editorial backdrop"
    glow-blue-secondary:
      value: "rgba(59, 130, 246, 0.05)"
      role: "Cool counterweight blob on dark article backgrounds"

  semantic:
    focus-ring:
      value: "#F97316"
      role: "All focus-visible rings — orange, never blue"
    selection-dark:
      value: "rgba(249, 115, 22, 0.30)"
      role: "Text selection on dark (selection:bg-orange-500/30)"
    selection-light-bg:
      value: "#FED7AA"
      role: "Text selection background on cream (orange-200)"
    selection-light-fg:
      value: "#7C2D12"
      role: "Text selection ink on cream (orange-900)"

typography:
  families:
    serif:
      value: "'Cormorant Garamond', serif"
      role: "All h1/h2/h3, blockquotes, editorial display — slow, literary, slightly italicizable"
      weights: [300, 400, 500, 600, 700]
    sans:
      value: "'Plus Jakarta Sans', sans-serif"
      role: "Body, UI labels, navigation, h4/h5/h6 — humanist geometric, modern"
      weights: [300, 400, 500, 600, 700]
    mono:
      value: "'JetBrains Mono', monospace"
      role: "Metadata strips on cards (date, duration), code, tags"
      weights: [400, 500]

  base-rules:
    serif-default-weight: 500   # h1/h2/h3 inherit medium from base layer — measured, editorial
    sans-default-weight: 400
    headline-bold-opt-in: 700   # only when font-bold is added explicitly (landing display, section headers)
    h4-h5-h6-family: sans       # never serif

  scale:
    display-xl:
      font-size: "4.5rem"
      line-height: "1.05"
      letter-spacing: "-0.025em"
      family: serif
      weight: 700
      role: "Hero headline at lg+ (text-7xl, font-bold) — landing only"
    display-l:
      font-size: "3.75rem"
      line-height: "1.05"
      letter-spacing: "-0.025em"
      family: serif
      weight: 700
      role: "Hero at md, page titles at lg (text-6xl, font-bold)"
    display-l-editorial:
      font-size: "3.75rem"
      line-height: "1.05"
      family: serif
      weight: 500
      role: "Article headline (radar/article + insights/article) — measured, italicizable; weight 500 inherited from base layer (no font-bold)"
    display-m:
      font-size: "3rem"
      line-height: "1.1"
      letter-spacing: "-0.015em"
      family: serif
      weight: 700
      role: "Section heading at md+ (text-5xl, font-bold)"
    display-s:
      font-size: "2.25rem"
      line-height: "1.15"
      family: serif
      weight: 700
      role: "Page header on mobile (text-4xl, font-bold)"
    h2:
      font-size: "1.875rem"
      line-height: "1.2"
      family: serif
      weight: 700
      role: "Section heading mobile (text-3xl, font-bold)"
    h2-editorial:
      font-size: "1.5rem"
      line-height: "1.3"
      family: serif
      weight: 500
      role: "Article in-text H2 (text-2xl, tracking-tight, no font-bold)"
    h3:
      font-size: "1.5rem"
      line-height: "1.25"
      family: serif
      weight: 700
      role: "Card-rail title with orange left border (text-2xl, font-bold)"
    h4:
      font-size: "1.25rem"
      line-height: "1.3"
      family: serif
      weight: 700
      role: "Theme/feature card title (text-xl, font-bold)"
    lead-l:
      font-size: "1.5rem"
      line-height: "1.5"
      family: sans
      weight: 500
      role: "Hero kicker / deck on dark (md:text-2xl)"
    lead-m:
      font-size: "1.25rem"
      line-height: "1.6"
      family: sans
      weight: 300
      role: "Article lead paragraph (text-xl, font-light)"
    body-l:
      font-size: "1.125rem"
      line-height: "1.7"
      family: sans
      weight: 400
      role: "Hero supporting copy, page intros (text-lg)"
    body:
      font-size: "1rem"
      line-height: "1.65"
      family: sans
      weight: 400
      role: "Default paragraph (text-base)"
    body-s:
      font-size: "0.875rem"
      line-height: "1.5"
      family: sans
      weight: 400
      role: "Footer columns, nav links (text-sm)"
    caption:
      font-size: "0.75rem"
      line-height: "1.4"
      family: sans
      weight: 700
      letter-spacing: "0.15em"
      transform: "uppercase"
      role: "Eyebrow labels above titles, 'Saiba mais' CTAs"
    micro:
      font-size: "0.625rem"
      line-height: "1.3"
      family: sans
      weight: 700
      letter-spacing: "0.18em"
      transform: "uppercase"
      role: "Badge text on cards (text-[10px])"
    meta:
      font-size: "0.75rem"
      line-height: "1.3"
      family: mono
      weight: 400
      role: "Date · duration strip on radar cards"

spacing:
  unit: "0.25rem"  # 4px base
  scale:
    "1": "0.25rem"
    "2": "0.5rem"
    "3": "0.75rem"
    "4": "1rem"
    "6": "1.5rem"   # default gutter
    "8": "2rem"     # card padding
    "12": "3rem"
    "16": "4rem"    # section header bottom margin
    "20": "5rem"    # section vertical padding (light)
    "24": "6rem"    # section vertical padding (dark, py-24)
    "32": "8rem"    # article bottom padding

  layout:
    page-gutter: "1.5rem"            # px-6
    container-max: "80rem"           # max-w-7xl — landing, radar, footer
    article-max: "56rem"             # max-w-4xl — long-form reads
    field-max: "32rem"               # max-w-lg — newsletter row
    column-gap-cards: "2rem"         # gap-8
    column-gap-grid-tight: "1.5rem"  # gap-6
    section-padding-y: "6rem"        # py-24
    nav-padding-y: "1.5rem"          # py-6

radii:
  none: "0"
  sm: "0.125rem"
  md: "0.375rem"     # buttons, inputs
  lg: "0.5rem"
  xl: "0.75rem"      # cards, sticky filter bars
  "2xl": "1rem"
  full: "9999px"     # pills, avatars, icon wells, play button
  usage:
    button: md
    input: md
    card: xl
    image-frame: xl
    pill-filter: full
    badge: full
    blockquote: "right-only — rounded-r-lg"

shadows:
  none: "none"
  sm:
    value: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
    role: "Quote cards on cream"
  md:
    value: "0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -2px rgba(0, 0, 0, 0.10)"
  lg:
    value: "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)"
    role: "Primary CTA, badge, drop-shadows on hero text"
  xl:
    value: "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)"
  "2xl":
    value: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
    role: "Featured article hero image"

  signature:
    glow-rest:
      value: "0 0 15px -3px rgba(249, 115, 22, 0.30)"
      role: "Idle glow on bordered theme/service cards"
    glow-hover:
      value: "0 0 25px -5px rgba(249, 115, 22, 0.50)"
      role: "Lifted hover state on bordered cards"
    glow-soft:
      value: "0 0 10px -3px rgba(249, 115, 22, 0.10)"
      role: "Quieter resting glow on insight rail cards"
    glow-tinted:
      value: "0 10px 15px -3px rgba(154, 52, 18, 0.50)"
      role: "Stamped 'shadow-orange-900/50' under play button & badges"
    badge-pop:
      value: "0 10px 15px -3px rgba(154, 52, 18, 0.50)"
      role: "Category chip on radar card top-left"

  drop-shadows:
    text-lg: "drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04))"
    text-md: "drop-shadow(0 4px 3px rgba(0, 0, 0, 0.07))"

elevation:
  z-bg: 0
  z-overlay: 1
  z-content: 10
  z-sticky-bar: 40
  z-header: 50
  z-noise: 50
  blur:
    sm: "4px"     # backdrop-blur-sm — overlays
    md: "12px"    # backdrop-blur-md — sticky header, cards (most common)
    lg: "16px"    # backdrop-blur-lg — light-mode pill bar
    blob-soft: "80px"
    blob-medium: "100px"
    blob-strong: "120px"

motion:
  durations:
    instant: "150ms"
    fast: "200ms"
    base: "300ms"
    medium: "500ms"
    slow: "700ms"
    image-zoom: "700ms"
    blob-pulse: "10000ms"
  easings:
    standard: "cubic-bezier(0.4, 0, 0.2, 1)"   # default Tailwind ease
    in: "cubic-bezier(0.4, 0, 1, 1)"
    out: "cubic-bezier(0, 0, 0.2, 1)"
    in-out: "cubic-bezier(0.4, 0, 0.2, 1)"
    linear: "linear"
  transitions:
    color: "color 200ms cubic-bezier(0.4, 0, 0.2, 1)"
    transform: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)"
    all-card: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)"
    deep-card: "all 500ms cubic-bezier(0.4, 0, 0.2, 1)"
    image-reveal: "transform 700ms cubic-bezier(0, 0, 0.2, 1)"
  signature-gestures:
    card-lift:
      transform: "translateY(-4px)"
      shadow: "glow-hover"
      duration: "300ms"
    card-scale-in-place:
      transform: "scale(1.02)"
      duration: "500ms"
      role: "Themes grid — assertive but anchored"
    cta-hover:
      transform: "scale(1.05)"
      duration: "300ms"
      role: "Primary newsletter button"
    image-zoom-in:
      transform: "scale(1.10)"
      duration: "700ms"
    arrow-nudge:
      gap-delta: "+0.25rem"
      duration: "300ms"
      role: "Group-hover gap on 'Ler Mais → ArrowRight'"
    parallax-fixed:
      background-attachment: "fixed"
      role: "Hero and Themes section keep BG glued while content scrolls"
    blob-breathe:
      animation: "pulse"
      duration: "10000ms"
      iteration: "infinite"

borders:
  width:
    hairline: "1px"
    standard: "1px"
    emphatic: "2px"   # bordered theme/service cards always 2px
    rule: "4px"       # left rail before section subtitles, blockquote
  default-style: "solid"
  patterns:
    card-bordered: "2px solid rgba(249, 115, 22, 0.80)"
    card-bordered-hover: "2px solid #FB923C"
    card-soft: "1px solid #1E293B"
    section-divider: "1px solid #1E293B"
    rail-accent: "4px solid #F97316"
    blockquote-accent: "4px solid #F97316"

surfaces:
  card-glass-dark:
    background: "rgba(15, 23, 42, 0.80)"
    backdrop-blur: "12px"
    border: "card-bordered"
    radius: xl
    padding: "2rem"
    shadow: "glow-rest"
    hover:
      background: "rgba(15, 23, 42, 0.90)"
      border: "card-bordered-hover"
      shadow: "glow-hover"
      transform: "card-scale-in-place"
  card-radar:
    background: "rgba(15, 23, 42, 0.80)"
    backdrop-blur: "12px"
    border: "1px solid #1E293B"
    radius: xl
    hover:
      border: "1px solid rgba(249, 115, 22, 0.50)"
      transform: "translateY(-8px)"
  card-paper-light:
    background: "#FFFFFF"
    border: "1px solid rgba(226, 232, 240, 0.50)"
    radius: xl
    shadow: sm
  pill-filter-light:
    background: "rgba(255, 255, 255, 0.80)"
    backdrop-blur: "16px"
    border: "1px solid rgba(255, 255, 255, 0.20)"
    radius: full
    shadow: sm
  header-scrolled-dark:
    background: "rgba(2, 6, 23, 0.80)"
    backdrop-blur: "12px"
    border-bottom: "1px solid rgba(255, 255, 255, 0.05)"

textures:
  noise-overlay:
    technique: "inline SVG fractal noise (feTurbulence baseFrequency 0.65, 3 octaves)"
    opacity: 0.03
    blend-mode: "overlay"
    role: "Light-mode editorial pages — subtle paper grain over the cream field"
  parallax-painting:
    asset: "painterly oil-textured illustration — warm cathedral/architectural silhouette over deep navy ground, lit by burnt-orange highlights and brushy bokeh"
    attachment: "fixed"
    role: "Hero and Themes — long-take cinematic feel under content; gives the dark mode its 'studio at dusk' warmth"
  organic-blobs:
    technique: "absolute round divs, blur 80–120px, mix-blend-multiply (light) or no blend (dark)"
    role: "Polimórfia — rooms feel atmospheric, not flat"

iconography:
  library: "lucide-react"
  stroke-width: 1.75
  default-size:
    inline: "16px"
    feature: "32px"
    play: "32px in 64px disc"
  treatment: "Outline only; orange tint on hover; never filled (except play disc)"

components:
  button:
    base:
      radius: md
      height: "56px (h-14, hero CTA) | 36px (h-9 default) | 32px (h-8 small pill)"
      padding-x: "2rem (lg) | 1rem (default) | 0.75rem (sm)"
      font: "sans 600/700, tracking-wide; uppercase on outlined chips"
      transition: all-card
    variants:
      primary:
        background: brand.primary
        text: "#FFFFFF"
        hover-background: brand.primary-hover
        hover-transform: "scale(1.05)"
        shadow: "glow-tinted"
      outline-pill:
        background: "transparent"
        border: "1px solid #F97316"
        text: brand.primary
        radius: full
        hover-background: brand.primary
        hover-text: "#FFFFFF"
      filter-chip-active:
        background: brand.primary
        radius: full
        text: "#FFFFFF"
      filter-chip-idle:
        background: "transparent"
        border: "1px solid #334155"
        text: dark.text-muted
        hover-text: "#FFFFFF"
        hover-border: brand.primary-soft
      link:
        text: brand.primary-soft
        hover-text: brand.primary-bright
        weight: 700
        transform: "uppercase"
        gap: "0.5rem → 0.75rem on group-hover"
  input:
    radius: md
    height: "56px (hero), 36px (default)"
    background-dark: "rgba(2, 6, 23, 0.50)"
    background-cream: "rgba(255, 255, 255, 0.0)"  # ghost in pill-filter
    border: "1px solid #475569"
    placeholder: "slate-400"
    focus-ring: "3px rgba(249, 115, 22, 0.50)"
  badge:
    radius: full
    background: brand.primary
    text: "#FFFFFF"
    font: "sans 700, uppercase, tracking-widest, 10px"
    shadow: "glow-tinted"
  card:
    pattern: "card-glass-dark | card-radar | card-paper-light"
    feature-cards-have:
      - "icon well: rounded-xl, slate-950/50 bg, orange/30 border"
      - "title: serif xl, white"
      - "body: sans base, slate-300"
      - "footer CTA: caption — 'SAIBA MAIS' or 'AGENDAR DIAGNÓSTICO'"
  blockquote-editorial-light:
    background: "#FFFFFF"
    border-left: "4px solid #F97316"
    radius: "right-only — rounded-r-lg (8px)"
    padding: "2rem"
    type: "serif italic, 1.25–1.5rem, slate-800"
    decoration: "huge faded right-quote glyph at top-right, opacity 0.10"
  blockquote-dark:
    background: "rgba(30, 41, 59, 0.50)"
    border-left: "4px solid #F97316"
    radius: "right-only — rounded-r-lg (8px)"
    padding: "2rem"
    type: "serif italic, 24px, slate-200, weight 400"
    decoration: "inset 0 2px 4px rgba(0,0,0,0.05) at top edge"
  insight-card-paper:
    background: "#FFFFFF"
    border: "1px solid rgba(226, 232, 240, 0.50)"
    radius: xl
    shadow: sm
    image-treatment: "grayscale by default; warms to color on hover (transition 700ms)"
    eyebrow: "uppercase tracking-widest, orange-600"
    title: "serif weight 500, slate-900"
    cta: "uppercase tracking-widest 'LER ARTIGO →', slate-900"

backgrounds:
  page:
    dark:
      base: dark.bg-base
      enrichments: ["fixed parallax photograph", "section-scoped slate-950/80 dimmer with backdrop-blur-sm"]
    light:
      base: light.bg-base
      enrichments: ["full-bleed SVG noise at 3% opacity", "three blurred organic blobs (orange-200/30, slate-300/40, orange-100/40) with mix-blend-multiply"]
  hero-stack:
    layers:
      - "photograph (cover, fixed)"
      - "right-fading slate gradient for text legibility"
      - "bottom-anchoring slate-950 fade"
      - "content (z-10), max-w-3xl, 1.5rem stack"
  page-title-halo:
    technique: "200px round div, bg-orange-500/10, blur-100px, behind H1"
    role: "Quiet warmth without competing with text"

content-modes:
  dark-editorial:
    mood: "Studio at night, warm tungsten on cool steel"
    used-on: ["/", "/radar", "/radar/article/*"]
    accent: "Orange against navy, glow as primary depth cue"
  light-editorial:
    mood: "Letterpress on warm bone paper — Polimórfia"
    used-on: ["/insights", "/insights/article", "/privacy", "/terms"]
    accent: "Orange used sparingly as ink — hairline rules, italic display"
    signature-effects:
      - "fractal-noise paper grain (3% opacity, mix-blend-overlay)"
      - "three organic blurred blobs (warm + cool, mix-blend-multiply)"
      - "sticky pill filter bar floating in glass"
      - "grayscale featured image that warms to color on hover"
---

# gusflopes.dev — Design System

## Identity in one breath

Editorial-tech: a personal site that looks like a serious technology magazine, not a SaaS landing page. Cormorant Garamond sets a measured, almost legal tone in the headlines; Plus Jakarta Sans handles the working text with a humanist warmth. JetBrains Mono shows up only where it belongs — on metadata strips that quietly say "this was logged, timestamped, archived."

The system speaks in **two voices** that share the same vocabulary:

- **Dark Editorial** is the front door — slate-950 deep, with a painterly oil-textured illustration (warm cathedral silhouette over deep navy, washed in burnt orange highlights) parallaxing under the hero and the Themes block. Cards float as glass tiles bordered in 2px orange, glowing softly at rest and brightening on hover. This is where authority lives.
- **Light Editorial ("Polimórfia")** is the reading room — a warm bone paper (`#F5F5F0`) treated with 3% SVG fractal noise, three blurred organic blobs in warm and cool tints, and a translucent pill that holds the article filters. This is where ideas breathe.

The bridge between them is the **single brand orange** (`#F97316`), the same serif/sans/mono triad, **and the persistent dark navigation bar**. The header is `slate-950/80 backdrop-blur` on every route except the very top of the homepage (where it's transparent over the hero). On cream pages it floats as a dark navy strip above the warm paper — a deliberate stitch that says "this is one site in two moods, not two different sites."

## Color logic

There is exactly one accent: orange-500. Everything else is slate or cream. That constraint is doing real work — it lets glow, gradient, italic, and uppercase all speak from the same vocal cord. The palette never reaches for green for "go" or red for "stop." Status, emphasis, and personality all share the orange channel:

- **Resting orange** = a soft 30%-alpha glow around bordered cards.
- **Hover orange** = the same color, 50% alpha, pushed wider — the card doesn't *move* much, it *radiates*.
- **Stamped orange** = the colored shadow under the play disc and category badges (`shadow-orange-900/50`), which gives buttons a planted, weighted feel instead of generic Material elevation.

The headline gradient (`orange-400 → amber-600`) is the only place where a second hue appears, and only inside text. It's the brand thesis rendered visually: warm-on-warm, no contrast trick.

On the cream side, orange goes quieter — a hairline left-rule on a blockquote, the date eyebrow at uppercase 12px, the sparkle next to the page title. The light mode never *shouts* orange; it lets the serif italic carry mood and uses orange like ink.

## Typography behavior

The serif/sans split is strict and meaningful. **Headings are always serif.** Body, UI, and small labels are always sans. Code and timestamps are mono. This is not negotiable — h1 through h3 are wired to Cormorant Garamond at the base layer, while h4–h6 fall back to Jakarta. The implication: when something *should be felt* (a title, a quote, a hero deck) it goes serif; when something should be *read* or *operated*, it goes sans.

**The most important typographic decision** is hidden in the base layer: serif headings inherit `font-weight: 500` (medium). They are only bumped to 700 when a component opts in with `font-bold`. This produces two distinctly different voices for the same family:

- **Display voice (700)** — landing hero, section headers, "Últimos Insights" rail. Bold, declarative, advertising. Used to *announce*.
- **Editorial voice (500)** — long-form article H1s and inline H2s. Slim, literary, almost humanist; tracks tight without negative letter-spacing. Used to *think aloud*. The italicized words ("Domain-Driven Design", "Bounded Contexts") become genuinely italic-looking instead of pseudo-italic, because the surrounding weight is light enough to let italic register.

The display sizes lean tall and tight (line-height 1.05–1.15, ~-0.025em letter-spacing on the largest sizes) so that long Portuguese phrases like "A Ponte entre Negócios e Engenharia Avançada" land like a magazine spread. Body copy is generous: 1.6–1.7 line-height, 18–20px lead size, 300–400 weight in long-form. Article leads use weight 300 — visibly thin, almost essayistic.

Eyebrows and CTAs use a uniform formula — uppercase, 700 weight, 0.15em–0.18em tracking, sans, 12px or smaller. They appear in three places: above category names, beside dates, and as text-buttons reading "SAIBA MAIS →" / "LER ARTIGO →". They are always orange or slate, never primary text color.

A subtle dialect difference between the two modes: filter chips on **/radar are uppercase** ("TODOS", "ARQUITETURA") while filter chips on **/insights are initial-cap** ("Todos", "Arquitetura"). The radar shouts categories like a dashboard; insights name them like a table of contents.

## Surfaces and depth

There are essentially four surface archetypes:

1. **Glass-bordered card (dark)** — `slate-900/80` background, `backdrop-blur-md` (12px), **2px** orange-500/80 border, `rounded-xl` (12px), and the signature `0 0 15px -3px` orange glow. On hover the glow expands to `25px -5px / 0.50` and the card scales 1.02 in place — assertive but anchored. This is the system's hero element; it's used wherever an idea is being introduced (Themes, Services).
2. **Soft-bordered radar card (dark)** — same glass but with a slate-800 hairline border that turns orange-500/50 on hover, paired with a `-translate-y-2` lift. This is the workhorse for content lists; it doesn't compete with the bordered cards above.
3. **Paper insight card (light)** — pure white, `rounded-xl`, 1px slate-200/50 border, `shadow-sm`, **and a grayscale featured image that warms to color on hover over 700ms**. This last detail is doing real work: it makes attention itself feel like a developing photograph.
4. **Quote card (both modes)** — paper white in light mode, slate-800/50 in dark mode, both with a 4px orange left rule, `rounded-r-lg`, and a giant faded right-quote glyph (`opacity 0.10`) tucked into the top-right corner. Same gesture, recolored — proof that the system thinks in patterns, not chrome.

Depth is achieved primarily through **glow and blur**, not stacked shadows. The system avoids the generic Material 0/1/2/3 elevation ladder. Instead, an element is "elevated" when it picks up backdrop-blur (sticky bars, cards), gains a colored glow (interactive surfaces), or is anchored by a tinted shadow (`shadow-orange-900/50` on the play disc — which feels like a button you could press through the screen).

## Motion grammar

Three speeds: **200ms** for color and small transforms, **300ms** for cards and CTAs, **700ms** for image reveals. Cubic-bezier defaults — no bouncy springs, no overshoot. The longest animation in the system is a 10-second `animate-pulse` on the cream-mode background blob, which is intentionally just slow enough to read as ambient breathing rather than motion.

The signature hover gestures are small but consistent:

- **Card-scale-in-place** (`scale(1.02)`) on bordered cards — they push toward you without leaving the grid.
- **Card-lift** (`-translate-y-1` / `-translate-y-2`) on radar/insight cards — they break formation.
- **Image-zoom** (`scale(1.10)`, 700ms) on every card image, with the ease-out curve that makes it feel optical rather than mechanical.
- **Arrow-nudge** — the gap between the "Ler Mais" label and its arrow widens by 4px on group-hover, drawing the eye out of the card toward the action.
- **Grayscale-to-color** on light-editorial featured images — the photograph "warms up" as you arrive, reinforcing the cream-mode metaphor of paper that responds to attention.

`background-attachment: fixed` on the hero and Themes is the only "showy" effect; it's load-bearing, because it tells the user the warm photograph is the *room* the content is being staged in, not just decoration.

## Spacing and rhythm

The grid is opinionated and narrow:

- **`max-w-7xl` (80rem)** for landing/index/footer.
- **`max-w-4xl` (56rem)** for long-form reading — the same width Medium and Substack converged on, for the same reason: 65–75 characters per line.
- **`px-6` (24px)** gutter on every page, even on desktop. The site never goes edge-to-edge with text.
- **Sections breathe at `py-24` (96px)** on dark and `py-20` (80px) on light. Headings sit `mb-16` above grids. Card padding is `p-8` (32px), never less.

The hero stack is a vertical 1.5rem rhythm: headline → kicker → deck → form. The Themes grid uses an unusual **3-on-top, 2-on-bottom centered layout** instead of a 2x3 or 3x2 — five themes deliberately broken into a heroic top row and a featured bottom pair, which subtly tells the eye that not all themes are peers.

## What this system avoids

- **No green/red/yellow status colors.** Orange is the only accent.
- **No filled icons.** Lucide outline only, with optional orange tint.
- **No Material/iOS shadow ladder.** Depth = blur + glow + tinted shadow.
- **No light/dark switcher in the UI.** Mode is per-route, decided by content type — landing/discovery is dark, deep reading is light.
- **No tile-rounded-2xl or "fluffy" radii.** Cards stop at `rounded-xl`, buttons at `rounded-md`, pills at `rounded-full`. Nothing in between.
- **No drop shadows under text on flat surfaces.** Drop shadow on text is reserved for headlines floating over the parallax photograph, where legibility demands it.
- **No saturated background gradients.** Backgrounds are slate or cream; warmth comes from blurred orange blobs at low alpha, never from gradient washes.

## Voice this design supports

The visual identity is calibrated for a writer who is a **practitioner-essayist** — someone who ships .NET architecture and DDD for a living and writes long, careful pieces about why. The serif headlines argue that ideas matter; the cream paper argues that they deserve to be read slowly; the orange glow argues that there's still heat in the work; the mono date strip argues that this is engineering, not marketing. The whole system resists the SaaS tendency to look "snappy" and instead aims for *reliable*, *considered*, *warm*. A reader should feel they've walked into a small, well-lit study — not a dashboard.
