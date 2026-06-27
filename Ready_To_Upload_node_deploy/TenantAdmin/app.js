/* 
   Sub Pay — Tenant Admin · App Logic
    */

"use strict";

/*  PAGE TITLES  */
const PAGE_TITLES = {
  dashboard:    'Dashboard',
  rooms:        'الرومات',
  files:        'الملفات',
  calendar:     'التقويم والمواعيد',
  invite:       'دعوة موظف',
  members:      'الموظفين',
  notifications:'الإشعارات',
  analytics:    'التحليلات',
  security:     'الأمان',
  profile:      'ملف الشركة',
  subscription: 'اشتراكي',
};

/*  NAVIGATION  */
/**
 * Navigate to a page section.
 * @param {string} id   - Page ID suffix (e.g. "dashboard")
 * @param {Element|null} btn - The sidebar button that triggered the navigation
 */
function go(id, btn) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
  // Deactivate all sidebar buttons
  document.querySelectorAll('.sb-btn').forEach(b => b.classList.remove('on'));

  // Show target page
  const page = document.getElementById('p-' + id);
  if (page) page.classList.add('on');

  // Update topbar title
  const titleEl = document.getElementById('tb-title');
  if (titleEl) titleEl.textContent = PAGE_TITLES[id] || id;

  // Activate the clicked button
  if (btn) btn.classList.add('on');

  window.scrollTo(0, 0);
}

/*  TOGGLE SWITCHES  */
function initToggles() {
  document.querySelectorAll('.tog').forEach(t => {
    t.addEventListener('click', () => t.classList.toggle('off'));
  });
}

/*  CHIP FILTERS  */
function initChips() {
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const group = chip.closest('div');
      if (group) group.querySelectorAll('.chip').forEach(x => x.classList.remove('on'));
      chip.classList.add('on');
    });
  });
}

/*  COMPANY PROFILE — LIVE PREVIEW  */
function profUpdate() {
  const nameInput = document.getElementById('prof-name');
  const bioInput  = document.getElementById('prof-bio');
  if (!nameInput || !bioInput) return;

  const name = nameInput.value.trim() || 'اسم الشركة';
  const bio  = bioInput.value.trim()  || 'بدون نبذة بعد...';

  const previewName = document.getElementById('profPreviewName2');
  const previewBio  = document.getElementById('profPreviewBio2');
  const bioCount    = document.getElementById('prof-bio-count');

  if (previewName) previewName.textContent = name;
  if (previewBio)  previewBio.textContent  = bio;
  if (bioCount)    bioCount.textContent    = bioInput.value.length + '/180';

  // Update logo initials if no image is uploaded
  const logoPreview  = document.getElementById('profLogoPreview');
  const logoPreview2 = document.getElementById('profPreviewLogo2');
  if (logoPreview && !logoPreview.querySelector('img')) {
    const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'TE';
    logoPreview.textContent  = initials;
    if (logoPreview2) logoPreview2.textContent = initials;
  }
}

/**
 * Select brand colour from the colour picker row.
 * @param {Element} el    - The clicked colour swatch
 * @param {string}  color - Hex value
 */
function profSelectColor(el, color) {
  document.querySelectorAll('#profColorRow div').forEach(d => {
    d.style.border = '3px solid transparent';
  });
  el.style.border = '3px solid ' + color;

  const logoPreview  = document.getElementById('profLogoPreview');
  const logoPreview2 = document.getElementById('profPreviewLogo2');
  if (logoPreview)  logoPreview.style.background  = color;
  if (logoPreview2) logoPreview2.style.background = color;
}

/**
 * Preview uploaded logo image.
 * @param {Event} e - File input change event
 */
function profPreviewLogo(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (ev) {
    const src = ev.target.result;
    const imgTag = `<img src="${src}" style="width:100%;height:100%;object-fit:cover;border-radius:22px" alt="Company Logo">`;
    const imgTag2 = `<img src="${src}" style="width:100%;height:100%;object-fit:cover;border-radius:10px" alt="Company Logo">`;

    const logoPreview  = document.getElementById('profLogoPreview');
    const logoPreview2 = document.getElementById('profPreviewLogo2');
    if (logoPreview)  logoPreview.innerHTML  = imgTag;
    if (logoPreview2) logoPreview2.innerHTML = imgTag2;
  };
  reader.readAsDataURL(file);
}

/*  INIT  */
document.addEventListener('DOMContentLoaded', () => {
  initToggles();
  initChips();
  profUpdate(); // initialise bio counter on load
});
