/* 
   Sub Pay — End User App · JavaScript
    */

"use strict";

/*  PAGE TITLES  */
const PAGE_TITLES = {
  'home':         'الرئيسية',
  'room-hr':      'HR & السياسات',
  'files':        'الملفات',
  'view-pdf':     'عرض PDF',
  'view-video':   'عرض فيديو',
  'notifications':'الإشعارات',
  'calendar':     'المواعيد',
  'profile':      'الملف الشخصي',
  'settings':     'الإعدادات',
};

/*  LOGIN / LOGOUT  */

/**
 * Hides the login screen and shows the main app.
 */
function startApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('main-app').classList.add('on');
}

/**
 * Logs out: shows login screen, hides app.
 */
function logout() {
  document.getElementById('main-app').classList.remove('on');
  document.getElementById('login-screen').style.display = 'block';
}

/* ─── NAVIGATION ─── */

/**
 * Navigate to a page by ID.
 * @param {string}       id  - The page ID suffix (e.g. "home")
 * @param {Element|null} btn - The sidebar button that triggered navigation
 */
function go(id, btn) {
  // Hide all pages & deactivate all sidebar buttons
  document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
  document.querySelectorAll('.sb-btn').forEach(b => b.classList.remove('on'));

  // Show target page
  const page = document.getElementById('p-' + id);
  if (page) page.classList.add('on');

  // Update topbar title
  const titleEl = document.getElementById('tb-title');
  if (titleEl) titleEl.textContent = PAGE_TITLES[id] || id;

  // Activate clicked sidebar button
  if (btn) btn.classList.add('on');

  window.scrollTo(0, 0);
}

/*  ROOM TABS  */

/**
 * Switch between the Files / Members / About tabs inside a room.
 * @param {'files'|'members'|'about'} tab - Tab name
 */
function switchTab(tab) {
  const tabs = ['files', 'members', 'about'];

  tabs.forEach(t => {
    // Toggle content visibility
    const content = document.getElementById('tab-content-' + t);
    if (content) content.style.display = t === tab ? 'block' : 'none';

    // Update tab button styling
    const btn = document.getElementById('tab-' + t);
    if (btn) {
      btn.style.borderBottom = t === tab ? '2px solid var(--p)' : '2px solid transparent';
      btn.style.color        = t === tab ? 'var(--p)' : 'var(--t2)';
      btn.style.fontWeight   = t === tab ? '600' : '500';
    }
  });
}

/*  TOGGLE SWITCHES  */
function initToggles() {
  document.querySelectorAll('.tog').forEach(t => {
    t.addEventListener('click', () => t.classList.toggle('off'));
  });
}

/*  INIT  */
document.addEventListener('DOMContentLoaded', () => {
  initToggles();
});
