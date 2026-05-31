// Feel Friends — inline SVG illustrations for Story Adventures.
// Friendly, dimensional, diverse characters depicting each situation.
// Style cues from soft kids'-app art (Sesame "Breathe, Think, Do", Sago Mini):
// volumetric shading via gradient overlays, soft contact shadows, highlights,
// cheek blush, chunky rounded forms. No external assets — works offline.

const SKIN  = ['#F6CBA6', '#E2A877', '#C07F4A', '#8A5630'];
const HAIR  = ['#2E2A28', '#5C3A1E', '#111111', '#A6612E', '#E6B54A'];
const SHIRT = ['#5FB6F6', '#FF8FC7', '#7FD8A0', '#FFCB52', '#B7A6F0', '#FF8C7A'];
const PANTS = ['#46618E', '#7A5AA8', '#3E8E6B', '#C77A3A', '#5566A0', '#C75B49'];

// volumetric overlays (identical across SVGs → safe to reuse the same ids)
const DEFS = `<defs>
  <radialGradient id="ffSphere" cx="0.36" cy="0.30" r="0.80">
    <stop offset="0" stop-color="#fff" stop-opacity="0.50"/>
    <stop offset="0.45" stop-color="#fff" stop-opacity="0"/>
    <stop offset="1" stop-color="#3A2A22" stop-opacity="0.20"/>
  </radialGradient>
  <linearGradient id="ffVol" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fff" stop-opacity="0.42"/>
    <stop offset="0.5" stop-color="#fff" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity="0.16"/>
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

function mouth(face) {
  switch (face) {
    case 'smile':   return `<path d="M-8 8 Q0 16 8 8" stroke="#5A3B2E" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    case 'big':     return `<path d="M-9 6 Q0 19 9 6 Z" fill="#7A3F33"/><path d="M-6 12 Q0 16 6 12 Z" fill="#FF9D90"/>`;
    case 'sad':     return `<path d="M-8 13 Q0 5 8 13" stroke="#5A3B2E" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    case 'worried': return `<path d="M-7 11 Q0 8 7 12" stroke="#5A3B2E" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    case 'angry':   return `<path d="M-8 12 Q0 7 8 12" stroke="#5A3B2E" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    default:        return `<line x1="-6" y1="10" x2="6" y2="10" stroke="#5A3B2E" stroke-width="2.6" stroke-linecap="round"/>`;
  }
}
function brows(face) {
  if (face === 'angry')   return `<line x1="-14" y1="-10" x2="-5" y2="-5" stroke="#3A2A22" stroke-width="2.6" stroke-linecap="round"/><line x1="14" y1="-10" x2="5" y2="-5" stroke="#3A2A22" stroke-width="2.6" stroke-linecap="round"/>`;
  if (face === 'sad' || face === 'worried') return `<line x1="-13" y1="-8" x2="-5" y2="-11" stroke="#3A2A22" stroke-width="2.4" stroke-linecap="round"/><line x1="13" y1="-8" x2="5" y2="-11" stroke="#3A2A22" stroke-width="2.4" stroke-linecap="round"/>`;
  return '';
}
const tear = (face) => (face === 'sad') ? `<circle cx="-10" cy="7" r="2.6" fill="#7CC6FE"/><circle cx="-10" cy="7" r="2.6" fill="url(#ffSphere)"/>` : '';

/** A child figure. (cx,cy)=head centre. opts: i, face, flip, armL/armR, lean. */
function child(cx, cy, opts = {}) {
  const i = opts.i ?? 0;
  const skin = SKIN[i % SKIN.length], hair = HAIR[i % HAIR.length];
  const shirt = SHIRT[i % SHIRT.length], pants = PANTS[i % PANTS.length];
  const face = opts.face || 'smile';
  const lean = opts.lean || 0;
  const flip = opts.flip ? -1 : 1;
  const bT = 22, bW = 52, bH = 52, footY = bT + bH + 20;

  const leg = (x) => `<line x1="${x}" y1="${bT + bH - 6}" x2="${x * 1.15}" y2="${footY}" stroke="${pants}" stroke-width="13" stroke-linecap="round"/>`
    + `<ellipse cx="${x * 1.15 + 3}" cy="${footY + 2}" rx="9" ry="5.5" fill="#3A3A4A"/>`;

  const arm = (side, pose) => {
    const sx = side * (bW / 2 - 4), sy = bT + 10;
    let ex = side * (bW / 2 + 12), ey = bT + 36;
    if (pose === 'up')    { ex = side * (bW / 2 + 4);  ey = bT - 16; }
    if (pose === 'reach') { ex = side * (bW / 2 + 30); ey = bT + 4; }
    if (pose === 'hip')   { ex = side * (bW / 2 + 1);  ey = bT + 24; }
    return `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="${shirt}" stroke-width="12" stroke-linecap="round"/>`
      + `<circle cx="${ex}" cy="${ey}" r="6.5" fill="${skin}"/><circle cx="${ex}" cy="${ey}" r="6.5" fill="url(#ffSphere)"/>`;
  };

  return `<g transform="translate(${cx} ${cy}) rotate(${lean}) scale(${flip} 1)">
    <ellipse cx="2" cy="${footY + 12}" rx="40" ry="11" fill="url(#ffFloor)"/>
    ${leg(-11)}${leg(11)}
    ${arm(-1, opts.armL || 'down')}${arm(1, opts.armR || 'down')}
    <rect x="${-bW / 2}" y="${bT}" width="${bW}" height="${bH}" rx="20" fill="${shirt}"/>
    <rect x="${-bW / 2}" y="${bT}" width="${bW}" height="${bH}" rx="20" fill="url(#ffVol)"/>
    <circle cx="0" cy="0" r="22" fill="${skin}"/>
    <path d="M-22 -4 Q-23 -28 0 -28 Q23 -28 22 -4 Q12 -17 0 -16 Q-12 -17 -22 -4 Z" fill="${hair}"/>
    <path d="M-22 -4 Q-23 -28 0 -28 Q23 -28 22 -4 Q12 -17 0 -16 Q-12 -17 -22 -4 Z" fill="url(#ffVol)" opacity="0.5"/>
    <circle cx="-13" cy="9" r="4.5" fill="#FF9DA8" opacity="0.5"/><circle cx="13" cy="9" r="4.5" fill="#FF9DA8" opacity="0.5"/>
    <circle cx="-7" cy="-1" r="3.1" fill="#3A2A22"/><circle cx="7" cy="-1" r="3.1" fill="#3A2A22"/>
    <circle cx="-5.8" cy="-2.2" r="1.05" fill="#fff"/><circle cx="8.2" cy="-2.2" r="1.05" fill="#fff"/>
    ${brows(face)}${tear(face)}${mouth(face)}
    <circle cx="0" cy="0" r="22" fill="url(#ffSphere)"/>
  </g>`;
}

const W = 320, H = 200;
function frame(bg, bg2, inner) {
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img">
    ${DEFS}
    <rect width="${W}" height="${H}" rx="20" fill="${bg}"/>
    <rect width="${W}" height="${H}" rx="20" fill="url(#ffBack)"/>
    <ellipse cx="${W / 2}" cy="208" rx="220" ry="48" fill="${bg2}"/>
    ${inner}
  </svg>`;
}

