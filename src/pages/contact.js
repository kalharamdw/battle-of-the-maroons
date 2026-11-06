/**
 * BATTLE OF THE MAROONS — CONTACT PAGE
 * 
 * Official College administrative offices, worldwide alumni networks,
 * match venue liaison, and direct inquiry submission.
 */

import { createContactForm } from '../components/contact-form.js';
import { Icons } from '../components/icons.js';

export function renderContactPage(container) {
  container.innerHTML = `
    <div class="page-hero">
      <div class="container">
        <span class="page-hero-eyebrow">Official Communications</span>
        <h1 class="page-hero-title">Contact Us</h1>
        <p class="page-hero-subtitle">
          Direct administrative channels for Ananda College, Nalanda College, worldwide alumni networks, and official match day inquiries.
        </p>
      </div>
    </div>

    <section class="page-section">
      <div class="container">

        <!-- Top Overview Banner -->
        <div style="background: linear-gradient(135deg, rgba(34, 5, 11, 0.95) 0%, rgba(14, 7, 10, 0.95) 100%); border: 1px solid var(--border-gold); border-radius: 18px; padding: clamp(28px, 4vw, 42px); margin-bottom: 40px; box-shadow: 0 15px 40px rgba(0, 0, 0, 0.7);">
          <span class="mono-tag" style="color: var(--color-gold);">Official Communications</span>
          <h2 style="font-size: clamp(1.8rem, 3.2vw, 2.6rem); margin: 10px 0 14px; color: var(--color-wool);">
            College Administrative Offices & Liaison
          </h2>
          <p style="font-size: 1.05rem; color: var(--color-wool-muted); max-width: 860px; line-height: 1.7; margin: 0;">
            The Battle of the Maroons is governed and orchestrated jointly by the administrations and Old Boys' Associations of Ananda College and Nalanda College. Official correspondence, patron relations, and public inquiries are coordinated directly through the respective college administrative offices.
          </p>
        </div>

        <!-- Official College Administration Offices -->
        <div class="contact-grid-2" style="margin-bottom: 40px;">
          
          <!-- Ananda College Office -->
          <div style="background: rgba(18, 9, 13, 0.88); border: 1.5px solid var(--border-gold); border-radius: 18px; padding: clamp(24px, 3.5vw, 36px); backdrop-filter: blur(14px); display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6); position: relative; overflow: hidden;">
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #d4af37, #ffd700, #9e1b32);"></div>
            
            <div>
              <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 22px;">
                <div style="width: 56px; height: 62px; flex-shrink: 0; background: #ffffff; border-radius: 12px; display: flex; align-items: center; justify-content: center; padding: 4px 5px; border: 1.5px solid rgba(212, 175, 55, 0.6); box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4); overflow: hidden;">
                  <img src="/assets/images/schools/ananda_crest.svg" alt="Ananda College Crest" style="width: 100%; height: 100%; object-fit: contain;" />
                </div>
                <div>
                  <h3 style="font-size: 1.5rem; color: var(--color-gold); margin: 0 0 4px; font-family: var(--font-display);">Ananda College</h3>
                  <span class="mono-tag" style="font-size: 0.68rem; margin-right: 8px;">Est. 1886</span>
                  <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--color-wool-muted); font-style: italic;">"Appamado Amato Padam"</span>
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 14px; font-size: 0.94rem; color: var(--color-wool-muted); margin-bottom: 24px;">
                <div style="display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; border: 1px solid var(--border-subtle);">
                  <span style="font-size: 1.1rem; flex-shrink: 0; display: flex; align-items: center; color: var(--color-gold);">${Icons.mapPin()}</span>
                  <div>
                    <strong style="color: var(--color-wool); display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">School Address</strong>
                    <span>Kularatne Mawatha, Colombo 10, Sri Lanka</span>
                  </div>
                </div>

                <div style="display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; border: 1px solid var(--border-subtle);">
                  <span style="font-size: 1.1rem; flex-shrink: 0; display: flex; align-items: center; color: var(--color-gold);">${Icons.phone()}</span>
                  <div>
                    <strong style="color: var(--color-wool); display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">Telephone & Fax</strong>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 4px;">
                      <a href="tel:+94112695503" style="color: var(--color-gold); font-weight: 700; text-decoration: none; font-family: var(--font-mono);">+94-11-2695503</a>
                      <span style="color: var(--color-wool-subtle);">•</span>
                      <span style="font-family: var(--font-mono); font-size: 0.85rem;">Fax: +94-11-2681815</span>
                    </div>
                  </div>
                </div>

                <div style="display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; border: 1px solid var(--border-subtle);">
                  <span style="font-size: 1.1rem; flex-shrink: 0; display: flex; align-items: center; color: var(--color-gold);">${Icons.mail()}</span>
                  <div>
                    <strong style="color: var(--color-wool); display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">OBA Secretariat Email</strong>
                    <a href="mailto:secretary@acoba.lk" style="color: var(--color-gold); font-family: var(--font-mono); text-decoration: underline;">secretary@acoba.lk</a>
                  </div>
                </div>
              </div>
            </div>

            <div style="padding-top: 18px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
              <span style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--color-wool-muted); text-transform: uppercase; letter-spacing: 0.05em;">Official Web Portal</span>
              <a href="https://www.anandacollege.edu.lk" target="_blank" rel="noopener" class="btn-secondary-cinematic" style="padding: 8px 16px; font-size: 0.78rem;">
                Visit anandacollege.edu.lk &rarr;
              </a>
            </div>
          </div>

          <!-- Nalanda College Office -->
          <div style="background: rgba(18, 9, 13, 0.88); border: 1.5px solid var(--border-silver); border-radius: 18px; padding: clamp(24px, 3.5vw, 36px); backdrop-filter: blur(14px); display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6); position: relative; overflow: hidden;">
            <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #c8cbd0, #ffffff, #800020);"></div>
            
            <div>
              <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 22px;">
                <div style="width: 56px; height: 62px; flex-shrink: 0; background: #ffffff; border-radius: 12px; display: flex; align-items: center; justify-content: center; padding: 4px 5px; border: 1.5px solid rgba(200, 203, 208, 0.6); box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4); overflow: hidden;">
                  <img src="/assets/images/schools/nalanda_crest.png" alt="Nalanda College Crest" style="width: 100%; height: 100%; object-fit: contain;" />
                </div>
                <div>
                  <h3 style="font-size: 1.5rem; color: var(--color-silver); margin: 0 0 4px; font-family: var(--font-display);">Nalanda College</h3>
                  <span class="mono-tag" style="font-size: 0.68rem; margin-right: 8px;">Est. 1924</span>
                  <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--color-wool-muted); font-style: italic;">"Apadana Sobhini Panna"</span>
                </div>
              </div>

              <div style="display: flex; flex-direction: column; gap: 14px; font-size: 0.94rem; color: var(--color-wool-muted); margin-bottom: 24px;">
                <div style="display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; border: 1px solid var(--border-subtle);">
                  <span style="font-size: 1.1rem; flex-shrink: 0; display: flex; align-items: center; color: var(--color-silver);">${Icons.mapPin()}</span>
                  <div>
                    <strong style="color: var(--color-wool); display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">School Address</strong>
                    <span>Nalanda College, Colombo 10, Sri Lanka</span>
                  </div>
                </div>

                <div style="display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; border: 1px solid var(--border-subtle);">
                  <span style="font-size: 1.1rem; flex-shrink: 0; display: flex; align-items: center; color: var(--color-silver);">${Icons.phone()}</span>
                  <div>
                    <strong style="color: var(--color-wool); display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">Telephone & Fax</strong>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-top: 4px;">
                      <a href="tel:+94112695227" style="color: var(--color-silver); font-weight: 700; text-decoration: none; font-family: var(--font-mono);">+94-11-2695227</a>
                      <span style="color: var(--color-wool-subtle);">•</span>
                      <span style="font-family: var(--font-mono); font-size: 0.85rem;">Fax: +94-11-2608845</span>
                    </div>
                  </div>
                </div>

                <div style="display: flex; align-items: flex-start; gap: 12px; padding: 12px 14px; background: rgba(255, 255, 255, 0.03); border-radius: 8px; border: 1px solid var(--border-subtle);">
                  <span style="font-size: 1.1rem; flex-shrink: 0; display: flex; align-items: center; color: var(--color-silver);">${Icons.mail()}</span>
                  <div>
                    <strong style="color: var(--color-wool); display: block; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;">OBA Secretariat Email</strong>
                    <a href="mailto:secretary@nalandaoba.lk" style="color: var(--color-silver); font-family: var(--font-mono); text-decoration: underline;">secretary@nalandaoba.lk</a>
                  </div>
                </div>
              </div>
            </div>

            <div style="padding-top: 18px; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
              <span style="font-family: var(--font-mono); font-size: 0.74rem; color: var(--color-wool-muted); text-transform: uppercase; letter-spacing: 0.05em;">Official Web Portal</span>
              <a href="https://nalandacollege.lk/" target="_blank" rel="noopener" class="btn-secondary-cinematic" style="padding: 8px 16px; font-size: 0.78rem;">
                Visit nalandacollege.lk &rarr;
              </a>
            </div>
          </div>

        </div>

        <!-- Joint Operations & Ground Headquarters Bar -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 40px;">
          
          <div style="background: rgba(18, 9, 13, 0.75); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 22px 24px; display: flex; align-items: center; gap: 16px;">
            <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.3); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0; color: var(--color-gold);">
              ${Icons.stadium()}
            </div>
            <div>
              <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--color-gold); text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 3px;">Match Day Ground</span>
              <strong style="color: var(--color-wool); font-size: 0.95rem; display: block;">SSC Grounds, Colombo 07</strong>
              <span style="font-size: 0.8rem; color: var(--color-wool-muted);">Maitland Place, Colombo</span>
            </div>
          </div>

          <div style="background: rgba(18, 9, 13, 0.75); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 22px 24px; display: flex; align-items: center; gap: 16px;">
            <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.3); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0; color: var(--color-gold);">
              ${Icons.mail()}
            </div>
            <div>
              <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--color-gold); text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 3px;">General Inquiries</span>
              <a href="mailto:info@battleofthemaroons.lk" style="color: var(--color-wool); font-size: 0.95rem; font-weight: 700; text-decoration: none; display: block;">info@battleofthemaroons.lk</a>
              <span style="font-size: 0.8rem; color: var(--color-wool-muted);">Official Joint Secretariat Inbox</span>
            </div>
          </div>

          <div style="background: rgba(18, 9, 13, 0.75); border: 1px solid var(--border-subtle); border-radius: 14px; padding: 22px 24px; display: flex; align-items: center; gap: 16px;">
            <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.3); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0; color: var(--color-gold);">
              ${Icons.ticket()}
            </div>
            <div>
              <span style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--color-gold); text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 3px;">Ticketing & Passes</span>
              <a href="#/ticketing" style="color: var(--color-gold); font-size: 0.95rem; font-weight: 700; text-decoration: none; display: block;">Enclosure Information &rarr;</a>
              <span style="font-size: 0.8rem; color: var(--color-wool-muted);">Grandstand, Pavilion & Papare</span>
            </div>
          </div>

        </div>

        <!-- Worldwide Alumni Networks (Global Diaspora) -->
        <div style="background: rgba(18, 9, 13, 0.85); border: 1px solid var(--border-light); border-radius: 18px; padding: clamp(24px, 3.5vw, 36px); margin-bottom: 44px; backdrop-filter: blur(14px);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px; margin-bottom: 16px;">
            <div>
              <span class="mono-tag" style="color: var(--color-gold);">Global Diaspora</span>
              <h3 style="font-size: 1.6rem; color: var(--color-wool); margin: 8px 0 6px;">Worldwide Alumni Networks</h3>
              <p style="font-size: 0.92rem; color: var(--color-wool-muted); margin: 0; max-width: 760px; line-height: 1.6;">
                Official international Old Boys' Associations coordinating global alumni reunions, international broadcast viewings, and match day celebrations worldwide.
              </p>
            </div>
          </div>

          <div class="alumni-networks-grid">
            <a href="https://battleofthemaroons.lk/" target="_blank" rel="noopener" class="alumni-network-link">
              <span style="display: flex; align-items: center; gap: 8px;">${Icons.globe('gold-accent')} Ananda College World Wide Network</span>
              <span style="color: var(--color-gold); font-weight: 700;">&rarr;</span>
            </a>
            <a href="https://battleofthemaroons.lk/" target="_blank" rel="noopener" class="alumni-network-link">
              <span style="display: flex; align-items: center; gap: 8px;">${Icons.globe('gold-accent')} Old Anandians Association of Victoria Australia</span>
              <span style="color: var(--color-gold); font-weight: 700;">&rarr;</span>
            </a>
            <a href="https://battleofthemaroons.lk/" target="_blank" rel="noopener" class="alumni-network-link">
              <span style="display: flex; align-items: center; gap: 8px;">${Icons.globe('gold-accent')} Nalanda OBA Melbourne, Australia</span>
              <span style="color: var(--color-gold); font-weight: 700;">&rarr;</span>
            </a>
            <a href="https://battleofthemaroons.lk/" target="_blank" rel="noopener" class="alumni-network-link">
              <span style="display: flex; align-items: center; gap: 8px;">${Icons.globe('gold-accent')} Nalanda OBA Sydney, Australia</span>
              <span style="color: var(--color-gold); font-weight: 700;">&rarr;</span>
            </a>
            <a href="https://battleofthemaroons.lk/" target="_blank" rel="noopener" class="alumni-network-link">
              <span style="display: flex; align-items: center; gap: 8px;">${Icons.globe('gold-accent')} Old Anandians Association of United Kingdom</span>
              <span style="color: var(--color-gold); font-weight: 700;">&rarr;</span>
            </a>
            <a href="https://battleofthemaroons.lk/" target="_blank" rel="noopener" class="alumni-network-link">
              <span style="display: flex; align-items: center; gap: 8px;">${Icons.globe('gold-accent')} Nalanda Old Boys Association UK</span>
              <span style="color: var(--color-gold); font-weight: 700;">&rarr;</span>
            </a>
          </div>
        </div>

        <!-- Interactive Contact Form Section -->
        <div style="max-width: 860px; margin: 0 auto; background: rgba(18, 9, 13, 0.92); border: 1.5px solid var(--border-gold); border-radius: 18px; padding: clamp(28px, 4vw, 48px); backdrop-filter: blur(14px); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);">
          <div class="section-header-block" style="margin-bottom: 32px; text-align: center;">
            <span class="mono-tag" style="color: var(--color-gold);">Send a Message</span>
            <h2 style="font-size: clamp(1.8rem, 3vw, 2.4rem); margin: 10px 0 8px; color: var(--color-wool);">Online Inquiry Form</h2>
            <p style="color: var(--color-wool-muted); font-size: 0.95rem; max-width: 580px; margin: 0 auto;">
              Directly submit your inquiry to the Joint Organising Secretariat. We will respond promptly.
            </p>
          </div>

          <div id="contact-form-mount"></div>
        </div>

      </div>
    </section>
  `;

  const formMount = container.querySelector('#contact-form-mount');
  if (formMount) {
    formMount.appendChild(createContactForm());
  }
}
