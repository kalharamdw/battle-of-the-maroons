# BATTLE OF THE MAROONS — CINEMATIC CRICKET WEB PLATFORM
### Ananda College vs Nalanda College, Colombo, Sri Lanka
*A world-class sports entertainment web platform combining the visual storytelling of Sixes Cricket with authentic century-old cricket heritage.*

---

## 1. Overview & Vision

**Battle of the Maroons** is the premier annual school cricket encounter in Sri Lanka, inaugurated in 1924 between brother institutions **Ananda College** (est. 1886) and **Nalanda College** (est. 1924). 

This platform re-imagines the traditional school sports portal into an internationally recognized, cinematic cricket digital experience. Taking creative inspiration from [Sixes Cricket](https://sixescricket.com/)—its full-viewport media, bold editorial typography, pinned scene transitions, and immersive atmosphere—while strictly adhering to the factual records, official school crests, and historical scorecards from the official source of truth, [battleofthemaroons.lk](https://battleofthemaroons.lk/).

---

## 2. Technical Stack

- **Core:** Semantic HTML5, Vanilla CSS3 (Custom design token system)
- **Scripting:** Modern ECMAScript Modules (ESM) with zero heavy framework overhead
- **Animation Engine:** [GSAP 3](https://greensock.com/gsap/) with [ScrollTrigger](https://greensock.com/scrolltrigger/) for smooth, pinned viewport scene transitions
- **Bundler & Tooling:** [Vite 5](https://vitejs.dev/) with lightning-fast HMR and optimized tree-shaken static production builds
- **Icons & Graphics:** Inline SVG icons, responsive vector crests, WebP/JPG photographic assets

---

## 3. Directory Structure

```
f:/websites/new bom/
├── index.html                   # Master application shell & mount point
├── package.json                 # Dependency definitions & scripts
├── vite.config.js               # Vite configuration (server & build options)
├── README.md                    # Project documentation & operational guide
├── public/
│   └── assets/
│       ├── images/
│       │   ├── branding/        # Official badges, flags, centenary banners
│       │   ├── schools/         # Official vector SVG & high-res crests
│       │   ├── hero/            # High-resolution cinematic scenes & posters
│       │   ├── matches/         # Matchday action, scorecards, trophy shots
│       │   ├── teams/           # Squad photographs & captain portraits
│       │   ├── history/         # Archival photographs & centenary graphics
│       │   ├── news/            # Editorial match reports & announcements
│       │   ├── gallery/         # Papare, cheer, crowd, and action imagery
│       │   ├── sponsors/        # Corporate partner logos (Dialog, Singer, etc.)
│       │   └── ui/              # UI badges and graphical assets
│       └── videos/
│           ├── hero/            # Main opening cinematic MP4s
│           ├── scenes/          # Scene-specific background video loops
│           └── posters/         # High-resolution poster fallbacks
└── src/
    ├── main.js                  # Application entry point & route bootstrapping
    ├── router.js                # Hash-based client-side router with route titles
    ├── styles/
    │   ├── base.css             # Design tokens, color palette, typography
    │   ├── loading-screen.css   # Full-screen atmospheric cricket stadium & banners
    │   ├── navigation.css       # Sixes-inspired sticky blur masthead & drawer
    │   ├── home.css             # Hero & home sections layout
    │   ├── scenes.css           # 8-scene cinematic scroll sequence
    │   ├── components.css       # Scorecards, tables, countdown, tickets, modals
    │   ├── pages.css            # Subpage editorial layouts (News, History, etc.)
    │   ├── animations.css       # Keyframes, hover interactions & micro-motion
    │   └── responsive.css       # Breakpoints: Ultra-wide down to 390px mobile
    ├── components/
    │   ├── loading-screen.js    # Cinematic ball & bat confrontation & heraldic flags
    │   ├── navigation.js        # Dynamic masthead, active route indicators, drawer
    │   ├── countdown.js         # Real-time ticker with pending state & demo toggle
    │   ├── video-scene.js       # HTML5 video engine with poster fallback & audio toggle
    │   ├── gallery.js           # Categorized photo grid with lazy loading
    │   ├── lightbox.js          # Accessible keyboard & touch lightbox modal
    │   ├── ticket-widget.js     # Non-transactional enclosure & tier selector
    │   ├── contact-form.js      # Client-side form validation with visual feedback
    │   └── footer.js            # Dual crests, quick links & committee credits
    ├── pages/
    │   ├── home.js              # Full 8-scene cinematic homepage experience
    │   ├── about.js             # "The Battle" origins, Olcott legacy & traditions
    │   ├── match-centre.js      # 3-Day & 1-Day scorecards, awards, toss details
    │   ├── history.js           # 1924–2026 chronology, records, centurions, 99 club
    │   ├── teams.js             # Dual rosters, leadership & Legends Hall of Fame
    │   ├── news.js              # Full editorial articles & official notices
    │   ├── gallery.js           # Categorized photo gallery with lightbox modal
    │   ├── sponsors.js          # Tiered partnership directory & brand guidelines
    │   ├── ticketing.js         # Interactive enclosure booking prototype
    │   └── contact.js           # Official contact info, map info & message form
    └── data/
        ├── event.config.js      # Event dates, venue, match format & status
        ├── videos.config.js     # Video sources, poster fallbacks & captions
        ├── assets.manifest.js   # 49+ tracked assets with provenance
        ├── history.js           # Chronology, stats, centurions, bowling feats
        ├── matches.js           # Detailed innings scorecards & awards
        ├── teams.js             # Squads, captains & international legends
        ├── news.js              # Full article texts & publication dates
        ├── gallery.js           # Photo items with tags and captions
        └── sponsors.js          # Tiered sponsor definitions
```

---

## 4. Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Installation
Clone or navigate to the workspace directory:
```bash
cd "f:/websites/new bom"
npm install
```

### Development Server
Run the local Vite development server with instant Hot Module Replacement:
```bash
npm run dev
```
Open your browser at `http://localhost:3000` (or the port Vite outputs in your terminal).

### Production Build
Compile and bundle the project for production:
```bash
npm run build
```
The optimized static output is generated in the `dist/` directory.

### Preview Production Build
Preview the compiled static build locally:
```bash
npm run preview
```

---

## 5. Video Scene Architecture & Media Replacement

The homepage is built on an **8-scene cinematic video engine** (`src/components/video-scene.js`). Each scene contains:
1. A full-viewport `<video>` container configured with `playsinline`, `muted`, `loop`, and `object-fit: cover`.
2. A cinematic gradient overlay preserving typography contrast.
3. An intentional, high-resolution poster fallback (`.jpg`) that renders instantly if the video is missing, loading, or restricted by autoplay policies.
4. Interactive mute/unmute audio control.
5. Stepped scene progress indicators and cinematic captions.

### Scene Sequence
- **Scene 01:** The Anticipation (`public/assets/videos/hero/opening.mp4`)
- **Scene 02:** The Rivalry (`public/assets/videos/scenes/rivalry.mp4`)
- **Scene 03:** The Cricket Action (`public/assets/videos/scenes/cricket-action.mp4`)
- **Scene 04:** The Legacy (`public/assets/videos/scenes/legacy.mp4`)
- **Scene 05:** The Numbers (`public/assets/videos/scenes/numbers.mp4`)
- **Scene 06:** Match Day (`public/assets/videos/scenes/match-day.mp4`)
- **Scene 07:** The Community (`public/assets/videos/scenes/community.mp4`)
- **Scene 08:** The Next Chapter (`public/assets/videos/scenes/next-chapter.mp4`)

### Adding Your Own Video Files
Drop your video files into the corresponding directories:
- `public/assets/videos/hero/opening.mp4`
- `public/assets/videos/scenes/cricket-action.mp4`
- (and other scenes as listed above)

To change video paths or customize captions, edit `src/data/videos.config.js`:
```javascript
export const scenesConfig = [
  {
    id: "scene-anticipation",
    sceneNumber: "01",
    label: "THE ANTICIPATION",
    title: "100+ YEARS OF CRICKET PASSION",
    videoSrc: "/assets/videos/hero/opening.mp4",
    posterSrc: "/assets/videos/posters/opening.jpg",
    ...
  }
];
```

> **Note on Fallbacks:** If a video file does not exist, the component catches the error automatically and displays the high-resolution poster frame with ambient motion. The page will never flash white or break.

---

## 6. Event Schedule & Countdown Configuration

### Date Policy (October 2026 Context)
The current local date is October 2026. The 96th Battle of the Maroons (held in Feb/Mar 2026) has already concluded. The official dates for the 97th edition have not yet been announced by the Joint Organizing Committee.

In accordance with strict factual verification requirements:
- The site does **not** display a fabricated future countdown.
- Instead, it displays an official awaiting status:
  `THE NEXT CHAPTER AWAITS — 97TH BATTLE OF THE MAROONS DATES TO BE ANNOUNCED`.
- An **Interactive Preview Mode** is built into the countdown pill so developers and stakeholders can click **"Simulate 2027 Countdown"** to test and verify the live 1-second interval ticker.

### Updating the Event Schedule
When the Joint Organizing Committee officially announces the dates, update `src/data/event.config.js`:
```javascript
export const eventConfig = {
  name: "97th Battle of the Maroons",
  edition: "97th",
  year: 2027,
  scheduleConfirmed: true, // Set to true when confirmed!
  mainMatch: {
    startDate: "2027-03-05T09:30:00+05:30",
    endDate: "2027-03-07T18:00:00+05:30",
    venue: "Sinhalese Sports Club (SSC) Grounds, Colombo"
  },
  oneDayMatch: {
    date: "2027-03-14T09:30:00+05:30",
    venue: "Sinhalese Sports Club (SSC) Grounds, Colombo"
  },
  ticketing: {
    status: "available", // "pending" | "available" | "sold_out"
    salesUrl: "#/ticketing"
  }
};
```
Once `scheduleConfirmed: true` and the start date is in the future, the countdown will automatically count down live:
`DAYS : HOURS : MINUTES : SECONDS`.

---

## 7. Subpages & Content Overview

1. **The Battle / About (`#/about`):** Detailed narrative of Colonel Henry Steele Olcott, Venerable Mohottiwatte Gunananda Thero, the 1924 founding by P. de S. Kularatne, and the brotherly rivalry traditions.
2. **Match Centre (`#/match-centre`):** Comprehensive scorecards for the 95th 3-day encounter and 48th 50-over match with innings breakdown, fall of wickets, bowling figures, and awards.
3. **Historical Records (`#/history`):** Complete head-to-head stats (Ananda 12 wins, Nalanda 7 wins, 76 draws), 30+ centurions, 99 club members, record bowling feats, and family dynasties (Warnapura, Ranatunga, Jayawardena, Wettimuni).
4. **Teams (`#/teams`):** Verified rosters, player roles, team leadership, and the Joint Hall of Fame (Sri Lanka captains Arjuna Ranatunga, Bandula Warnapura, Mahela Jayawardena, and Test legends).
5. **News & Media (`#/news`):** Full-text editorial reports, historical centenary chronicles, and official Joint Committee public notices.
6. **Gallery & Lightbox (`#/gallery`):** 5-category photo gallery with live filtering and a full-screen lightbox modal with keyboard navigation (Esc, Left, Right).
7. **Sponsors & Partners (`#/sponsors`):** Tiered corporate directory (Platinum, Gold, Official Partners, Media Sponsors).
8. **Ticketing Enclosure Selector (`#/ticketing`):** Interactive enclosure booking interface (Grandstand, Member Pavilion, Corporate Marquee, Papare Tent) with live LKR calculations and non-transactional disclaimers.
9. **Contact & Accreditation (`#/contact`):** Verified contact directory for Joint Committee secretariats, media accreditation guidelines, and client-validated feedback form.

---

## 8. Future Backend & API Integration

The frontend architecture uses centralized JavaScript data modules (`src/data/*.js`) serving as clear data access contracts:

```
[UI Components & Pages]
          ▲
          │
[src/data/*.js (Mock Data Contracts)] ──▶ Future: Replace with fetch() / Axios
          ▲
          │
[REST / GraphQL Backend API]
```

### Integration Points:
- **Live Scoring:** In `src/pages/match-centre.js`, replace `matchCentreData` with an SSE (Server-Sent Events) or WebSocket stream from the official scorers.
- **Ticketing / Payment Gateway:** In `src/components/ticket-widget.js`, wire the `handleCheckout()` callback to your payment gateway (e.g., PayHere, Stripe, IPG).
- **Contact Form Submission:** In `src/components/contact-form.js`, replace the client-side validation timeout with `POST /api/contact`.

---

## 9. Verification & Quality Control

- **Clean Static Production Build:** `npm run build` succeeds in ~1.6 seconds with zero lint or runtime syntax warnings.
- **Responsive Layouts:** Tested across desktop (1920x1080), laptop (1440x900), tablet (768x1024), and mobile viewport (390x844).
- **Reduced Motion Support:** `@media (prefers-reduced-motion: reduce)` disables heavy GSAP scroll pinning and complex animations while preserving smooth content readability.
- **Accessibility:** Semantic HTML tags, visible focus states, ARIA roles for lightbox and mobile drawer dialogs.

---

*Battle of the Maroons Joint Committee — Ananda College Old Boys' Association & Nalanda College Old Boys' Association.*
