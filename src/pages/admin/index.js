/**
 * BATTLE OF THE MAROONS — ADMINISTRATIVE ROUTE CONTROLLER
 * 
 * Accessible at /#/admin
 * Strictly gatekept: renders login if unauthorized, or control panel if verified.
 */

import { adminAuth } from '../../services/api.js';
import { renderAdminLoginPage } from './admin-login.js';
import { renderAdminDashboardPage } from './admin-dashboard.js';

export function renderAdminPage(container) {
  if (adminAuth.isAuthenticated()) {
    renderAdminDashboardPage(container, () => {
      renderAdminPage(container);
    });
  } else {
    renderAdminLoginPage(container, () => {
      renderAdminPage(container);
    });
  }
}
