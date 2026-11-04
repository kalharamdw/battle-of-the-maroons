/**
 * BATTLE OF THE MAROONS — HOMEPAGE
 * 
 * 8-Scene Cinematic Scroll Experience inspired by Sixes Cricket +
 * Authentic Sri Lankan Cricket Heritage and verified content.
 */

import { videoScenesConfig } from '../data/videos.config.js';
import { createVideoScene } from '../components/video-scene.js';
import { renderCountdownComponent } from '../components/countdown.js';
import { createTicketWidget } from '../components/ticket-widget.js';
import { sponsorsData } from '../data/sponsors.js';
import { api } from '../services/api.js';
import { refreshScrollAnimations } from '../utils/scroll-animations.js';
import { createHeritageSpheresSection, initHeritageScrollAnimations } from '../components/heritage-spheres.js';
import { Icons } from '../components/icons.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const homeContainersList = [
  { id: "scene-01", num: "01", name: "The Anticipation", tag: "SCENE 01" },
  { id: "scene-02", num: "02", name: "The Rivalry", tag: "SCENE 02" },
  { id: "scene-04", num: "03", name: "Cricket Heritage", tag: "SCENE 03" },
  { id: "scene-05", num: "04", name: "Records & Carnival", tag: "SCENE 04" },
  { id: "scene-08", num: "05", name: "The Next Chapter", tag: "SCENE 05" },
  { id: "home-ticketing", num: "06", name: "Match Passes", tag: "TICKETS" },
  { id: "home-sponsors", num: "07", name: "Official Partners", tag: "PARTNERS" }
];

