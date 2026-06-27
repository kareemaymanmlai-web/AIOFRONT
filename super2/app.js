/* ===== NAVIGATION ===== */
const titles = {
  dashboard: 'Dashboard',
  tenants: 'كل الـ Tenants',
  'new-tenant': 'Tenant جديد',
  revenue: 'الإيرادات',
  subscriptions: 'الاشتراكات',
  settings: 'الإعدادات',
  pricing: 'الباقات والتسعير',
  activity: 'سجل النشاط',
  'tenant-profile': 'TechCorp Egypt'
};

function go(id, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
  document.querySelectorAll('.sb-btn').forEach(b => b.classList.remove('on'));
  const pg = document.getElementById('p-' + id);
  if (pg) pg.classList.add('on');
  const t = document.getElementById('tb-title');
  if (t) t.textContent = titles[id] || id;
  if (btn) btn.classList.add('on');
  window.scrollTo(0, 0);
}

function openProfile(id) {
  go('tenant-profile', null);
}

/* ===== TABS (Tenant Profile) ===== */
function switchTab(btn, panelId) {
  btn.closest('.tabs').querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('on'));
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('on');
}

/* ===== TOGGLES ===== */
document.querySelectorAll('.tog').forEach(t =>
  t.addEventListener('click', () => t.classList.toggle('off'))
);

/* ===== CHIPS (filter tabs) ===== */
document.querySelectorAll('.chip').forEach(c =>
  c.addEventListener('click', () => {
    c.closest('div').querySelectorAll('.chip').forEach(x => x.classList.remove('on'));
    c.classList.add('on');
    // Tenant filter
    const filter = c.dataset.filter;
    if (filter) filterByStatus(filter);
  })
);

/* ===== TENANT SEARCH ===== */
function filterTenants() {
  const q = document.getElementById('tenant-search').value.trim().toLowerCase();
  const cards = document.querySelectorAll('#tenants-grid .tc[data-name]');
  let visible = 0;
  cards.forEach(card => {
    const name = card.dataset.name || '';
    const match = name.includes(q);
    card.classList.toggle('hidden', !match);
    if (match) visible++;
  });
  document.getElementById('tenants-empty').style.display = visible === 0 ? 'block' : 'none';
}

function filterByStatus(status) {
  const cards = document.querySelectorAll('#tenants-grid .tc[data-name]');
  let visible = 0;
  cards.forEach(card => {
    if (status === 'all') {
      card.classList.remove('hidden');
      visible++;
    } else {
      const match = card.dataset.status === status;
      card.classList.toggle('hidden', !match);
      if (match) visible++;
    }
  });
  document.getElementById('tenants-empty').style.display = visible === 0 ? 'block' : 'none';
}

/* ===== TOAST ===== */
function showToast(msg, type = '') {
  const wrap = document.getElementById('toast-wrap');
  const toast = document.createElement('div');
  toast.className = 'toast' + (type ? ' ' + type : '');
  const icons = { success: 'ti-circle-check', error: 'ti-circle-x', warn: 'ti-alert-triangle' };
  const icon = icons[type] || 'ti-info-circle';
  toast.innerHTML = `<i class="ti ${icon}"></i> ${msg}`;
  wrap.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all .3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ===== CONFIRM MODAL ===== */
let _confirmCb = null;

function confirmAction(title, body, type, onConfirm) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').textContent = body;
  const icon = document.getElementById('modal-icon');
  const btn = document.getElementById('modal-confirm-btn');
  if (type === 'danger') {
    icon.className = 'modal-icon danger';
    icon.innerHTML = '<i class="ti ti-trash" style="color:var(--re)"></i>';
    btn.className = 'btn btn-r';
    btn.textContent = 'تأكيد الحذف';
  } else {
    icon.className = 'modal-icon warn';
    icon.innerHTML = '<i class="ti ti-alert-triangle" style="color:var(--am)"></i>';
    btn.className = 'btn btn-p';
    btn.textContent = 'تأكيد';
  }
  _confirmCb = onConfirm;
  document.getElementById('confirm-modal').classList.add('open');
}

function closeModal() {
  document.getElementById('confirm-modal').classList.remove('open');
  _confirmCb = null;
}

document.getElementById('modal-confirm-btn').addEventListener('click', () => {
  closeModal();
  if (_confirmCb) _confirmCb();
});

document.getElementById('confirm-modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

/* ===== NOTIFICATIONS ===== */
const notifData = [
  { id: 1, unread: true,  icon: 'ti-clock',      color: '#FEF3C7', ic: '#92400E', title: 'معهد اللغات — ينتهي خلال 3 أيام',         sub: 'اشتراك Starter · 500 ج/شهر',              time: 'منذ ساعة' },
  { id: 2, unread: true,  icon: 'ti-clock',      color: '#FEF3C7', ic: '#92400E', title: 'مركز الدكتور أحمد — ينتهي خلال 5 أيام',    sub: 'اشتراك Growth · 1,200 ج/شهر',             time: 'منذ ساعتين' },
  { id: 3, unread: true,  icon: 'ti-building',   color: '#D1FAE5', ic: '#065F46', title: 'Tenant جديد — TechCorp Egypt',             sub: 'Growth · تم الإنشاء بنجاح',               time: 'منذ 3 ساعات' },
  { id: 4, unread: false, icon: 'ti-refresh',    color: '#EEF2FF', ic: '#3730A3', title: 'تجديد ناجح — أكاديمية النخبة',             sub: 'Pro · 6 شهور · 15,000 جنيه',              time: 'أمس' },
  { id: 5, unread: false, icon: 'ti-shield-off', color: '#FEE2E2', ic: '#991B1B', title: 'تنبيه أمان — محاولة دخول مشبوهة',         sub: 'IP: 41.65.xxx.xxx · تم الحجب',            time: 'أمس' },
];

function renderNotifs() {
  const list = document.getElementById('notif-list');
  const unreadCount = notifData.filter(n => n.unread).length;
  document.getElementById('notif-dot').style.display = unreadCount > 0 ? 'block' : 'none';

  if (notifData.length === 0) {
    list.innerHTML = '<div class="notif-empty"><i class="ti ti-bell-off" style="font-size:28px;display:block;margin-bottom:8px"></i>مفيش إشعارات جديدة</div>';
    return;
  }

  list.innerHTML = notifData.map(n => `
    <div class="notif-item ${n.unread ? 'unread' : ''}" onclick="readNotif(${n.id})">
      <div class="notif-ic" style="background:${n.color}">
        <i class="ti ${n.icon}" style="color:${n.ic}"></i>
      </div>
      <div class="notif-txt">
        <strong>${n.title}</strong>
        <span>${n.sub}</span>
        <time>${n.time}</time>
      </div>
      ${n.unread ? '<div style="width:7px;height:7px;border-radius:50%;background:var(--p);flex-shrink:0;margin-top:5px"></div>' : ''}
    </div>
  `).join('');
}

function readNotif(id) {
  const n = notifData.find(x => x.id === id);
  if (n) n.unread = false;
  renderNotifs();
}

function markAllRead(e) {
  e.stopPropagation();
  notifData.forEach(n => n.unread = false);
  renderNotifs();
  showToast('تم تحديد كل الإشعارات كمقروءة', 'success');
}

function toggleNotif() {
  const dd = document.getElementById('notif-dropdown');
  dd.classList.toggle('open');
}

// Close dropdown on outside click
document.addEventListener('click', e => {
  const wrap = document.getElementById('notif-btn');
  if (!wrap.contains(e.target)) {
    document.getElementById('notif-dropdown').classList.remove('open');
  }
});

// Init
renderNotifs();