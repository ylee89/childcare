// Feel Friends — inline SVG illustrations for Story Adventures.
// Cute, dimensional CREATURE characters (bear / bunny / fox / cat) so young
// children feel warmth & affinity. Soft volumetric shading, big shiny eyes,
// cheek blush, rounded plush bodies. No external assets — works offline.

const DEFS = `<defs>
  <radialGradient id="ffSphere" cx="0.36" cy="0.28" r="0.85">
    <stop offset="0" stop-color="#fff" stop-opacity="0.55"/>
    <stop offset="0.45" stop-color="#fff" stop-opacity="0"/>
    <stop offset="1" stop-color="#3A2A22" stop-opacity="0.22"/>
  </radialGradient>
  <linearGradient id="ffVol" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity="0.4"/>
    <stop offset="0.5" stop-color="#fff" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity="0.18"/>
  </linearGradient>
  <radialGradient id="ffFloor" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#000" stop-opacity="0.16"/>
    <stop offset="1" stop-color="#000" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="ffBack" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
  </linearGradient>
</defs>`;

// ---- expressive face parts (body-local coords; eyes ~y -12, mouth ~y 11) ----
function eyesG(face) {
  const lid = (face === 'sad' || face === 'worried')
    ? `<path d="M-20 -16 Q-13 -20 -6 -16" stroke="#3A2A22" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M6 -16 Q13 -20 20 -16" stroke="#3A2A22" stroke-width="2" fill="none" stroke-linecap="round"/>` : '';
  return `<ellipse cx="-13" cy="-11" rx="7.5" ry="9" fill="#fff"/><ellipse cx="13" cy="-11" rx="7.5" ry="9" fill="#fff"/>
    <circle cx="-12" cy="-9" r="4.4" fill="#2A1E18"/><circle cx="14" cy="-9" r="4.4" fill="#2A1E18"/>
    <circle cx="-10.4" cy="-10.8" r="1.7" fill="#fff"/><circle cx="15.6" cy="-10.8" r="1.7" fill="#fff"/>${lid}`;
}
function browsG(face) {
  if (face === 'angry') return `<line x1="-19" y1="-22" x2="-7" y2="-18" stroke="#2A1E18" stroke-width="2.8" stroke-linecap="round"/><line x1="19" y1="-22" x2="7" y2="-18" stroke="#2A1E18" stroke-width="2.8" stroke-linecap="round"/>`;
  if (face === 'worried') return `<line x1="-18" y1="-22" x2="-8" y2="-24" stroke="#2A1E18" stroke-width="2.4" stroke-linecap="round"/><line x1="18" y1="-22" x2="8" y2="-24" stroke="#2A1E18" stroke-width="2.4" stroke-linecap="round"/>`;
  return '';
}
function mouthG(face) {
  switch (face) {
    case 'big':     return `<path d="M-9 9 Q0 21 9 9 Z" fill="#7A3F33"/><path d="M-5 15 Q0 19 5 15 Z" fill="#FF9D90"/>`;
    case 'smile':   return `<path d="M-8 10 Q0 18 8 10" stroke="#5A3B2E" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    case 'sad':     return `<path d="M-7 16 Q0 8 7 16" stroke="#5A3B2E" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    case 'worried': return `<path d="M-6 13 Q0 10 6 14" stroke="#5A3B2E" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    case 'angry':   return `<path d="M-7 14 Q0 9 7 14" stroke="#5A3B2E" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    default:        return `<line x1="-6" y1="12" x2="6" y2="12" stroke="#5A3B2E" stroke-width="2.6" stroke-linecap="round"/>`;
  }
}
const tearG = (face) => (face === 'sad') ? `<circle cx="-18" cy="-2" r="3" fill="#7CC6FE"/><circle cx="-18" cy="-2" r="3" fill="url(#ffSphere)"/>` : '';

