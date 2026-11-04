/**
 * BATTLE OF THE MAROONS — ADMINISTRATIVE AUTHENTICATION PAGE
 * 
 * Secure, pre-authorized administrative access only.
 * No public self-registration.
 */

import { adminApi } from '../../services/api.js';
import { Icons } from '../../components/icons.js';

export function renderAdminLoginPage(container, onLoginSuccess) {
  container.innerHTML = `
    <div class="admin-login-wrapper" style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px 20px; position: relative; z-index: 1;">
      <div class="admin-login-card" style="background: linear-gradient(145deg, rgba(22, 9, 14, 0.96), rgba(10, 4, 6, 0.98)); border: 1px solid var(--border-gold); border-radius: 16px; padding: 40px; width: 100%; max-width: 460px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 175, 55, 0.08); position: relative; overflow: hidden;">
        
        <!-- Subtle crest background -->
        <div style="text-align: center; margin-bottom: 28px;">
          <div style="display: inline-flex; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 50%; background: rgba(212, 175, 55, 0.1); border: 1px solid var(--color-gold); margin-bottom: 16px; font-size: 1.8rem; color: var(--color-gold);">
            ${Icons.cricket('', 32)}
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.72rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--color-gold-bright); font-weight: 700;">
            Joint Committee Administration
          </div>
          <h1 style="font-family: var(--font-display); font-size: 1.8rem; color: var(--color-wool); margin: 6px 0 8px; font-weight: 900;">
            Control Centre
          </h1>
          <p style="font-size: 0.82rem; color: var(--color-wool-muted); line-height: 1.5;">
            Authorized management console for countdown, ticketing, matches, news & inquiries.
          </p>
        </div>

        <div id="admin-login-error" style="display: none; margin-bottom: 20px; padding: 12px 16px; background: rgba(220, 38, 38, 0.15); border: 1px solid rgba(220, 38, 38, 0.4); border-radius: 8px; color: #fca5a5; font-size: 0.82rem; font-family: var(--font-mono);"></div>

        <form id="admin-login-form">
          <div class="form-group" style="margin-bottom: 18px;">
            <label class="form-label" for="admin-user-input">Username or Email</label>
            <input 
              type="text" 
              id="admin-user-input" 
              class="form-input" 
              value="admin"
              placeholder="e.g. admin" 
              autocomplete="username" 
              required 
            />
          </div>

          <div class="form-group" style="margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <label class="form-label" for="admin-pass-input" style="margin-bottom: 0;">Password</label>
              <button type="button" id="btn-toggle-pass" style="background: none; border: none; font-size: 0.75rem; color: var(--color-gold); cursor: pointer; font-family: var(--font-mono);">
                Show
              </button>
            </div>
            <input 
              type="password" 
              id="admin-pass-input" 
              class="form-input" 
              value="Maroons@2027"
              placeholder="••••••••••••" 
              autocomplete="current-password" 
              required 
            />
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            <button 
              type="submit" 
              id="btn-admin-login-submit" 
              class="btn-primary-cinematic" 
              style="width: 100%; justify-content: center; padding: 14px; font-size: 0.88rem;"
            >
              Authenticate & Enter Control Centre
            </button>
            <button 
              type="button" 
              id="btn-quick-dev-login" 
              style="width: 100%; padding: 10px; background: rgba(34, 187, 85, 0.15); border: 1px solid #22bb55; border-radius: 8px; color: #75f0a0; font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;"
            >
              ⚡ Instant 1-Click Dev Sign-In
            </button>
          </div>
        </form>

        <!-- Development Hint -->
        <div style="margin-top: 24px; padding: 12px; background: rgba(212, 175, 55, 0.06); border: 1px dashed rgba(212, 175, 55, 0.25); border-radius: 8px; font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-wool-muted); text-align: center;">
          <span style="color: var(--color-gold); display: inline-flex; align-items: center; gap: 6px;">${Icons.key()} Default Seed Credentials:</span><br/>
          Username: <code style="color: var(--color-wool);">admin</code> &bull; Password: <code style="color: var(--color-wool);">Maroons@2027</code>
        </div>

        <div style="margin-top: 20px; text-align: center;">
          <a href="#/" style="font-size: 0.8rem; color: var(--color-wool-muted); text-decoration: none; font-family: var(--font-mono);">
            ← Return to Public Website
          </a>
        </div>
      </div>
    </div>
  `;

  // Attach event handlers
  const form = container.querySelector('#admin-login-form');
  const errorBox = container.querySelector('#admin-login-error');
  const submitBtn = container.querySelector('#btn-admin-login-submit');
  const togglePassBtn = container.querySelector('#btn-toggle-pass');
  const passInput = container.querySelector('#admin-pass-input');

  if (togglePassBtn && passInput) {
    togglePassBtn.addEventListener('click', () => {
      const isPass = passInput.type === 'password';
      passInput.type = isPass ? 'text' : 'password';
      togglePassBtn.textContent = isPass ? 'Hide' : 'Show';
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = container.querySelector('#admin-user-input').value.trim();
      const password = passInput.value;

      errorBox.style.display = 'none';
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Verifying Credentials...`;

      try {
        const res = await adminApi.login(username, password);
        if (res.success && res.token) {
          if (typeof onLoginSuccess === 'function') {
            onLoginSuccess(res.user);
          }
        } else {
          errorBox.textContent = res.message || 'Invalid username or password.';
          errorBox.style.display = 'block';
        }
      } catch (err) {
        errorBox.textContent = 'Server communication error. Please ensure backend is running.';
        errorBox.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `Authenticate & Enter`;
      }
    });
  }

  const quickDevBtn = container.querySelector('#btn-quick-dev-login');
  if (quickDevBtn) {
    quickDevBtn.addEventListener('click', () => {
      container.querySelector('#admin-user-input').value = 'admin';
      passInput.value = 'Maroons@2027';
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true }));
      }
    });
  }
}
