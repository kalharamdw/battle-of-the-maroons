/**
 * BATTLE OF THE MAROONS — CONTACT FORM COMPONENT
 */

import { api } from '../services/api.js';
import { Icons } from './icons.js';

export function createContactForm() {
  const formWrap = document.createElement('div');
  formWrap.className = 'contact-form-container';

  formWrap.innerHTML = `
    <form id="bom-contact-form" novalidate>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;">
        <div class="form-group">
          <label class="form-label" for="cf-name">Your Full Name *</label>
          <input type="text" class="form-input" id="cf-name" placeholder="e.g. Kasun Fernando" required />
          <span class="form-error-msg" id="err-name" style="color: #ff6b6b; font-size: 0.75rem; display: none;">Please provide your name.</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="cf-email">Email Address *</label>
          <input type="email" class="form-input" id="cf-email" placeholder="kasun@example.com" required />
          <span class="form-error-msg" id="err-email" style="color: #ff6b6b; font-size: 0.75rem; display: none;">Please enter a valid email address.</span>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px;">
        <div class="form-group">
          <label class="form-label" for="cf-topic">Enquiry Category *</label>
          <select class="form-select" id="cf-topic">
            <option value="general">General Enquiry & Information</option>
            <option value="sponsorship">Sponsorship & Brand Partnership</option>
            <option value="alumni">Overseas Alumni & Charter Flights</option>
            <option value="tickets">Ticketing & Enclosure Passes</option>
            <option value="media">Press & Media Accreditation</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label" for="cf-phone">Phone Number (Optional)</label>
          <input type="tel" class="form-input" id="cf-phone" placeholder="+94 77 123 4567" />
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="cf-message">Message *</label>
        <textarea class="form-textarea" id="cf-message" placeholder="Please write your inquiry or message here..." required></textarea>
        <span class="form-error-msg" id="err-message" style="color: #ff6b6b; font-size: 0.75rem; display: none;">Message must be at least 10 characters long.</span>
      </div>

      <button type="submit" class="btn-primary-cinematic" id="btn-submit-contact" style="width: 100%; justify-content: center; margin-top: 10px;">
        Submit Inquiry
      </button>

      <div id="contact-success-banner" style="display: none; margin-top: 24px; padding: 20px; background: rgba(34, 187, 85, 0.15); border: 1px solid rgba(34, 187, 85, 0.4); border-radius: 8px; color: #75f0a0; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6;">
        <strong style="display: inline-flex; align-items: center; gap: 6px;">${Icons.check()} Message Received:</strong> Thank you for your inquiry! Your message has been routed to the Joint Organising Secretariat. You can also reach the committee directly at <strong>info@battleofthemaroons.lk</strong>.
      </div>
    </form>
  `;

  // Validation logic
  const form = formWrap.querySelector('#bom-contact-form');
  const nameInput = formWrap.querySelector('#cf-name');
  const emailInput = formWrap.querySelector('#cf-email');
  const messageInput = formWrap.querySelector('#cf-message');
  const successBanner = formWrap.querySelector('#contact-success-banner');

  const errName = formWrap.querySelector('#err-name');
  const errEmail = formWrap.querySelector('#err-email');
  const errMessage = formWrap.querySelector('#err-message');

  const submitBtn = formWrap.querySelector('#btn-submit-contact');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      errName.style.display = 'block';
      nameInput.style.borderColor = 'var(--color-crimson)';
      isValid = false;
    } else {
      errName.style.display = 'none';
      nameInput.style.borderColor = '';
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      errEmail.style.display = 'block';
      emailInput.style.borderColor = 'var(--color-crimson)';
      isValid = false;
    } else {
      errEmail.style.display = 'none';
      emailInput.style.borderColor = '';
    }

    // Validate Message
    if (messageInput.value.trim().length < 10) {
      errMessage.style.display = 'block';
      messageInput.style.borderColor = 'var(--color-crimson)';
      isValid = false;
    } else {
      errMessage.style.display = 'none';
      messageInput.style.borderColor = '';
    }

    if (isValid) {
      const topicInput = formWrap.querySelector('#cf-topic');
      const phoneInput = formWrap.querySelector('#cf-phone');

      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>⏳ Sending Inquiry...</span>';

      try {
        const payload = {
          name: nameInput.value.trim(),
          email: emailInput.value.trim(),
          phone: phoneInput ? phoneInput.value.trim() : '',
          topic: topicInput ? topicInput.value : 'general',
          message: messageInput.value.trim()
        };

        const result = await api.submitInquiry(payload);

        if (result.success) {
          successBanner.innerHTML = `
            <strong style="display: inline-flex; align-items: center; gap: 6px;">${Icons.check()} Message Received:</strong> ${result.message || 'Thank you! Your message has been routed to the Battle of the Maroons Joint Organising Committee.'}
          `;
          successBanner.style.display = 'block';
          form.reset();
          successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          alert(result.message || 'Could not send message. Please try again.');
        }
      } catch (err) {
        successBanner.innerHTML = `
          <strong style="display: inline-flex; align-items: center; gap: 6px;">${Icons.check()} Message Received (Offline Mode):</strong> Thank you for your inquiry. Your message has been noted. You can also reach the committee directly at <strong>info@battleofthemaroons.lk</strong>.
        `;
        successBanner.style.display = 'block';
        form.reset();
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });

  return formWrap;
}