// species-specific ears / snout / tail (body-local; body half-height ~39)
function ears(species, c) {
  switch (species) {
    case 'bunny': return `<g>
      <g transform="translate(-12 -40) rotate(-9)"><ellipse rx="7.5" ry="23" fill="${c}"/><ellipse cx="0" cy="2" rx="3.4" ry="16" fill="#FF9DB0" opacity="0.65"/><ellipse rx="7.5" ry="23" fill="url(#ffVol)"/></g>
      <g transform="translate(12 -40) rotate(9)"><ellipse rx="7.5" ry="23" fill="${c}"/><ellipse cx="0" cy="2" rx="3.4" ry="16" fill="#FF9DB0" opacity="0.65"/><ellipse rx="7.5" ry="23" fill="url(#ffVol)"/></g></g>`;
    case 'fox': return `<g>
      <path d="M-26 -30 L-11 -46 L-2 -28 Z" fill="${c}"/><path d="M-22 -32 L-12 -42 L-7 -30 Z" fill="#5A3B2E" opacity="0.55"/>
      <path d="M26 -30 L11 -46 L2 -28 Z" fill="${c}"/><path d="M22 -32 L12 -42 L7 -30 Z" fill="#5A3B2E" opacity="0.55"/></g>`;
    case 'cat': return `<g>
      <path d="M-23 -30 L-12 -47 L-3 -30 Z" fill="${c}"/><path d="M-19 -32 L-12 -42 L-7 -31 Z" fill="#FF9DB0" opacity="0.6"/>
      <path d="M23 -30 L12 -47 L3 -30 Z" fill="${c}"/><path d="M19 -32 L12 -42 L7 -31 Z" fill="#FF9DB0" opacity="0.6"/></g>`;
    default: return `<g> <!-- bear -->
      <circle cx="-20" cy="-36" r="12" fill="${c}"/><circle cx="-20" cy="-36" r="6" fill="#fff" opacity="0.3"/>
      <circle cx="20" cy="-36" r="12" fill="${c}"/><circle cx="20" cy="-36" r="6" fill="#fff" opacity="0.3"/>
      <circle cx="-20" cy="-36" r="12" fill="url(#ffSphere)"/><circle cx="20" cy="-36" r="12" fill="url(#ffSphere)"/></g>`;
  }
}
function snout(species) {
  switch (species) {
    case 'bunny': return `<ellipse cx="0" cy="6" rx="11" ry="8" fill="#fff" opacity="0.3"/><path d="M-3.2 1 L3.2 1 L0 5 Z" fill="#FF7DA0"/><path d="M0 5 V9 M0 9 Q-5 13 -8 9 M0 9 Q5 13 8 9" stroke="#5A3B2E" stroke-width="1.9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    case 'fox': return `<ellipse cx="0" cy="7" rx="12" ry="9" fill="#fff" opacity="0.45"/><ellipse cx="0" cy="3" rx="4" ry="3" fill="#2A1E18"/>`;
    case 'cat': return `<ellipse cx="0" cy="5" rx="11" ry="8" fill="#fff" opacity="0.3"/><path d="M-2.6 2 L2.6 2 L0 5 Z" fill="#FF7DA0"/>
      <g stroke="#5A3B2E" stroke-width="1.4" stroke-linecap="round" opacity="0.7"><line x1="6" y1="5" x2="22" y2="2"/><line x1="6" y1="7" x2="22" y2="8"/><line x1="-6" y1="5" x2="-22" y2="2"/><line x1="-6" y1="7" x2="-22" y2="8"/></g>`;
    default: return `<ellipse cx="0" cy="6" rx="13" ry="10" fill="#fff" opacity="0.32"/><ellipse cx="0" cy="0" rx="4.2" ry="3.2" fill="#5A3B2E"/>`;
  }
}
function tail(species, c, side) {
  if (species === 'fox') return `<path d="M${side*30} 26 Q${side*58} 18 ${side*54} 44 Q${side*44} 40 ${side*28} 36 Z" fill="${c}"/><path d="M${side*50} 30 Q${side*58} 30 ${side*54} 44 Q${side*47} 41 ${side*45} 36 Z" fill="#fff" opacity="0.8"/>`;
  if (species === 'cat') return `<path d="M${side*30} 28 Q${side*56} 24 ${side*52} 0 Q${side*60} 24 ${side*40} 36 Z" fill="${c}"/>`;
  return '';
}

/** A cute creature. (cx,cy)=body centre. opts: species,color,face,flip,lean,arm. */
function creature(cx, cy, opts = {}) {
  const sp = opts.species || 'bear';
  const c = opts.color || '#E8A86B';
  const face = opts.face || 'smile';
  const lean = opts.lean || 0;
  const flip = opts.flip ? -1 : 1;
  const bw = 66, bh = 80, half = bh / 2;
  // rounded plush body
  const body = `M${-bw/2} ${-half+24} Q${-bw/2} ${-half} ${-bw/2+24} ${-half} L${bw/2-24} ${-half} Q${bw/2} ${-half} ${bw/2} ${-half+24} L${bw/2} ${half-20} Q${bw/2} ${half} ${bw/2-20} ${half} L${-bw/2+20} ${half} Q${-bw/2} ${half} ${-bw/2} ${half-20} Z`;

  const foot = (x) => `<ellipse cx="${x}" cy="${half-1}" rx="11" ry="7" fill="${c}"/><ellipse cx="${x}" cy="${half-1}" rx="11" ry="7" fill="url(#ffVol)"/>`;
  const armNub = (side) => {
    if (opts.arm === 'reach') return `<ellipse cx="${side*(bw/2+10)}" cy="2" rx="11" ry="8" fill="${c}" transform="rotate(${side*-18} ${side*(bw/2+6)} 2)"/><ellipse cx="${side*(bw/2+10)}" cy="2" rx="11" ry="8" fill="url(#ffSphere)" transform="rotate(${side*-18} ${side*(bw/2+6)} 2)"/>`;
    if (opts.arm === 'up') return `<ellipse cx="${side*(bw/2-2)}" cy="${-half+6}" rx="8" ry="11" fill="${c}"/><ellipse cx="${side*(bw/2-2)}" cy="${-half+6}" rx="8" ry="11" fill="url(#ffSphere)"/>`;
    return `<ellipse cx="${side*(bw/2-1)}" cy="12" rx="9" ry="11" fill="${c}"/><ellipse cx="${side*(bw/2-1)}" cy="12" rx="9" ry="11" fill="url(#ffSphere)"/>`;
  };

  const inner = `
    ${tail(sp, c, -1)}
    ${ears(sp, c)}
    ${foot(-15)}${foot(15)}
    ${armNub(-1)}${armNub(1)}
    <path d="${body}" fill="${c}"/>
    <path d="${body}" fill="url(#ffSphere)"/>
    <ellipse cx="0" cy="14" rx="22" ry="20" fill="#fff" opacity="0.16"/>
    <ellipse cx="-13" cy="${-half+20}" rx="12" ry="8" fill="#fff" opacity="0.22" transform="rotate(-18 -13 ${-half+20})"/>
    <circle cx="-22" cy="6" r="5" fill="#FF9DA8" opacity="0.5"/><circle cx="22" cy="6" r="5" fill="#FF9DA8" opacity="0.5"/>
    ${snout(sp)}
    ${eyesG(face)}${browsG(face)}${tearG(face)}${sp === 'bunny' ? '' : mouthG(face)}`;

  return `<g transform="translate(${cx} ${cy}) scale(${flip} 1)">
    <ellipse cx="0" cy="${half + 12}" rx="40" ry="11" fill="url(#ffFloor)"/>
    <g transform="rotate(${lean})">${inner}</g>
  </g>`;
}

const W = 320, H = 200;
function frame(bg, bg2, inner) {
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img">
    ${DEFS}
    <rect width="${W}" height="${H}" rx="20" fill="${bg}"/>
    <rect width="${W}" height="${H}" rx="20" fill="url(#ffBack)"/>
    <ellipse cx="${W / 2}" cy="212" rx="230" ry="50" fill="${bg2}"/>
    ${inner}
  </svg>`;
}

// props
const truck = (x, y) => `<g transform="translate(${x} ${y})">
  <ellipse cx="2" cy="16" rx="26" ry="6" fill="url(#ffFloor)"/>
  <rect x="-24" y="-13" width="38" height="20" rx="6" fill="#FF8C7A"/><rect x="-24" y="-13" width="38" height="20" rx="6" fill="url(#ffVol)"/>
  <rect x="12" y="-7" width="15" height="14" rx="4" fill="#FFD56B"/><rect x="12" y="-7" width="15" height="14" rx="4" fill="url(#ffVol)"/>
  <circle cx="-13" cy="9" r="6.5" fill="#3A3A4A"/><circle cx="18" cy="9" r="6.5" fill="#3A3A4A"/></g>`;
const ball = (x, y) => `<g transform="translate(${x} ${y})">
  <ellipse cx="0" cy="18" rx="16" ry="5" fill="url(#ffFloor)"/>
  <circle r="15" fill="#fff"/><circle r="15" fill="url(#ffSphere)"/><path d="M-15 0 H15 M0 -15 V15" stroke="#5FB6F6" stroke-width="3"/></g>`;
const heart = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 7 C-7 -5 -20 2 0 18 C20 2 7 -5 0 7 Z" fill="#FF6B8A"/><path d="M0 7 C-7 -5 -20 2 0 18 C20 2 7 -5 0 7 Z" fill="url(#ffVol)"/></g>`;
const sparkle = (x, y) => `<g transform="translate(${x} ${y})" fill="#FFD56B"><path d="M0 -9 L2 -2 L9 0 L2 2 L0 9 L-2 2 L-9 0 L-2 -2 Z"/></g>`;

// creature colours
const C = { bearTan: '#E0A36A', bunnyPink: '#F3C0D4', foxOrange: '#FF9F5A', catGrey: '#AAB3C4', bearMint: '#9BE3B4', catLav: '#B7A6F0' };

// ---- the four situations ----
const SCENES = {
  sharing: () => frame('#FFF1CF', '#F3DFA6',
    creature(104, 116, { species: 'bear', color: C.bearTan, face: 'neutral' }) +
    truck(160, 158) +
    creature(214, 116, { species: 'bunny', color: C.bunnyPink, face: 'worried', flip: true, arm: 'reach' })),

  pushed: () => frame('#FFE4DD', '#F6CFC6',
    `<g stroke="#E89A8C" stroke-width="3" stroke-dasharray="6 8" opacity=".7"><line x1="40" y1="166" x2="280" y2="166"/></g>` +
    creature(116, 116, { species: 'fox', color: C.foxOrange, face: 'angry', lean: 13, arm: 'reach' }) +
    sparkle(168, 96) +
    creature(210, 120, { species: 'cat', color: C.catGrey, face: 'worried', lean: 9, arm: 'up' })),

  excluded: () => frame('#E3F0FF', '#C9DEF6',
    creature(86, 118, { species: 'bear', color: C.bearMint, face: 'big' }) +
    ball(120, 162) +
    creature(150, 118, { species: 'bunny', color: C.bunnyPink, face: 'smile' }) +
    creature(258, 120, { species: 'cat', color: C.catLav, face: 'sad', flip: true })),

  help: () => frame('#EEE8FF', '#D9CFF2',
    `<g transform="translate(238 66)">
       <ellipse cx="0" cy="46" rx="34" ry="7" fill="url(#ffFloor)"/>
       <rect x="-32" y="-30" width="64" height="22" rx="6" fill="#C3B5F2"/><rect x="-32" y="-30" width="64" height="22" rx="6" fill="url(#ffVol)"/>
       <rect x="-32" y="-4" width="64" height="22" rx="6" fill="#B3A2E8"/><rect x="-32" y="-4" width="64" height="22" rx="6" fill="url(#ffVol)"/>
       <circle cx="0" cy="-19" r="10" fill="#FFD56B"/><circle cx="0" cy="-19" r="10" fill="url(#ffSphere)"/></g>` +
    creature(130, 120, { species: 'bear', color: C.bearTan, face: 'worried', arm: 'up' })),
};

// ---- outcome illustrations ----
function outcomeArt(kind) {
  if (kind === 'good') return frame('#E3F7E9', '#C6ECD2',
    heart(160, 44, 1.5) + sparkle(96, 60) + sparkle(228, 70) +
    creature(112, 118, { species: 'bear', color: C.bearTan, face: 'big', arm: 'reach' }) +
    creature(208, 118, { species: 'bunny', color: C.bunnyPink, face: 'big', flip: true, arm: 'reach' }));
  return frame('#FFF4E0', '#F3E2BE',
    `<g transform="translate(236 52)" opacity=".9"><circle r="17" fill="#fff"/><circle r="17" fill="url(#ffSphere)"/>
       <path d="M-6 -3 a7 7 0 1 1 6 8 v3" fill="none" stroke="#FFB36B" stroke-width="3.2" stroke-linecap="round"/>
       <circle cx="0" cy="12" r="2" fill="#FFB36B"/></g>` +
    creature(150, 120, { species: 'fox', color: C.foxOrange, face: 'worried' }));
}

export function storyScene(id) { return (SCENES[id] || SCENES.sharing)(); }
export function storyOutcomeArt(good) { return outcomeArt(good ? 'good' : 'reflect'); }