export function renderHomePage(container) {
  container.innerHTML = `
    <!-- Cinematic Scroll Sequence (Scenes 01 to 08) -->
    <div class="cinematic-scroll-container" id="cinematic-scenes-wrapper"></div>

    <!-- Editorial Featured Sections Following the Cinematic Experience -->
    <div class="homepage-editorial-sections">
      <!-- Section: Interactive Ticket Allocation Builder -->
      <section class="page-section darker" id="home-ticketing">
        <div class="container">
          <div class="section-header-block">
            <span class="mono-tag">Match Day Access</span>
            <h2>Enclosure Passes & Match Day Planning</h2>
            <p>Configure your seating preference for the 3-day encounter or the day-night encounter under lights.</p>
          </div>

          <div id="home-ticket-widget-slot"></div>
        </div>
      </section>

      <!-- Section: Official Sponsors Marquee -->
      <section class="page-section" id="home-sponsors">
        <div class="container">
          <div class="section-header-block">
            <span class="mono-tag">Powered By Excellence</span>
            <h2>Official Partners & Sponsors</h2>
            <p>Honouring the visionary organisations partnering with the Battle of the Maroons.</p>
          </div>

          <div id="home-sponsors-container">
            <!-- Platinum Partner -->
            <div class="sponsors-tier-section">
              <div class="sponsor-tier-heading">Platinum Partner</div>
              <div class="sponsors-logos-grid">
                ${sponsorsData.platinum.map(s => `
                  <a href="${s.website}" target="_blank" rel="noopener" class="sponsor-logo-card" title="${s.name}">
                    <div class="sponsor-logo-wrap">
                      <img src="${s.logo}" alt="${s.name}" class="sponsor-logo-img" />
                    </div>
                    <div class="sponsor-card-bottom">
                      <span class="sponsor-card-name">${s.name}</span>
                    </div>
                  </a>
                `).join('')}
              </div>
            </div>

            <!-- Official Banking & Priceless Experience Partners -->
            <div class="sponsors-tier-section">
              <div class="sponsor-tier-heading">Banking & Experience Partners</div>
              <div class="sponsors-logos-grid">
                ${sponsorsData.gold.map(s => `
                  <a href="${s.website}" target="_blank" rel="noopener" class="sponsor-logo-card" title="${s.name}">
                    <div class="sponsor-logo-wrap">
                      <img src="${s.logo}" alt="${s.name}" class="sponsor-logo-img" />
                    </div>
                    <div class="sponsor-card-bottom">
                      <span class="sponsor-card-name">${s.name}</span>
                    </div>
                  </a>
                `).join('')}
              </div>
            </div>

            <!-- Official Brand Partners -->
            <div class="sponsors-tier-section">
              <div class="sponsor-tier-heading">Official Partners</div>
              <div class="sponsors-logos-grid">
                ${sponsorsData.officialPartners.map(s => `
                  <a href="${s.website}" target="_blank" rel="noopener" class="sponsor-logo-card" title="${s.name}">
                    <div class="sponsor-logo-wrap">
                      <img src="${s.logo}" alt="${s.name}" class="sponsor-logo-img" />
                    </div>
                    <div class="sponsor-card-bottom">
                      <span class="sponsor-card-name">${s.name}</span>
                    </div>
                  </a>
                `).join('')}
              </div>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="#/contact" class="btn-secondary-cinematic">
              Inquire for Corporate Sponsorship
            </a>
          </div>
        </div>
      </section>
    </div>
  `;

  // Mount the 8 cinematic scenes
  const scenesWrapper = container.querySelector('#cinematic-scenes-wrapper');
  videoScenesConfig.forEach((sceneConfig, i) => {
    const sceneEl = createVideoScene(sceneConfig, i, videoScenesConfig.length);
    scenesWrapper.appendChild(sceneEl);

    // Ingest custom slots
    injectCustomSceneContent(sceneEl, sceneConfig.id);
  });

  // Mount Ticket Widget into editorial slot
  const homeTicketSlot = container.querySelector('#home-ticket-widget-slot');
  if (homeTicketSlot) {
    homeTicketSlot.appendChild(createTicketWidget());
  }

  // Setup GSAP scene transitions and indicator synchronization
  initCinematicSceneTransitions(container);

  // Live Sponsors on Homepage
  function renderLiveSponsors(sp) {
    const el = container.querySelector('#home-sponsors-container');
    if (!el) return;
    const platinums = (sp.platinum || []).filter(s => s.isActive !== false);
    const golds = (sp.gold || []).filter(s => s.isActive !== false);
    const partners = (sp.officialPartners || []).filter(s => s.isActive !== false);
    const media = (sp.mediaAndBroadcast || []).filter(s => s.isActive !== false);

    let html = '';
    if (platinums.length > 0) {
      html += `
        <div class="sponsors-tier-section">
          <div class="sponsor-tier-heading">Platinum Partner</div>
          <div class="sponsors-logos-grid">
            ${platinums.map(s => `
              <a href="${s.website || '#'}" target="_blank" rel="noopener" class="sponsor-logo-card" title="${s.name}">
                <div class="sponsor-logo-wrap">
                  <img src="${s.logo}" alt="${s.name}" class="sponsor-logo-img" onerror="this.onerror=null; this.src='/assets/images/sponsors/slt_mobitel.png';" />
                </div>
                <div class="sponsor-card-bottom">
                  <span class="sponsor-card-name">${s.name}</span>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }
    if (golds.length > 0) {
      html += `
        <div class="sponsors-tier-section">
          <div class="sponsor-tier-heading">Banking & Experience Partners</div>
          <div class="sponsors-logos-grid">
            ${golds.map(s => `
              <a href="${s.website || '#'}" target="_blank" rel="noopener" class="sponsor-logo-card" title="${s.name}">
                <div class="sponsor-logo-wrap">
                  <img src="${s.logo}" alt="${s.name}" class="sponsor-logo-img" onerror="this.onerror=null; this.src='/assets/images/sponsors/sampath_bank.jpg';" />
                </div>
                <div class="sponsor-card-bottom">
                  <span class="sponsor-card-name">${s.name}</span>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }
    if (partners.length > 0) {
      html += `
        <div class="sponsors-tier-section">
          <div class="sponsor-tier-heading">Official Partners</div>
          <div class="sponsors-logos-grid">
            ${partners.map(s => `
              <a href="${s.website || '#'}" target="_blank" rel="noopener" class="sponsor-logo-card" title="${s.name}">
                <div class="sponsor-logo-wrap">
                  <img src="${s.logo}" alt="${s.name}" class="sponsor-logo-img" onerror="this.onerror=null; this.src='/assets/images/sponsors/elephant_house.png';" />
                </div>
                <div class="sponsor-card-bottom">
                  <span class="sponsor-card-name">${s.name}</span>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }
    if (media.length > 0) {
      html += `
        <div class="sponsors-tier-section">
          <div class="sponsor-tier-heading">Electronic Media & Broadcast Partners</div>
          <div class="sponsors-logos-grid">
            ${media.map(s => `
              <a href="${s.website || '#'}" target="_blank" rel="noopener" class="sponsor-logo-card" title="${s.name}">
                <div class="sponsor-logo-wrap">
                  <img src="${s.logo}" alt="${s.name}" class="sponsor-logo-img" onerror="this.onerror=null; this.src='/assets/images/sponsors/sirasa_tv.png';" />
                </div>
                <div class="sponsor-card-bottom">
                  <span class="sponsor-card-name">${s.name}</span>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }
    el.innerHTML = html;
  }

  api.getSponsors().then(sp => { if (sp) { renderLiveSponsors(sp); refreshScrollAnimations(container); } }).catch(() => { });

  window.addEventListener('bom-sponsors-updated', () => {
    api.getSponsors().then(sp => { if (sp) renderLiveSponsors(sp); }).catch(() => { });
  });
}

