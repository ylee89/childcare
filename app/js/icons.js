// Feel Friends — the icon set.
//
// Every UI icon in the app is drawn here, in the brand palette, so the product
// looks the same on iOS, Android and Windows. (System emoji render differently
// on each platform, which means no control over the visual identity — and they
// read as placeholders.) Emotion FACES stay emoji for now: those are content,
// not chrome, and 12 consistent expressive faces are their own design job.
//
// House style, matching js/illustrations.js:
//   · one 48×48 viewBox, shapes on an 8px grid, nothing thinner than 2.5px
//   · soft volumetric shading (ffIcoVol) + a warm highlight, never flat-grey
//   · palette colours only, so a tile's icon and its background always agree
//   · no external assets — inline SVG, works offline

const P = {
  sky: '#7CC6FE', skyDeep: '#5AA9E6', sun: '#FFD56B', sunDeep: '#F0B93F',
  coral: '#FF8C7A', coralDeep: '#E86B57', mint: '#9BE3B4', mintDeep: '#6FC894',
  lilac: '#C3B5F2', lilacDeep: '#9C89DD', pink: '#FF9DB0', pinkDeep: '#E8748C',
  cream: '#FFF8EF', ink: '#3A3A4A', paper: '#FFFFFF', calm: '#A9C6FF',
};

const DEFS = `<defs>
  <linearGradient id="ffIcoVol" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity="0.45"/>
    <stop offset="0.55" stop-color="#fff" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity="0.14"/>
  </linearGradient>
</defs>`;

