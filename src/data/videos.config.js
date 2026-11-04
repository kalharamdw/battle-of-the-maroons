/**
 * BATTLE OF THE MAROONS — CINEMATIC VIDEO & SCENE CONFIGURATION
 * 
 * Defines the video sources, high-resolution poster fallbacks, stepped captions,
 * and transition attributes for all 8 cinematic scroll scenes.
 * 
 * Video files will be supplied by the user to:
 * - public/assets/videos/hero/
 * - public/assets/videos/scenes/
 * 
 * Fallback mechanism:
 * If a video file fails to load or does not exist, the component seamlessly
 * activates the styled poster frame with subtle atmospheric motion so the user
 * never sees a blank screen or broken media icon.
 */
import { Icons } from '../components/icons.js';

export const videoScenesConfig = [
  {
    id: "scene-01",
    sceneNumber: "01",
    name: "The Anticipation",
    tagline: "A CENTURY OF BROTHERHOOD & PASSION",
    title: "",
    titleHTML: "",
    subheading: "ANANDA VS NALANDA — COLOMBO, SRI LANKA",
    subheadingHTML: "",
    steppedCaptions: [],
    steppedCaptionsHTML: '', // Cleared in hero scene so video background remains unobstructed
    videoSrc: "/assets/videos/hero/opening.mp4",
    posterSrc: "/assets/videos/posters/opening.jpg",
    preload: "auto", // Preload only the hero video
    overlayOpacity: 0.38,
    soundAvailable: true,
    ambientAudioNote: "Crowd roar & trumpet fanfare"
  },
  {
    id: "scene-02",
    sceneNumber: "02",
    name: "The Rivalry",
    tagline: "BORN FROM THE SAME SOIL",
    title: "TWO SISTER SCHOOLS. ONE MAROON SPIRIT.",
    subheading: "Ananda College (Est. 1886) • Nalanda College (Est. 1924)",
    steppedCaptions: [
      "Founded by visionaries to foster national pride.",
      "Maroon & Gold versus Maroon & Silver.",
      "Fierce in competition, inseparable in brotherhood."
    ],
    videoSrc: "/assets/videos/scenes/rivalry.mp4",
    posterSrc: "/assets/videos/posters/rivalry.jpg",
    preload: "auto",
    overlayOpacity: 0.7,
    soundAvailable: false
  },
  {
    id: "scene-04",
    sceneNumber: "03",
    name: "The Legacy",
    tagline: "INCEPTION 1924",
    title: "OVER 100 YEARS OF CRICKETING HERITAGE",
    subheading: "From Dr. N.M. Perera and P. de S. Kularatne to Modern Era Titans",
    steppedCaptions: [
      "First played in 1924 on the grounds of Colombo.",
      "Cradle of Sri Lankan test and world cricket.",
      "Where leaders, champions, and legends are forged."
    ],
    videoSrc: "/assets/videos/scenes/legacy.mp4",
    posterSrc: "/assets/videos/posters/legacy.jpg",
    preload: "auto",
    overlayOpacity: 0.72,
    soundAvailable: false
  },
  {
    id: "scene-05",
    sceneNumber: "04",
    name: "Records, Formats & Carnival",
    tagline: "MONUMENTAL RECORDS & MATCH DAY CARNIVAL",
    title: "A CENTURY OF CRICKET GLORY, ARENA & CARNIVAL",
    subheading: "Traditional 3-Day Test • Day-Night One Day Clash • 96 Historic Encounters",
    steppedCaptions: [],
    steppedCaptionsHTML: '',
    videoSrc: "/assets/videos/scenes/match-day.mp4",
    posterSrc: "/assets/videos/posters/match-day.jpg",
    preload: "auto",
    overlayOpacity: 0.72,
    soundAvailable: false
  },
  {
    id: "scene-08",
    sceneNumber: "05",
    name: "The Next Chapter",
    tagline: "THE STORY CONTINUES",
    title: "BE THERE TO WITNESS HISTORY",
    subheading: "Prepare for the 97th Battle of the Maroons",
    steppedCaptions: [],
    steppedCaptionsHTML: `
      <div class="next-chapter-credo-strip">
        <span class="credo-pill">
          <span class="credo-icon">${Icons.sparkle('gold-accent')}</span>
          <span class="credo-text">A Tradition Unbroken</span>
        </span>
        <span class="credo-divider">•</span>
        <span class="credo-pill">
          <span class="credo-icon">${Icons.flame('gold-accent')}</span>
          <span class="credo-text">A Flame Burning Brighter</span>
        </span>
        <span class="credo-divider">•</span>
        <span class="credo-pill">
          <span class="credo-icon">${Icons.trophy('gold-accent')}</span>
          <span class="credo-text">Secure Your Place In Cricket History</span>
        </span>
      </div>
    `,
    customMediaHTML: `
      <div class="next-chapter-ambient-backdrop">
        <!-- Dual Half Shades: Ananda Maroon Left Half & Nalanda Gold Right Half -->
        <div class="ambient-school-half half-ananda-shade" aria-hidden="true"></div>
        <div class="ambient-school-half half-nalanda-shade" aria-hidden="true"></div>

        <div class="ambient-spotlight ananda-spotlight"></div>
        <div class="ambient-spotlight nalanda-spotlight"></div>
        <div class="ambient-spotlight center-pitch-spotlight"></div>

        <!-- Left Location: Ananda College School Symbol (Smooth Half Shade & Low Opacity) -->
        <div class="ambient-school-emblem zone-ananda" aria-hidden="true">
          <img src="/assets/images/schools/ananda_crest.svg" alt="Ananda College Crest" class="ambient-crest-svg" />
          <span class="ambient-emblem-caption">ANANDA COLLEGE • EST. 1886</span>
        </div>

        <!-- Right Location: Nalanda College School Symbol (Smooth Half Shade & Low Opacity) -->
        <div class="ambient-school-emblem zone-nalanda" aria-hidden="true">
          <img src="/assets/images/schools/nalanda_crest.svg" alt="Nalanda College Crest" class="ambient-crest-svg" />
          <span class="ambient-emblem-caption">NALANDA COLLEGE • EST. 1924</span>
        </div>

        <div class="ambient-particles-field" aria-hidden="true">
          <span class="atm-particle p1"></span>
          <span class="atm-particle p2"></span>
          <span class="atm-particle p3"></span>
          <span class="atm-particle p4"></span>
          <span class="atm-particle p5"></span>
          <span class="atm-particle p6"></span>
        </div>
        <div class="ambient-grid-lines" aria-hidden="true"></div>
      </div>
    `,
    videoSrc: "",
    posterSrc: "",
    preload: "none",
    overlayOpacity: 0.1,
    soundAvailable: false
  }
];