function injectCustomSceneContent(sceneEl, sceneId) {
  const slot = sceneEl.querySelector(`[data-slot="${sceneId}"]`);
  if (!slot) return;
  const sceneConfig = videoScenesConfig.find(s => s.id === sceneId) || {};

  switch (sceneId) {
    case 'scene-01':
      slot.innerHTML = '';
      break;

    case 'scene-02':
      // The Rivalry duel cards with authentic crests
      slot.innerHTML = `
        <div class="rivalry-duel-grid">
          <!-- Ananda College Card -->
          <div class="school-card-duel ananda">
            <div class="school-crest-wrap">
              <img src="/assets/images/schools/ananda_crest.svg" alt="Ananda College Crest" class="school-crest-img" />
            </div>
            <h3 class="school-duel-name" style="color: var(--color-gold);">Ananda College</h3>
            <p class="school-duel-motto">"Appamado Amato Padam"</p>
            <div class="school-duel-stats">
              <div class="duel-stat-item">
                <span class="duel-stat-val">1886</span>
                <span class="duel-stat-lbl">Established</span>
              </div>
              <div class="duel-stat-item">
                <span class="duel-stat-val">12</span>
                <span class="duel-stat-lbl">Big Match Wins</span>
              </div>
              <div class="duel-stat-item">
                <span class="duel-stat-val">26</span>
                <span class="duel-stat-lbl">One-Day Wins</span>
              </div>
            </div>
          </div>

          <!-- VS Emblem -->
          <div class="rivalry-vs-badge">
            <div class="vs-circle">VS</div>
            <span class="vs-brotherhood-label">One Brotherhood</span>
          </div>

          <!-- Nalanda College Card -->
          <div class="school-card-duel nalanda">
            <div class="school-crest-wrap">
              <img src="/assets/images/schools/nalanda_crest.png" alt="Nalanda College Crest" class="school-crest-img" />
            </div>
            <h3 class="school-duel-name" style="color: var(--color-silver);">Nalanda College</h3>
            <p class="school-duel-motto">"Apadana Sobhini Panna"</p>
            <div class="school-duel-stats">
              <div class="duel-stat-item">
                <span class="duel-stat-val">1924</span>
                <span class="duel-stat-lbl">Established</span>
              </div>
              <div class="duel-stat-item">
                <span class="duel-stat-val">7</span>
                <span class="duel-stat-lbl">Big Match Wins</span>
              </div>
              <div class="duel-stat-item">
                <span class="duel-stat-val">15</span>
                <span class="duel-stat-lbl">One-Day Wins</span>
              </div>
            </div>
          </div>
        </div>
      `;
      break;

    case 'scene-04':
      // Scene 04: 100+ Years Cricket Heritage 3D Spheres Museum Experience
      slot.innerHTML = '';
      slot.appendChild(createHeritageSpheresSection(sceneConfig));
      break;

    case 'scene-05':
      // Scene 04: Combined Monumental Records, Match Formats & Community Carnival
      slot.innerHTML = `
        <div class="scene-04-unified-megasection">
          <!-- Top Tier: Monumental Stats -->
          <div class="numbers-stats-grid">
            <div class="number-stat-card">
              <div class="stat-counter-large">96</div>
              <div class="stat-title">Historic Editions</div>
              <div class="stat-desc">Traditional multi-day encounters played since 1924</div>
            </div>
            <div class="number-stat-card">
              <div class="stat-counter-large">55+</div>
              <div class="stat-title">Test & ODI Stars</div>
              <div class="stat-desc">International cricketers produced for Sri Lanka</div>
            </div>
            <div class="number-stat-card">
              <div class="stat-counter-large">2</div>
              <div class="stat-title">World Cup Captains</div>
              <div class="stat-desc">Arjuna Ranatunga (1996) & Mahela Jayawardena (2007)</div>
            </div>
            <div class="number-stat-card">
              <div class="stat-counter-large">149</div>
              <div class="stat-title">Record Score</div>
              <div class="stat-desc">Shantha Kalavitigoda (Nalanda 1997 all-time record)</div>
            </div>
          </div>

          <!-- Middle Tier: Match Formats & Arena Experience -->
          <div class="unified-formats-grid">
            <div class="match-format-box">
              <span class="match-format-tag">Traditional 3-Day Test</span>
              <h3 class="match-format-title">The Big Match</h3>
              <div class="match-format-trophy">Dr. N. M. Perera Memorial Challenge Trophy</div>
              <ul class="match-format-details">
                <li>• Traditional red ball & cricket whites at SSC</li>
                <li>• 90 Overs of tactical cricket each day</li>
                <li>• The pinnacle of school cricket prestige</li>
              </ul>
            </div>

            <div class="match-format-box" style="border-top: 3px solid var(--color-gold);">
              <span class="match-format-tag" style="background: rgba(140, 29, 46, 0.4); color: var(--color-wool);">Historic Day-Night 50-Over</span>
              <h3 class="match-format-title">The One-Day Clash</h3>
              <div class="match-format-trophy">P. De S. Kularatne Memorial Trophy</div>
              <ul class="match-format-details">
                <li>• Under international broadcast floodlights at SSC</li>
                <li>• Coloured clothing & dynamic limited-overs pace</li>
                <li>• The loudest night festival in Colombo</li>
              </ul>
            </div>
          </div>

          <!-- Bottom Tier: Community Carnival & Papare Highlights -->
          <div class="unified-community-strip">
            <div class="community-mini-card">
              <span class="community-mini-icon">${Icons.plane('gold-accent')}</span>
              <div class="community-mini-content">
                <h4 class="community-mini-title">6 Charter Flights</h4>
                <p class="community-mini-desc">
                  SriLankan Airlines flights from London & Melbourne flown entirely by Anandian and Nalandian pilots.
                </p>
              </div>
            </div>

            <div class="community-mini-card">
              <span class="community-mini-icon">${Icons.trumpet('gold-accent')}</span>
              <div class="community-mini-content">
                <h4 class="community-mini-title">Papare & Brass Bands</h4>
                <p class="community-mini-desc">
                  Electrifying rhythms, oriental drums & student brass displaying the true festive soul of Sri Lankan sports.
                </p>
              </div>
            </div>

            <div class="community-mini-card">
              <span class="community-mini-icon">${Icons.handshake('gold-accent')}</span>
              <div class="community-mini-content">
                <h4 class="community-mini-title">Rs 25M Community Trust</h4>
                <p class="community-mini-desc">
                  Annual match proceeds gifted to both college principals to sponsor underprivileged student cricketers.
                </p>
              </div>
            </div>
          </div>
        </div>
      `;
      break;

    case 'scene-08':
      // The Next Chapter
      slot.innerHTML = `
        <div class="next-chapter-box">
          <div class="next-chapter-countdown-wrapper" id="scene-08-countdown-slot"></div>
          <div class="next-chapter-action-group">
            <a href="#/ticketing" class="btn-primary-cinematic btn-showcase-primary">
              <span class="btn-cta-icon">${Icons.ticket()}</span>
              <span>Passes & Ticketing Hub</span>
            </a>
            <a href="#/history" class="btn-secondary-cinematic btn-showcase-secondary">
              <span class="btn-cta-icon">${Icons.trophy()}</span>
              <span>Explore 100 Years of Records</span>
            </a>
          </div>
        </div>
      `;

      // Render countdown inside Scene 08
      const cdSlot = slot.querySelector('#scene-08-countdown-slot');
      if (cdSlot) {
        renderCountdownComponent(cdSlot);
      }
      break;
  }
}

