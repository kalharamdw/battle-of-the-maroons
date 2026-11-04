/**
 * BATTLE OF THE MAROONS — CHERISHED MOMENTS PAGE
 * 
 * Source of truth: https://battleofthemaroons.lk/cherishing_memories.html
 * Archival photographs, historic team squads, and unforgettable milestones.
 */

import { cherishedMomentsData } from '../data/cherished-moments.js';

export function renderCherishedMomentsPage(container) {
  container.innerHTML = `
    <div class="page-hero">
      <div class="container">
        <span class="page-hero-eyebrow">Archival Chronicles</span>
        <h1 class="page-hero-title">Cherished Moments</h1>
        <p class="page-hero-subtitle">
          Immortal milestones, legendary World Cup squads, and cherished archival memories from over a century of Ananda and Nalanda cricket brotherhood.
        </p>
      </div>
    </div>

    <!-- Navigation jump bar -->
    <div class="cherished-jump-bar" style="background: rgba(14, 7, 10, 0.95); border-bottom: 1px solid var(--border-light); padding: 14px 0; position: sticky; top: var(--nav-height); z-index: 100; backdrop-filter: blur(10px);">
      <div class="container" style="display: flex; gap: 10px; overflow-x: auto; scrollbar-width: none; white-space: nowrap; padding: 0 16px;">
        <button type="button" class="gallery-filter-btn active" data-target="world-cup-1975">1975 World Cup</button>
        <button type="button" class="gallery-filter-btn" data-target="anura-ranasinghe-trio">Anura Ranasinghe</button>
        <button type="button" class="gallery-filter-btn" data-target="arjuna-ranatunga-early">Arjuna Ranatunga</button>
        <button type="button" class="gallery-filter-btn" data-target="wettimuni-classics">Wettimuni 190</button>
        <button type="button" class="gallery-filter-btn" data-target="arjuna-dhammika-brendon">Ananda Brother Team</button>
        <button type="button" class="gallery-filter-btn" data-target="mahanama-1984-nalanda">Mahanama 1984 Nalanda</button>
        <button type="button" class="gallery-filter-btn" data-target="international-trio-hall">World Cup Trinity</button>
        <button type="button" class="gallery-filter-btn" data-target="modern-era-titans">Modern Titans</button>
      </div>
    </div>

    <section class="page-section">
      <div class="container" style="max-width: 1100px;">

        <!-- 1. 1975 World Cup Squad -->
        <div class="cherished-entry-card" id="world-cup-1975">
          <div class="cherished-header">
            <span class="mono-tag" style="color: var(--color-gold);">Historic Milestone • 1975</span>
            <h2>Sri Lanka Squad for the Inaugural Cricket World Cup in 1975</h2>
            <p class="cherished-sub">The Dawn of Sri Lanka's International Cricket Era featuring Maroon Legends</p>
          </div>
          
          <div class="cherished-img-frame">
            <img src="/assets/images/history/sl_squad.jpg" alt="1975 World Cup Sri Lanka Squad" loading="lazy" />
          </div>

          <div class="cherished-details-box">
            <p style="font-size: 1.05rem; line-height: 1.8; color: var(--color-wool); margin-bottom: 20px;">
              Sri Lanka's historic entry into the international arena at the 1975 Prudential World Cup in England was heavily powered by the products of Ananda and Nalanda. 
              <strong>Bandula Warnapura</strong> (Nalanda), <strong>Sidath Wettimuni</strong> (Ananda), and schoolboy sensation <strong>Anura Ranasinghe</strong> (Nalanda) stood tall representing the nation.
            </p>
            <div class="roster-meta-grid">
              <div class="roster-meta-row">
                <span class="roster-label">Standing:</span>
                <span>I.R.D. Mendis, L.V. Kaluperuma, <strong style="color: var(--color-gold);">S.R. de S. Wettimuny (Ananda)</strong>, A.R.M. Opatha, H.S.M. Pieris, G.R.A. de Silva, D.S. de Silva, D.R. Chanmugan, <strong style="color: var(--color-silver);">A.N. Ranasinghe (Nalanda)</strong>, <strong style="color: var(--color-silver);">Bandula Warnapura (Nalanda)</strong>.</span>
              </div>
              <div class="roster-meta-row">
                <span class="roster-label">Seated:</span>
                <span>R.D. Heyn, A.P.B. Tennekoon (Captain), Mr. K. Perera (Manager), M.H. Tissera, E.R. Fernando.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Anura Ranasinghe Trio -->
        <div class="cherished-entry-card" id="anura-ranasinghe-trio">
          <div class="cherished-header">
            <span class="mono-tag" style="color: var(--color-silver);">Schoolboy Prodigy • Nalanda College</span>
            <h2>Anura Ranasinghe — Facing Roberts & Holder (1975)</h2>
            <p class="cherished-sub">Fearless Hook Shots against the Fearsome West Indian Fast Bowling Battery</p>
          </div>

          <div class="cherished-grid-3">
            <div class="cherished-sub-card">
              <div class="cherished-img-frame aspect-tall">
                <img src="/assets/images/history/anura1.jpg" alt="Anura facing Andy Roberts" loading="lazy" />
              </div>
              <p class="cherished-caption">A No Ball! And he hooks to the boundary. Anura facing Andy Roberts in the 1st Test match vs West Indies.</p>
            </div>

            <div class="cherished-sub-card">
              <div class="cherished-img-frame aspect-tall">
                <img src="/assets/images/history/anura.jpg" alt="Anura Ranasinghe 1975" loading="lazy" />
              </div>
              <p class="cherished-caption">The Schoolboy cricketer in the Sri Lankan team in action against the West Indies in 1975.</p>
            </div>

            <div class="cherished-sub-card">
              <div class="cherished-img-frame aspect-tall">
                <img src="/assets/images/history/anura2.jpg" alt="Anura surprises Holder" loading="lazy" />
              </div>
              <p class="cherished-caption">Anura surprises Vanburn Holder in the 2nd Test match vs West Indies.</p>
            </div>
          </div>
        </div>

        <!-- 3. Arjuna Ranatunga Early Milestones -->
        <div class="cherished-entry-card" id="arjuna-ranatunga-early">
          <div class="cherished-header">
            <span class="mono-tag" style="color: var(--color-gold);">Inaugural Test Hero • Ananda College</span>
            <h2>Arjuna Ranatunga — 1982 First Test Boundary & 1983 Honors</h2>
            <p class="cherished-sub">From 18-Year-Old Schoolboy to National Cricket Vanguard</p>
          </div>

          <div class="cherished-grid-2">
            <div class="cherished-sub-card">
              <div class="cherished-img-frame">
                <img src="/assets/images/history/arjuna1983.jpg" alt="Arjuna Ranatunga 1983" loading="lazy" />
              </div>
              <p class="cherished-caption">The Most Outstanding Sportsman in Sri Lanka for the year 1983.</p>
            </div>

            <div class="cherished-sub-card">
              <div class="cherished-img-frame">
                <img src="/assets/images/history/arjuna_paul.jpg" alt="Arjuna boundaries Paul Allott" loading="lazy" />
              </div>
              <p class="cherished-caption">Arjuna sends Paul Allott to the boundary on Sri Lanka's first ever Test against England in February 1982.</p>
            </div>
          </div>
        </div>

        <!-- 4. Wettimuni Classics -->
        <div class="cherished-entry-card" id="wettimuni-classics">
          <div class="cherished-header">
            <span class="mono-tag" style="color: var(--color-gold);">Test Masterclass • 1984</span>
            <h2>Wettimuni Classics — Historic Lord's Marathon</h2>
            <p class="cherished-sub">Sidath Wettimuni's Monumental 190 at the Home of Cricket</p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1.4fr; gap: 36px; align-items: center;" class="responsive-reverse-grid">
            <div class="cherished-img-frame">
              <img src="/assets/images/history/wettimuni_clasics.jpg" alt="Sidath Wettimuni Classics" loading="lazy" />
            </div>
            <div>
              <p style="font-size: 1.1rem; line-height: 1.8; color: var(--color-wool); margin-bottom: 16px;">
                In August 1984, Anandian <strong>Sidath Wettimuni</strong> etched his name forever into cricket immortality. Facing England's pace attack at Lord's, he batted for <strong>642 minutes across 11 hours</strong> to compile 190 runs — the first Test century by a Sri Lankan at Lord's.
              </p>
              <div style="border-left: 3px solid var(--color-gold); padding-left: 16px; font-style: italic; color: var(--color-wool-muted);">
                "A display of classical defensive patience, supreme temperament, and wristy oriental elegance."
              </div>
            </div>
          </div>
        </div>

        <!-- 5. Arjuna, Dhammika & Brendon Team -->
        <div class="cherished-entry-card" id="arjuna-dhammika-brendon">
          <div class="cherished-header">
            <span class="mono-tag" style="color: var(--color-gold);">Ananda First XI • Golden Era</span>
            <h2>Arjuna, Dhammika & Brendon Kuruppu in the Same Ananda XI</h2>
            <p class="cherished-sub">The Brotherly Ranatunga Dynasty and Future Test Double-Centurion Together</p>
          </div>

          <div class="cherished-img-frame">
            <img src="/assets/images/history/brotherteam.jpg" alt="Ananda College Team with Ranatunga Brothers and Kuruppu" loading="lazy" />
          </div>

          <div class="cherished-details-box">
            <p style="font-size: 1.05rem; line-height: 1.8; color: var(--color-wool); margin-bottom: 20px;">
              A matchless school lineup where <strong>Arjuna Ranatunga</strong>, his elder brother <strong>Dhammika Ranatunga</strong>, and <strong>Brendon Kuruppu</strong> (who later made a record 201* on Test debut) shared the Maroon & Gold cap for Ananda.
            </p>
            <div class="roster-meta-grid">
              <div class="roster-meta-row">
                <span class="roster-label">Seated (L to R):</span>
                <span><strong>Brendon Kuruppu</strong>, Senanka Ekanayake, Prasanna Amarasinghe, Gihan Karunaratne (Captain), Chanaka Ekanayake, Rohitha Perera, Lalith Hewawitharana.</span>
              </div>
              <div class="roster-meta-row">
                <span class="roster-label">Standing (L to R):</span>
                <span>Deepal Dharmasekara, Hemakantha Ekanayake, Adel Hashim, Niran Ranatunge, Kamal Dharmasiri, Upul Samarakoon, <strong>Dhammika Ranatunge</strong>, Charith Senanayake, <strong>Arjuna Ranatunge</strong>.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 6. Mahanama 1984 Nalanda Team -->
        <div class="cherished-entry-card" id="mahanama-1984-nalanda">
          <div class="cherished-header">
            <span class="mono-tag" style="color: var(--color-silver);">Nalanda First XI • 1984</span>
            <h2>Roshan Mahanama — Best Ever Outfielder Leading Nalanda (1984)</h2>
            <p class="cherished-sub">Captain Mahanama with 1996 World Cup Match-Winner Asanka Gurusinghe</p>
          </div>

          <div class="cherished-img-frame">
            <img src="/assets/images/history/1984_nalanda.jpg" alt="Nalanda 1984 Team" loading="lazy" />
          </div>

          <div class="cherished-details-box">
            <p style="font-size: 1.05rem; line-height: 1.8; color: var(--color-wool); margin-bottom: 20px;">
              Led by the peerless <strong>Roshan Mahanama</strong> with vice-captain Sanduna Kapugekiyana and future World Cup final hero <strong>Asanka Gurusinghe</strong>, this 1984 Nalanda squad set standards for aggressive fielding and clinical batting.
            </p>
            <div class="roster-meta-grid">
              <div class="roster-meta-row">
                <span class="roster-label">Seated (L to R):</span>
                <span>Ajith Jayasinghe, <strong>Asanka Gurusinghe</strong>, Sanduna Kapugekiyana (V. Captain), <strong>Roshan Mahanama (Captain)</strong>, Priya De Mel, Imal Boteju, Gamini Wickramasinghe.</span>
              </div>
              <div class="roster-meta-row">
                <span class="roster-label">Standing (L to R):</span>
                <span>Disnaka Weeraratne, Kushantha Dissanayake, Jayanath Saram, Asanka Nanayakkara, Nihal Pathirage, Sudarman De Silva, Sunanda Wickramasooriya, Namal Mendis, Seneke Senanayake, Migara Perera and Sanath De Silva (Absent).</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 7. Anuruddha Polonnowita & Four Anandians in Australia -->
        <div class="cherished-grid-2" style="margin-bottom: 50px;">
          <div class="cherished-entry-card" style="margin-bottom: 0;">
            <div class="cherished-header">
              <span class="mono-tag" style="color: var(--color-gold);">The Guru Behind Legends</span>
              <h3 style="font-size: 1.6rem; color: var(--color-wool); margin: 8px 0;">Anuruddha Polonnowita</h3>
              <p class="cherished-sub">Ananda Coach with his Senior Players</p>
            </div>
            <div class="cherished-img-frame">
              <img src="/assets/images/history/teampolonvita.jpg" alt="Coach Polonnowita" loading="lazy" />
            </div>
            <p style="font-size: 0.95rem; line-height: 1.7; color: var(--color-wool-muted); margin-top: 16px;">
              Anuruddha Polonnowita was the architectural mastermind behind Ananda cricket who instilled world-class self-belief and technique that produced world champion captains.
            </p>
          </div>

          <div class="cherished-entry-card" style="margin-bottom: 0;">
            <div class="cherished-header">
              <span class="mono-tag" style="color: var(--color-gold);">National Tour • 1989/1990</span>
              <h3 style="font-size: 1.6rem; color: var(--color-wool); margin: 8px 0;">Four Anandians to Australia</h3>
              <p class="cherished-sub">Core Leadership of the Sri Lankan Team</p>
            </div>
            <div class="cherished-img-frame">
              <img src="/assets/images/history/4anandians.jpg" alt="Four Anandians in Australia" loading="lazy" />
            </div>
            <p style="font-size: 0.95rem; line-height: 1.7; color: var(--color-wool-muted); margin-top: 16px;">
              <strong>Dhammika Ranatunga</strong>, <strong>Arjuna Ranatunga (Captain)</strong>, <strong>Anuruddha Polonnowita (Asst. Manager)</strong>, and <strong>Brendon Kuruppu</strong> on the testing 1989–1990 Australian tour.
            </p>
          </div>
        </div>

        <!-- 8. World Champions Trinity (Atapattu, Mahanama, Gurusinghe) -->
        <div class="cherished-entry-card" id="international-trio-hall">
          <div class="cherished-header">
            <span class="mono-tag" style="color: var(--color-gold);">The Trinity of Class</span>
            <h2>Marvan Atapattu • Roshan Mahanama • Asanka Gurusinghe</h2>
            <p class="cherished-sub">Architects of Sri Lanka's 1996 World Cup Triumph & International Test Prowess</p>
          </div>

          <div class="cherished-grid-3">
            <div class="cherished-sub-card">
              <div class="cherished-img-frame aspect-tall">
                <img src="/assets/images/history/mavan.jpg" alt="Marvan Atapattu" loading="lazy" />
              </div>
              <h4 style="font-size: 1.25rem; color: var(--color-gold); margin: 12px 0 4px;">Marvan Atapattu</h4>
              <span class="mono-tag" style="font-size: 0.65rem;">Ananda College</span>
              <p class="cherished-caption" style="margin-top: 8px;">Technical perfection personified. Over 5,500 Test runs, 6 Test double-hundreds, and captain of Sri Lanka.</p>
            </div>

            <div class="cherished-sub-card">
              <div class="cherished-img-frame aspect-tall">
                <img src="/assets/images/history/roshan.jpg" alt="Roshan Mahanama" loading="lazy" />
              </div>
              <h4 style="font-size: 1.25rem; color: var(--color-silver); margin: 12px 0 4px;">Roshan Mahanama</h4>
              <span class="mono-tag" style="font-size: 0.65rem;">Nalanda College</span>
              <p class="cherished-caption" style="margin-top: 8px;">World record holder with 340 Test runs, world's supreme cover fielder, and ICC Elite Panel Match Referee.</p>
            </div>

            <div class="cherished-sub-card">
              <div class="cherished-img-frame aspect-tall">
                <img src="/assets/images/history/asanka.jpg" alt="Asanka Gurusinghe" loading="lazy" />
              </div>
              <h4 style="font-size: 1.25rem; color: var(--color-silver); margin: 12px 0 4px;">Asanka Gurusinghe</h4>
              <span class="mono-tag" style="font-size: 0.65rem;">Nalanda College</span>
              <p class="cherished-caption" style="margin-top: 8px;">The immovable rock at number three. Hero of the 1996 World Cup Final with 65 resolute runs against Australia.</p>
            </div>
          </div>
        </div>

        <!-- 9. Modern Era Titans (Samaraweera, Mahela, Avishka) -->
        <div class="cherished-entry-card" id="modern-era-titans">
          <div class="cherished-header">
            <span class="mono-tag" style="color: var(--color-gold);">Modern Giants</span>
            <h2>Thilan Samaraweera • Mahela Jayawardena • Avishka Gunawardene</h2>
            <p class="cherished-sub">Carrying the Maroon Dominance into the 21st Century</p>
          </div>

          <div class="cherished-grid-3">
            <div class="cherished-sub-card">
              <div class="cherished-img-frame aspect-tall">
                <img src="/assets/images/history/tilan_samaraweera.jpg" alt="Thilan Samaraweera" loading="lazy" />
              </div>
              <h4 style="font-size: 1.25rem; color: var(--color-gold); margin: 12px 0 4px;">Thilan Samaraweera</h4>
              <span class="mono-tag" style="font-size: 0.65rem;">Ananda College</span>
              <p class="cherished-caption" style="margin-top: 8px;">Crisis stalwart for Sri Lanka. 14 Test centuries and an outstanding Test average of 48.75.</p>
            </div>

            <div class="cherished-sub-card">
              <div class="cherished-img-frame aspect-tall">
                <img src="/assets/images/history/mahela.jpg" alt="Mahela Jayawardene" loading="lazy" />
              </div>
              <h4 style="font-size: 1.25rem; color: var(--color-silver); margin: 12px 0 4px;">Mahela Jayawardena</h4>
              <span class="mono-tag" style="font-size: 0.65rem;">Nalanda College</span>
              <p class="cherished-caption" style="margin-top: 8px;">ICC Hall of Famer, 11,814 Test runs, 374 highest Test score by a right-hander, and 2007 World Cup Final Captain.</p>
            </div>

            <div class="cherished-sub-card">
              <div class="cherished-img-frame aspect-tall">
                <img src="/assets/images/history/avishka.jpg" alt="Avishka Gunawardene" loading="lazy" />
              </div>
              <h4 style="font-size: 1.25rem; color: var(--color-gold); margin: 12px 0 4px;">Avishka Gunawardene</h4>
              <span class="mono-tag" style="font-size: 0.65rem;">Ananda College</span>
              <p class="cherished-caption" style="margin-top: 8px;">Explosive opening batsman, ICC Champions Trophy century maker, and respected international batting coach.</p>
            </div>
          </div>
        </div>

        <!-- Deep Navigation Links -->
        <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin-top: 40px;">
          <a href="#/history" class="btn-primary-cinematic">
            Full Historical Records & Centuries
          </a>
          <a href="#/gallery" class="btn-secondary-cinematic">
            Browse All Photo Galleries
          </a>
          <a href="#/contact" class="btn-secondary-cinematic">
            Contact Organising Committee
          </a>
        </div>

      </div>
    </section>
  `;

  // Attach jump button smooth scrolling
  const jumpButtons = container.querySelectorAll('.cherished-jump-bar button[data-target]');
  jumpButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const targetEl = container.querySelector('#' + targetId);
      if (targetEl) {
        jumpButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const navHeight = 130;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}