// props with a little shading
const truck = (x, y) => `<g transform="translate(${x} ${y})">
  <ellipse cx="2" cy="16" rx="26" ry="6" fill="url(#ffFloor)"/>
  <rect x="-24" y="-13" width="38" height="20" rx="5" fill="#FF8C7A"/>
  <rect x="-24" y="-13" width="38" height="20" rx="5" fill="url(#ffVol)"/>
  <rect x="12" y="-7" width="15" height="14" rx="4" fill="#FFD56B"/>
  <rect x="12" y="-7" width="15" height="14" rx="4" fill="url(#ffVol)"/>
  <circle cx="-13" cy="9" r="6.5" fill="#3A3A4A"/><circle cx="18" cy="9" r="6.5" fill="#3A3A4A"/>
  <circle cx="-13" cy="9" r="2.5" fill="#9aa0ad"/><circle cx="18" cy="9" r="2.5" fill="#9aa0ad"/></g>`;
const ball = (x, y) => `<g transform="translate(${x} ${y})">
  <ellipse cx="0" cy="20" rx="18" ry="5" fill="url(#ffFloor)"/>
  <circle r="17" fill="#fff"/><circle r="17" fill="url(#ffSphere)"/>
  <path d="M-17 0 H17 M0 -17 V17" stroke="#5FB6F6" stroke-width="3"/></g>`;