function initCinematicSceneTransitions(container) {
  const scenes = container.querySelectorAll('.cinematic-scene');

  // GSAP ScrollTrigger Scene Sequence
  scenes.forEach((scene, index) => {
    const id = scene.id;
    const media = scene.querySelector('.scene-media-layer');
    const content = scene.querySelector('.scene-content');

    // 2. Parallax Media Scrubbing on scenes
    if (media && id !== 'scene-04') {
      gsap.fromTo(media,
        { yPercent: -4, scale: 1.08 },
        {
          yPercent: 4,
          scale: 1.0,
          ease: 'none',
          scrollTrigger: {
            trigger: scene,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6
          }
        }
      );
    }

    // 3. Foreground content entrance animation
    if (content) {
      gsap.fromTo(content,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: scene,
            start: 'top 68%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // 4. Stepped Captions Sequence Reveal
    const captionItems = scene.querySelectorAll('.stepped-caption-item, .stepped-caption');
    if (captionItems.length > 0) {
      gsap.fromTo(captionItems,
        { opacity: 0, y: 20, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.2,
          duration: 0.75,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: scene,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    // 5. Scene-specific kinetic reveals
    if (id === 'scene-02') {
      // Scene 02: Duel Cards Kinetic Entrance
      const anandaCard = scene.querySelector('.school-card-duel.ananda');
      const nalandaCard = scene.querySelector('.school-card-duel.nalanda');
      const vsBadge = scene.querySelector('.rivalry-vs-badge');

      if (anandaCard && nalandaCard) {
        const isMobile = window.innerWidth <= 768;
        const xOffset = isMobile ? 25 : 70;
        gsap.from(anandaCard, {
          x: -xOffset,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: scene, start: 'top 60%' }
        });

        gsap.from(nalandaCard, {
          x: xOffset,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: scene, start: 'top 60%' }
        });

        if (vsBadge) {
          gsap.from(vsBadge, {
            scale: 0.2,
            opacity: 0,
            duration: 0.8,
            delay: 0.3,
            ease: 'back.out(2)',
            scrollTrigger: { trigger: scene, start: 'top 60%' }
          });
        }
      }
    } else if (id === 'scene-04') {
      // Scene 04: 100+ Years Cricket Heritage 3D Spheres Museum Experience
      initHeritageScrollAnimations(scene);
    } else if (id === 'scene-05') {
      // Scene 04: Combined Stats Count-Up & Cards Kinetic Entrance
      const statCards = scene.querySelectorAll('.number-stat-card');
      statCards.forEach(card => {
        const counterEl = card.querySelector('.stat-counter-large');
        if (!counterEl) return;
        const targetText = counterEl.textContent.trim();
        const hasPlus = targetText.includes('+');
        const numVal = parseInt(targetText.replace(/\D/g, ''), 10) || 0;

        ScrollTrigger.create({
          trigger: scene,
          start: 'top 65%',
          once: true,
          onEnter: () => {
            const counterObj = { val: 0 };
            gsap.to(counterObj, {
              val: numVal,
              duration: 2,
              ease: 'power2.out',
              onUpdate: () => {
                counterEl.textContent = Math.floor(counterObj.val) + (hasPlus ? '+' : '');
              }
            });
          }
        });
      });

      const formatBoxes = scene.querySelectorAll('.match-format-box');
      const commCards = scene.querySelectorAll('.community-mini-card');
      if (formatBoxes.length > 0) {
        gsap.from(formatBoxes, {
          y: 28,
          opacity: 0,
          stagger: 0.15,
          duration: 0.75,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: { trigger: scene, start: 'top 55%' }
        });
      }
      if (commCards.length > 0) {
        gsap.from(commCards, {
          y: 22,
          opacity: 0,
          stagger: 0.1,
          duration: 0.65,
          ease: 'power3.out',
          clearProps: 'all',
          scrollTrigger: { trigger: scene, start: 'top 45%' }
        });
      }
    } else if (id === 'scene-08') {
      // Scene 05: The Next Chapter Countdown Box Entrance
      const nextBox = scene.querySelector('.next-chapter-box');
      if (nextBox) {
        gsap.from(nextBox, {
          scale: 0.92,
          opacity: 0,
          y: 35,
          duration: 0.9,
          ease: 'back.out(1.5)',
          scrollTrigger: { trigger: scene, start: 'top 65%' }
        });
      }
    }
  });

  // Re-trigger global scroll animations on homepage dynamic elements
  refreshScrollAnimations(container);

  // 6. Editorial Sections Reveals
  const newsGrid = container.querySelector('.news-articles-grid');
  if (newsGrid) {
    const newsCards = newsGrid.querySelectorAll('.news-card');
    gsap.from(newsCards, {
      opacity: 0,
      y: 40,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: { trigger: newsGrid, start: 'top 75%' }
    });
  }

  // 7. Scene 01 Stunning First Impression Entrance Sequence
  const scene01 = container.querySelector('#scene-01');
  if (scene01) {
    const heroMedia = scene01.querySelector('.scene-media-layer');
    const heroEyebrow = scene01.querySelector('.scene-badge-group');
    const heroTitleWords = scene01.querySelectorAll('.title-word-battle, .title-word-of, .title-word-maroons');
    const anandaPillar = scene01.querySelector('.ananda-pillar');
    const nalandaPillar = scene01.querySelector('.nalanda-pillar');
    const duelCenter = scene01.querySelector('.hero-duel-centerpiece');
    const encounterMeta = scene01.querySelector('.hero-encounter-meta');
    const heritageRibbon = scene01.querySelector('.hero-heritage-ribbon');
    const heroCtas = scene01.querySelector('.scene-01-ctas');

    const heroEntranceTl = gsap.timeline({ delay: 0.15 });

    if (heroMedia) {
      heroEntranceTl.fromTo(heroMedia,
        { scale: 1.14, filter: 'brightness(0.65)' },
        { scale: 1.0, filter: 'brightness(0.95)', duration: 1.6, ease: 'power2.out' },
        0
      );
    }

    if (heroEyebrow) {
      heroEntranceTl.fromTo(heroEyebrow,
        { opacity: 0, y: -25, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.7)' },
        0.2
      );
    }

    if (heroTitleWords.length > 0) {
      heroEntranceTl.fromTo(heroTitleWords,
        { opacity: 0, y: 35, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 1.0, ease: 'power3.out' },
        0.4
      );
    }

    if (anandaPillar && nalandaPillar) {
      heroEntranceTl.fromTo(anandaPillar,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out' },
        0.7
      );
      heroEntranceTl.fromTo(nalandaPillar,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 0.85, ease: 'power3.out' },
        0.7
      );
      if (duelCenter) {
        heroEntranceTl.fromTo(duelCenter,
          { opacity: 0, scale: 0.2 },
          { opacity: 1, scale: 1, duration: 0.65, ease: 'back.out(2.2)' },
          0.8
        );
      }
    }

    if (encounterMeta) {
      heroEntranceTl.fromTo(encounterMeta,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        0.95
      );
    }

    if (heritageRibbon) {
      heroEntranceTl.fromTo(heritageRibbon,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        1.05
      );
    }

    if (heroCtas) {
      heroEntranceTl.fromTo(heroCtas.children,
        { opacity: 0, y: 22, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.14, duration: 0.8, ease: 'back.out(1.5)' },
        1.15
      );
    }
  }
}