/**
 * 100+ YEARS CRICKET HERITAGE — 3D SPHERICAL VIDEOS CONFIGURATION
 * 
 * Replace or configure your 3 historical videos here:
 * - heritageVideo1: The Legends (Pioneers, early masters, timeless black & white footage)
 * - heritageVideo2: The Rivalry (100-year brotherhood, Colombo turf rivalry)
 * - heritageVideo3: The Legacy (World cup captains, papare bands, centenary traditions)
 * 
 * Target storage directory for your video files:
 * public/assets/videos/scenes/
 */
export const heritageVideosConfig = {
  heritageVideo1: {
    id: "legends",
    title: "The Legends",
    chapter: "Chapter I • 1924–1970s",
    tag: "PIONEERS & TITANS",
    subtitle: "Pioneers of Ceylon & Sri Lanka Cricket",
    description: "Vintage footage immortalizing the pioneers, master batsmen, and strike bowlers who built national cricket pride from Campbell Place and Nalanda.",
    videoSrc: "/assets/videos/scenes/heritage-legends.mp4",
    posterSrc: "/assets/images/history/4anandians.jpg",
    accentColor: "#d4af37",
    accentLabel: "Ananda & Nalanda Legends",
    era: "1924 – 1970s",
    stat: "55+ Sri Lanka Test Stars Produced"
  },
  heritageVideo2: {
    id: "rivalry",
    title: "The Rivalry",
    chapter: "Chapter II • 100-Year Brotherhood",
    tag: "THE SACRED TURF",
    subtitle: "Spirit of the Centenary Brotherly Battle",
    description: "Archival encounters on the sacred Colombo turf. Fierce in sporting competition, bound forever by shared soil and unbroken brotherhood.",
    videoSrc: "/assets/videos/scenes/heritage-rivalry.mp4",
    posterSrc: "/assets/images/history/brotherteam.jpg",
    accentColor: "#d97706",
    accentLabel: "The Brotherly Contest",
    era: "100+ Years",
    stat: "96 Historic Multi-Day Encounters"
  },
  heritageVideo3: {
    id: "legacy",
    title: "The Legacy",
    chapter: "Chapter III • Tradition & Glory",
    tag: "CENTENARY HERITAGE",
    subtitle: "Tradition, Papare, and World Champions",
    description: "Celebrations, historic assemblies, World Cup glory, and the timeless roar of the grandstands that defined generations of Sri Lankan cricket.",
    videoSrc: "/assets/videos/scenes/heritage-legacy.mp4",
    posterSrc: "/assets/images/history/1984_nalanda.jpg",
    accentColor: "#e2e8f0",
    accentLabel: "Centenary Heritage",
    era: "1996 & Beyond",
    stat: "2 World Cup Captains: Arjuna & Mahela"
  }
};