// a filled shape + its shading pass, so every icon reads dimensional
const vol = (shape) => shape + shape.replace(/fill="[^"]*"/, 'fill="url(#ffIcoVol)"');

const SHAPES = {
  // ---- the six worlds -------------------------------------------------
  emotion: () => `
    ${vol(`<circle cx="24" cy="24" r="17" fill="${P.sun}"/>`)}
    <circle cx="17.5" cy="21" r="2.6" fill="${P.ink}"/><circle cx="30.5" cy="21" r="2.6" fill="${P.ink}"/>
    <circle cx="18.4" cy="20.2" r="0.9" fill="#fff"/><circle cx="31.4" cy="20.2" r="0.9" fill="#fff"/>
    <path d="M16 28.5 Q24 35.5 32 28.5" stroke="${P.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="13.5" cy="27" rx="3" ry="2" fill="${P.coral}" opacity="0.5"/>
    <ellipse cx="34.5" cy="27" rx="3" ry="2" fill="${P.coral}" opacity="0.5"/>`,

  stories: () => `
    ${vol(`<path d="M6 12 Q15 8 23 12 L23 38 Q15 34 6 38 Z" fill="${P.sky}"/>`)}
    ${vol(`<path d="M42 12 Q33 8 25 12 L25 38 Q33 34 42 38 Z" fill="${P.skyDeep}"/>`)}
    <g stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.85">
      <line x1="10" y1="18" x2="19" y2="19"/><line x1="10" y1="24" x2="19" y2="25"/>
      <line x1="29" y1="19" x2="38" y2="18"/><line x1="29" y1="25" x2="38" y2="24"/></g>
    <path d="M24 11 L24 38" stroke="${P.cream}" stroke-width="2.5" stroke-linecap="round"/>`,

  brave: () => `
    ${vol(`<path d="M8 12 h22 a7 7 0 0 1 7 7 v8 a7 7 0 0 1 -7 7 h-9 l-8 6 v-6 h-5 a7 7 0 0 1 -7 -7 v-8 a7 7 0 0 1 7 -7 Z" fill="${P.coral}"/>`)}
    <g stroke="#fff" stroke-width="3" stroke-linecap="round">
      <line x1="13" y1="20" x2="13" y2="26"/><line x1="20" y1="17.5" x2="20" y2="28.5"/>
      <line x1="27" y1="21" x2="27" y2="25"/></g>
    <g stroke="${P.coralDeep}" stroke-width="2.5" fill="none" stroke-linecap="round">
      <path d="M40 18 Q43 24 40 30"/><path d="M44 15 Q48 24 44 33" opacity="0.55"/></g>`,

  empathy: () => `
    ${vol(`<path d="M24 40 C10 31 6 24 6 18.5 C6 13 10.5 9.5 15 9.5 C18.6 9.5 21.8 11.6 24 15 C26.2 11.6 29.4 9.5 33 9.5 C37.5 9.5 42 13 42 18.5 C42 24 38 31 24 40 Z" fill="${P.lilac}"/>`)}
    <path d="M24 33 C16 27.5 13 23.5 13 20 C13 17 15.2 15.2 17.5 15.2 C19.6 15.2 21 16.4 24 19.6" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity="0.75"/>
    <circle cx="34" cy="17" r="2.6" fill="#fff" opacity="0.65"/>`,

  choice: () => `
    ${vol(`<rect x="7" y="7" width="34" height="34" rx="11" fill="${P.mint}"/>`)}
    <path d="M15 25 l6.5 6.5 L34 18" stroke="#fff" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15 25 l6.5 6.5 L34 18" stroke="${P.mintDeep}" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>`,

  sticker: () => `
    ${vol(`<rect x="7" y="9" width="34" height="30" rx="7" fill="${P.pink}"/>`)}
    <rect x="7" y="9" width="10" height="30" rx="7" fill="${P.pinkDeep}" opacity="0.55"/>
    ${vol(`<path d="M29 15.5 l2.6 5.6 6.1 0.8 -4.5 4.3 1.2 6.1 -5.4 -3 -5.4 3 1.2 -6.1 -4.5 -4.3 6.1 -0.8 Z" fill="${P.sun}"/>`)}`,

  // ---- persistent nav --------------------------------------------------
  home: () => `
    ${vol(`<path d="M24 7 L42 22 L38 22 L38 40 a2 2 0 0 1 -2 2 h-24 a2 2 0 0 1 -2 -2 L10 22 L6 22 Z" fill="${P.coral}"/>`)}
    <rect x="19" y="27" width="10" height="15" rx="2.5" fill="${P.cream}"/>
    <rect x="27" y="14" width="6" height="8" rx="2" fill="${P.coralDeep}"/>
    <circle cx="26.5" cy="34.5" r="1.4" fill="${P.coralDeep}"/>`,

  calm: () => `
    ${vol(`<circle cx="19" cy="27" r="13" fill="${P.calm}"/>`)}
    ${vol(`<circle cx="34" cy="17" r="8" fill="${P.sky}"/>`)}
    ${vol(`<circle cx="35" cy="33" r="5.5" fill="${P.calm}"/>`)}
    <ellipse cx="14" cy="21" rx="4" ry="3" fill="#fff" opacity="0.6" transform="rotate(-25 14 21)"/>
    <ellipse cx="31.5" cy="14" rx="2.4" ry="1.8" fill="#fff" opacity="0.6" transform="rotate(-25 31.5 14)"/>`,

  // ---- calm activities -------------------------------------------------
  balloon: () => `
    ${vol(`<path d="M24 6 C32.5 6 38 12.6 38 20.5 C38 28.6 31.5 34.6 24 36 C16.5 34.6 10 28.6 10 20.5 C10 12.6 15.5 6 24 6 Z" fill="${P.pink}"/>`)}
    <path d="M21.5 36 h5 l-2.5 3 Z" fill="${P.pinkDeep}"/>
    <path d="M24 39 q4 4 -1 7 q-5 3 -1 6" stroke="${P.sky}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <ellipse cx="18.5" cy="16" rx="4.5" ry="6" fill="#fff" opacity="0.42" transform="rotate(-20 18.5 16)"/>`,

  glitter: () => `
    <path d="M17 8 h14 v5 l4 8 v18 a3 3 0 0 1 -3 3 h-16 a3 3 0 0 1 -3 -3 v-18 l4 -8 Z" fill="${P.sky}" opacity="0.35"/>
    <path d="M13 26 v13 a3 3 0 0 0 3 3 h16 a3 3 0 0 0 3 -3 v-13 Z" fill="${P.sky}" opacity="0.55"/>
    <g fill="${P.sun}"><path d="M24 15 l1.5 3.6 3.6 1.5 -3.6 1.5 -1.5 3.6 -1.5 -3.6 -3.6 -1.5 3.6 -1.5 Z"/>
      <circle cx="18" cy="31" r="2"/><circle cx="30" cy="34" r="1.7"/></g>
    <g fill="${P.pink}"><circle cx="24" cy="36" r="2.2"/><circle cx="31" cy="27" r="1.6"/></g>
    <rect x="16" y="6" width="16" height="4.5" rx="2.2" fill="${P.skyDeep}"/>`,

  counting: () => `
    ${vol(`<rect x="6" y="14" width="16" height="16" rx="5" fill="${P.sun}"/>`)}
    ${vol(`<rect x="26" y="14" width="16" height="16" rx="5" fill="${P.mint}"/>`)}
    ${vol(`<rect x="16" y="30" width="16" height="14" rx="5" fill="${P.lilac}"/>`)}
    <g fill="${P.ink}" font-family="Nunito,system-ui,sans-serif" font-weight="800" font-size="11" text-anchor="middle">
      <text x="14" y="26">1</text><text x="34" y="26">2</text><text x="24" y="41">3</text></g>`,

  quiet: () => `
    <path d="M11 30 v-6 a13 13 0 0 1 26 0 v6" fill="none" stroke="${P.lilacDeep}" stroke-width="4" stroke-linecap="round"/>
    ${vol(`<rect x="6" y="26" width="10" height="15" rx="5" fill="${P.lilac}"/>`)}
    ${vol(`<rect x="32" y="26" width="10" height="15" rx="5" fill="${P.lilac}"/>`)}
    <circle cx="24" cy="17" r="2.4" fill="${P.calm}" opacity="0.8"/>`,

  // ---- chrome ----------------------------------------------------------
  key: () => `
    ${vol(`<circle cx="17" cy="17" r="10" fill="${P.sun}"/>`)}
    <circle cx="17" cy="17" r="4" fill="${P.cream}"/>
    <path d="M23 23 L38 38" stroke="${P.sunDeep}" stroke-width="5" stroke-linecap="round"/>
    <path d="M31 31 l5 -5" stroke="${P.sunDeep}" stroke-width="5" stroke-linecap="round"/>`,

  cloud: () => `
    ${vol(`<path d="M14 32 a8 8 0 0 1 0.6 -16 a11 11 0 0 1 20.6 3 a7 7 0 0 1 -1.2 13 Z" fill="${P.calm}"/>`)}`,

  mic: () => `
    ${vol(`<rect x="18" y="6" width="12" height="22" rx="6" fill="${P.paper}"/>`)}
    <path d="M12 22 a12 12 0 0 0 24 0" fill="none" stroke="${P.paper}" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="24" y1="34" x2="24" y2="41" stroke="${P.paper}" stroke-width="3.5" stroke-linecap="round"/>
    <g stroke="${P.paper}" stroke-width="2" opacity="0.55" stroke-linecap="round">
      <line x1="21" y1="12" x2="27" y2="12"/><line x1="21" y1="17" x2="27" y2="17"/></g>`,

  star: () => `
    ${vol(`<path d="M24 6 l5.2 11 12 1.7 -8.8 8.4 2.3 11.9 -10.7 -5.9 -10.7 5.9 2.3 -11.9 -8.8 -8.4 12 -1.7 Z" fill="${P.sun}"/>`)}`,

  trophy: () => `
    ${vol(`<path d="M15 8 h18 v11 a9 9 0 0 1 -18 0 Z" fill="${P.sun}"/>`)}
    <path d="M15 11 h-5 a6 6 0 0 0 6 8" fill="none" stroke="${P.sunDeep}" stroke-width="3" stroke-linecap="round"/>
    <path d="M33 11 h5 a6 6 0 0 1 -6 8" fill="none" stroke="${P.sunDeep}" stroke-width="3" stroke-linecap="round"/>
    <rect x="21" y="27" width="6" height="7" fill="${P.sunDeep}"/>
    <rect x="14" y="34" width="20" height="6" rx="2.5" fill="${P.coral}"/>`,

  think: () => `
    ${vol(`<circle cx="26" cy="20" r="13" fill="${P.lilac}"/>`)}
    <text x="26" y="26" font-family="Nunito,system-ui,sans-serif" font-weight="800" font-size="16" fill="#fff" text-anchor="middle">?</text>
    ${vol(`<circle cx="13" cy="34" r="5" fill="${P.lilac}"/>`)}
    ${vol(`<circle cx="7" cy="41" r="3" fill="${P.lilac}"/>`)}`,

  sun: () => `
    <g stroke="${P.sunDeep}" stroke-width="3.5" stroke-linecap="round">
      <line x1="24" y1="4" x2="24" y2="9"/><line x1="24" y1="39" x2="24" y2="44"/>
      <line x1="4" y1="24" x2="9" y2="24"/><line x1="39" y1="24" x2="44" y2="24"/>
      <line x1="10" y1="10" x2="13.5" y2="13.5"/><line x1="34.5" y1="34.5" x2="38" y2="38"/>
      <line x1="38" y1="10" x2="34.5" y2="13.5"/><line x1="13.5" y1="34.5" x2="10" y2="38"/></g>
    ${vol(`<circle cx="24" cy="24" r="11" fill="${P.sun}"/>`)}`,

  // ---- story tiles -----------------------------------------------------
  'story-sharing': () => `
    ${vol(`<rect x="6" y="20" width="16" height="16" rx="4" fill="${P.sun}"/>`)}
    ${vol(`<rect x="26" y="20" width="16" height="16" rx="4" fill="${P.sky}"/>`)}
    <path d="M18 28 h12" stroke="${P.mintDeep}" stroke-width="3" stroke-linecap="round"/>
    <path d="M27 24 l4 4 -4 4" fill="none" stroke="${P.mintDeep}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M21 32 l-4 -4 4 -4" fill="none" stroke="${P.mintDeep}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M24 8 l1.8 4 4 1.8 -4 1.8 -1.8 4 -1.8 -4 -4 -1.8 4 -1.8 Z" fill="${P.sun}"/>`,

  'story-pushed': () => `
    ${vol(`<path d="M24 6 L40 12 v11 c0 9 -7 15.5 -16 19 -9 -3.5 -16 -10 -16 -19 V12 Z" fill="${P.sky}"/>`)}
    <path d="M16 24 l5.5 5.5 L33 18" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,

  'story-excluded': () => `
    ${vol(`<circle cx="15" cy="17" r="7" fill="${P.mint}"/>`)}
    <path d="M5 40 a10 10 0 0 1 20 0 Z" fill="${P.mint}"/>
    ${vol(`<circle cx="34" cy="17" r="7" fill="${P.lilac}"/>`)}
    <path d="M24 40 a10 10 0 0 1 20 0 Z" fill="${P.lilac}"/>
    <path d="M24 12 v24" stroke="${P.coral}" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="3 4"/>`,

  'story-help': () => `
    ${vol(`<circle cx="24" cy="14" r="8" fill="${P.sun}"/>`)}
    <path d="M12 42 a12 12 0 0 1 24 0 Z" fill="${P.sun}"/>
    <path d="M34 20 l4 -9" stroke="${P.sunDeep}" stroke-width="4" stroke-linecap="round"/>
    <circle cx="39" cy="8" r="4" fill="${P.coral}"/>`,
};

export const ICONS = Object.keys(SHAPES);

// icon(name, size) -> inline SVG string. Decorative by default: the label next
// to it carries the meaning, so screen readers skip the art.
export function icon(name, size = 40, { label = '' } = {}) {
  const draw = SHAPES[name] || SHAPES.star;
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"';
  return `<svg viewBox="0 0 48 48" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" ${a11y}>
    ${DEFS}${draw()}</svg>`;
}
