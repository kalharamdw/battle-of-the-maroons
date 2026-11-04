/**
 * BATTLE OF THE MAROONS — PRODUCTION SVG ICON LIBRARY
 * 
 * Crisp, professional, lightweight vector SVG icons.
 * Replaces all raw Unicode system emojis with bespoke sports & tournament iconography.
 */

function svg(paths, cls = '', size = null, extraAttr = '') {
  const sizeAttr = size ? `width="${size}" height="${size}"` : '';
  const classAttr = cls ? `class="svg-icon ${cls}"` : 'class="svg-icon"';
  return `<svg ${classAttr} ${sizeAttr} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extraAttr}>${paths}</svg>`;
}

export const Icons = {
  // Home (replaces 🏠)
  home: (cls = '', size = null) => svg(
    `<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`,
    cls, size
  ),

  // Flight / Overseas Alumni (replaces ✈️)
  plane: (cls = '', size = null) => svg(
    `<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>`,
    cls, size
  ),

  // Papare Music Horn (replaces 🎺)
  trumpet: (cls = '', size = null) => svg(
    `<path d="M3 13v-2a1 1 0 0 1 1-1h4l6-3.5v9L8 12H4a1 1 0 0 1-1-1z"/><path d="M17 7c2 1.5 3 3 3 5s-1 3.5-3 5"/><path d="M14 9.5c1 .5 1.5 1.2 1.5 2.5s-.5 2-1.5 2.5"/>`,
    cls, size
  ),

  // Brotherhood & Partnership (replaces 🤝)
  handshake: (cls = '', size = null) => svg(
    `<path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.3-4.3a1 1 0 0 0 0-1.4l-2-2"/><path d="m18 10 3-3a1 1 0 0 0 0-1.4l-2.6-2.6a1 1 0 0 0-1.4 0L14 6"/><path d="m2 14 3.3 3.3a1 1 0 0 0 1.4 0L11 13"/><path d="m7 9 4.3-4.3a1 1 0 0 1 1.4 0l2.6 2.6a1 1 0 0 1 0 1.4L12 12"/><path d="M2 10h4l3 3"/>`,
    cls, size
  ),

  // Passes & Ticketing (replaces 🎟️)
  ticket: (cls = '', size = null) => svg(
    `<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>`,
    cls, size
  ),

  // Championship Trophy (replaces 🏆)
  trophy: (cls = '', size = null) => svg(
    `<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>`,
    cls, size
  ),

  // Date / Schedule (replaces 📅)
  calendar: (cls = '', size = null) => svg(
    `<rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>`,
    cls, size
  ),

  // Venue Pin (replaces 📍)
  mapPin: (cls = '', size = null) => svg(
    `<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>`,
    cls, size
  ),

  // Flame / Fire (replaces 🔥)
  flame: (cls = '', size = null) => svg(
    `<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>`,
    cls, size
  ),

  // Sparkle / Tradition (replaces ✦)
  sparkle: (cls = '', size = null) => svg(
    `<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/>`,
    cls, size
  ),

  // Star / Featured (replaces ★)
  star: (cls = '', size = null) => svg(
    `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>`,
    cls, size
  ),

  // Cricket Bat & Ball (replaces 🏏)
  cricket: (cls = '', size = null) => svg(
    `<circle cx="18" cy="6" r="2.5"/><path d="m13.5 10.5-9.5 9.5a1.5 1.5 0 0 1-2.12-2.12l9.5-9.5"/><path d="m9.5 14.5 4-4"/><path d="m3 21 2.5-2.5"/>`,
    cls, size
  ),

  // Audio Off (replaces 🔈)
  volumeX: (cls = '', size = null) => svg(
    `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/>`,
    cls, size
  ),

  // Audio On (replaces 🔊)
  volume2: (cls = '', size = null) => svg(
    `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>`,
    cls, size
  ),

  // Camera / Gallery Photo (replaces 📸 / 📷 / 🖼️)
  camera: (cls = '', size = null) => svg(
    `<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>`,
    cls, size
  ),

  // Search / Zoom (replaces 🔍)
  search: (cls = '', size = null) => svg(
    `<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>`,
    cls, size
  ),

  // Phone (replaces 📞)
  phone: (cls = '', size = null) => svg(
    `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>`,
    cls, size
  ),

  // Mail / Envelope (replaces ✉️ / 📧)
  mail: (cls = '', size = null) => svg(
    `<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>`,
    cls, size
  ),

  // Stadium / Arena / Pavilion (replaces 🏟️ / 🏛️)
  stadium: (cls = '', size = null) => svg(
    `<path d="M2 15c0-4 4-8 10-8s10 4 10 8"/><ellipse cx="12" cy="15" rx="10" ry="5"/><path d="M6 10V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/><circle cx="12" cy="15" r="2"/>`,
    cls, size
  ),

  // Global / World Network (replaces 🌏 / 🌐 / 🦘 / 🇬🇧)
  globe: (cls = '', size = null) => svg(
    `<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>`,
    cls, size
  ),

  // Match Coin Toss (replaces 🪙)
  coin: (cls = '', size = null) => svg(
    `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="6"/><path d="M12 8v8"/><path d="M9.5 10.5h5"/>`,
    cls, size
  ),

  // Format Lightning (replaces ⚡)
  bolt: (cls = '', size = null) => svg(
    `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>`,
    cls, size
  ),

  // Author Pen / Edit (replaces ✍️ / ✏️)
  edit: (cls = '', size = null) => svg(
    `<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>`,
    cls, size
  ),

  // Replay Intro (replaces 🎬)
  replay: (cls = '', size = null) => svg(
    `<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><polygon points="10 9 15 12 10 15 10 9" fill="currentColor"/>`,
    cls, size
  ),

  // Check / Verified (replaces ✓)
  check: (cls = '', size = null) => svg(
    `<polyline points="20 6 9 17 4 12"/>`,
    cls, size
  ),

  // Print (replaces 🖨️)
  print: (cls = '', size = null) => svg(
    `<polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>`,
    cls, size
  ),

  // Download / Save (replaces 💾)
  download: (cls = '', size = null) => svg(
    `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>`,
    cls, size
  ),

  // Credit Card (replaces 💳)
  creditCard: (cls = '', size = null) => svg(
    `<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>`,
    cls, size
  ),

  // Security Lock (replaces 🔒)
  lock: (cls = '', size = null) => svg(
    `<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
    cls, size
  ),

  // Demo Flask / Instant (replaces 🧪)
  flask: (cls = '', size = null) => svg(
    `<path d="M10 2v7.31L4.62 18.28A2 2 0 0 0 6.34 21h11.32a2 2 0 0 0 1.72-2.72L14 9.31V2"/><line x1="8.5" x2="15.5" y1="2" y2="2"/><line x1="14" x2="14" y1="9.31"/>`,
    cls, size
  ),

  // Teams / Users (replaces 👥 / 👤)
  users: (cls = '', size = null) => svg(
    `<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
    cls, size
  ),

  // News (replaces 📰)
  newspaper: (cls = '', size = null) => svg(
    `<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/>`,
    cls, size
  ),

  // Trash (replaces 🗑️)
  trash: (cls = '', size = null) => svg(
    `<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>`,
    cls, size
  ),

  // Refresh (replaces 🔄)
  refresh: (cls = '', size = null) => svg(
    `<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/>`,
    cls, size
  ),

  // Plus / Add (replaces ➕)
  plus: (cls = '', size = null) => svg(
    `<line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/>`,
    cls, size
  ),

  // Close (replaces ✕)
  close: (cls = '', size = null) => svg(
    `<line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/>`,
    cls, size
  ),

  // Key / Credentials (replaces 🔑)
  key: (cls = '', size = null) => svg(
    `<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>`,
    cls, size
  ),

  // Folder (replaces 📁)
  folder: (cls = '', size = null) => svg(
    `<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>`,
    cls, size
  ),

  // Warning (replaces ⚠️)
  alert: (cls = '', size = null) => svg(
    `<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/>`,
    cls, size
  ),

  // Single User / Admin (replaces 👤)
  user: (cls = '', size = null) => svg(
    `<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>`,
    cls, size
  ),

  // Eye / View Live / Inspect (replaces 👁️)
  eye: (cls = '', size = null) => svg(
    `<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>`,
    cls, size
  ),

  // Log Out (replaces 🚪)
  logOut: (cls = '', size = null) => svg(
    `<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>`,
    cls, size
  ),

  // Chart / Metrics (replaces 📊)
  chart: (cls = '', size = null) => svg(
    `<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>`,
    cls, size
  ),

  // Clipboard / Orders (replaces 📋)
  clipboard: (cls = '', size = null) => svg(
    `<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6"/><path d="M9 16h6"/>`,
    cls, size
  ),

  // Inbox / Messages (replaces 📬)
  inbox: (cls = '', size = null) => svg(
    `<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>`,
    cls, size
  ),

  // Shield / Crest (Ananda Crest)
  shield: (cls = '', size = null) => svg(
    `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
    cls, size
  ),

  // Sun / Radiance (Nalanda Crest, replaces ☀️)
  sun: (cls = '', size = null) => svg(
    `<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>`,
    cls, size
  ),

  // External Link (replaces ↗)
  externalLink: (cls = '', size = null) => svg(
    `<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/>`,
    cls, size
  ),

  // Clock / Countdown (replaces ⏳ / ⏱️)
  clock: (cls = '', size = null) => svg(
    `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>`,
    cls, size
  )
};