const heart = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 7 C-7 -5 -20 2 0 18 C20 2 7 -5 0 7 Z" fill="#FF6B8A"/><path d="M0 7 C-7 -5 -20 2 0 18 C20 2 7 -5 0 7 Z" fill="url(#ffVol)"/></g>`;

// ---- the four situations ----
const SCENES = {
  sharing: () => frame('#FFF1CF', '#F3DFA6',
    child(106, 78, { i: 0, face: 'neutral', armR: 'hip' }) +
    truck(150, 150) +
    child(214, 78, { i: 1, face: 'worried', flip: true, armL: 'reach' })),

  pushed: () => frame('#FFE4DD', '#F6CFC6',
    `<g stroke="#E89A8C" stroke-width="3" stroke-dasharray="6 8" opacity=".7"><line x1="44" y1="150" x2="276" y2="150"/></g>` +
    child(118, 76, { i: 2, face: 'angry', lean: 12, armR: 'reach' }) +
    child(206, 84, { i: 3, face: 'worried', lean: 9, armL: 'up', armR: 'up' })),

  excluded: () => frame('#E3F0FF', '#C9DEF6',
    child(92, 80, { i: 1, face: 'big', armR: 'reach' }) +
    ball(148, 150) +
    child(178, 80, { i: 3, face: 'smile', flip: true, armL: 'reach' }) +
    child(270, 84, { i: 0, face: 'sad', flip: true, armL: 'hip' })),

  help: () => frame('#EEE8FF', '#D9CFF2',
    `<g transform="translate(232 64)">
       <ellipse cx="0" cy="44" rx="34" ry="7" fill="url(#ffFloor)"/>
       <rect x="-32" y="-32" width="64" height="22" rx="6" fill="#C3B5F2"/><rect x="-32" y="-32" width="64" height="22" rx="6" fill="url(#ffVol)"/>
       <rect x="-32" y="-6" width="64" height="22" rx="6" fill="#B3A2E8"/><rect x="-32" y="-6" width="64" height="22" rx="6" fill="url(#ffVol)"/>
       <circle cx="0" cy="-21" r="10" fill="#FFD56B"/><circle cx="0" cy="-21" r="10" fill="url(#ffSphere)"/></g>` +
    child(138, 94, { i: 2, face: 'worried', armL: 'up', armR: 'up' })),
};

// ---- outcome illustrations ----
function outcomeArt(kind) {
  if (kind === 'good') return frame('#E3F7E9', '#C6ECD2',
    heart(160, 38, 1.5) +
    child(116, 84, { i: 0, face: 'big', armR: 'reach' }) +
    child(204, 84, { i: 3, face: 'big', flip: true, armL: 'reach' }));
  return frame('#FFF4E0', '#F3E2BE', // gentle reflect — never scary
    `<g transform="translate(236 50)" opacity=".85"><circle r="17" fill="#fff"/><circle r="17" fill="url(#ffSphere)"/>
       <path d="M-6 -3 a7 7 0 1 1 6 8 v3" fill="none" stroke="#FFB36B" stroke-width="3.2" stroke-linecap="round"/>
       <circle cx="0" cy="12" r="2" fill="#FFB36B"/></g>` +
    child(150, 90, { i: 1, face: 'worried', armL: 'hip' }));
}

export function storyScene(id) { return (SCENES[id] || SCENES.sharing)(); }
export function storyOutcomeArt(good) { return outcomeArt(good ? 'good' : 'reflect'); }
