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
  'tenant-profile': 'ملف Tenant'
};

let currentTenant = '';

function go(id, btn) {
  const overlay = document.getElementById('loader-overlay');
  overlay.classList.add('show');
  setTimeout(() => {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('on'));
    document.querySelectorAll('.sb-btn').forEach(b => b.classList.remove('on'));
    const pg = document.getElementById('p-' + id);
    if (pg) pg.classList.add('on');
    const t = document.getElementById('tb-title');
    if (t) t.textContent = titles[id] || id;
    if (btn) btn.classList.add('on');
    window.scrollTo(0, 0);
    overlay.classList.remove('show');
    if (id === 'tenant-profile') {
      setTimeout(renderTablePage, 100);
    }
    if (id === 'dashboard' || id === 'revenue') {
      setTimeout(initCharts, 150);
    }
  }, 350);
}

function openProfile(tenantName) {
  if (!tenantName) return;
  currentTenant = tenantName;
  const btn = document.querySelector('[onclick*="tenants"]');
  go('tenant-profile', btn);
  
  // تعديل البيانات في صفحة الـ Profile
  document.getElementById('tb-title').textContent = tenantName;
  document.getElementById('profile-name').textContent = tenantName;
  
  // تغيير الحروف الأولى في اللوجو
  const logo = document.getElementById('profile-logo');
  const words = tenantName.split(' ');
  let initials = '';
  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0] || '';
  }
  logo.textContent = initials.toUpperCase();
  
  // إعادة ضبط البيانات (هتتغير حسب الـ Tenant)
  // هنا تقدر تضيف بيانات ديناميكية لكل Tenant
  setTimeout(renderTablePage, 100);
}

/* ===== TABS (Tenant Profile) ===== */
function switchTab(btn, panelId) {
  btn.closest('.tabs').querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('on'));
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('on');
  if (panelId === 'tab-users') {
    setTimeout(renderTablePage, 50);
  }
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
    const filter = c.dataset.filter;
    if (filter) filterByStatus(filter);
  })
);

/* ===== TENANT SEARCH (with debounce) ===== */
let searchTimeout;

function filterTenants() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
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
  }, 300);
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

document.addEventListener('click', e => {
  const wrap = document.getElementById('notif-btn');
  if (!wrap.contains(e.target)) {
    document.getElementById('notif-dropdown').classList.remove('open');
  }
});
/* ===== PAGINATION (for tenant users table) ===== */
let currentPage = 1;
const rowsPerPage = 3;

function renderTablePage() {
  const table = document.querySelector('#tab-users .tbl tbody');
  if (!table) return;
  const rows = Array.from(table.querySelectorAll('tr'));
  const total = rows.length;
  if (total === 0) return;
  const pages = Math.ceil(total / rowsPerPage);
  if (currentPage > pages) currentPage = pages;
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  rows.forEach((row, i) => {
    row.style.display = (i >= start && i < end) ? '' : 'none';
  });

  let pag = document.getElementById('table-pagination');
  if (!pag) {
    pag = document.createElement('div');
    pag.id = 'table-pagination';
    pag.className = 'pagination';
    const card = table.closest('.card');
    if (card) card.appendChild(pag);
  }
  pag.innerHTML = '';
  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === currentPage) btn.classList.add('on');
    btn.addEventListener('click', () => {
      currentPage = i;
      renderTablePage();
    });
    pag.appendChild(btn);
  }
}

/* ===== CSV EXPORT ===== */
function exportCSV(headers, data, filename = 'export.csv') {
  let csv = headers.join(',') + '\n';
  data.forEach(row => {
    csv += row.join(',') + '\n';
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function exportTenantsCSV() {
  const cards = document.querySelectorAll('#tenants-grid .tc[data-name]:not(.hidden)');
  if (cards.length === 0) {
    showToast('لا يوجد Tenants للتصدير', 'warn');
    return;
  }
  const headers = ['الاسم', 'النوع', 'الباقة', 'الحالة', 'الموظفين/الطلاب'];
  const data = [];
  cards.forEach(card => {
    const name = card.querySelector('.tc-name')?.textContent?.trim() || '';
    const type = card.querySelector('.tc-type')?.textContent?.trim() || '';
    const status = card.querySelector('.pill')?.textContent?.trim() || '';
    const pkg = card.querySelector('.tag')?.textContent?.trim() || '';
    const stat = card.querySelector('.tc-stat strong')?.textContent?.trim() || '';
    data.push([name, type, pkg, status, stat]);
  });
  exportCSV(headers, data, 'tenants.csv');
  showToast('تم تصدير ' + cards.length + ' Tenant بنجاح', 'success');
}

function exportRevenueCSV() {
  const headers = ['الشهر', 'الإيراد'];
  const data = [
    ['يناير', '21,000'],
    ['فبراير', '26,000'],
    ['مارس', '19,000'],
    ['أبريل', '29,500'],
    ['مايو', '32,800'],
    ['يونيو', '42,000']
  ];
  exportCSV(headers, data, 'revenue.csv');
  showToast('تم تصدير بيانات الإيرادات', 'success');
}

function handleExport() {
  const activePage = document.querySelector('.page.on');
  if (!activePage) return;
  const id = activePage.id;
  if (id === 'p-tenants') exportTenantsCSV();
  else if (id === 'p-revenue') exportRevenueCSV();
  else showToast('لا توجد بيانات للتصدير في هذه الصفحة', 'warn');
}

/* ===== ANIMATED COUNTERS ===== */
function animateNumbers() {
  const stats = document.querySelectorAll('.stat-card .sv');
  stats.forEach(el => {
    const target = parseFloat(el.textContent.replace(/[^0-9.]/g, ''));
    if (isNaN(target)) return;
    let current = 0;
    const step = Math.ceil(target / 40);
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      const suffix = el.textContent.replace(/[0-9.]/g, '');
      el.textContent = Math.round(current) + suffix;
    }, 25);
  });
}

/* ===== CHARTS ===== */
let weeklyChartInstance = null;
let monthlyChartInstance = null;

function initCharts() {
  const weeklyCtx = document.getElementById('weeklyChart');
  if (weeklyCtx) {
    if (weeklyChartInstance) weeklyChartInstance.destroy();
    weeklyChartInstance = new Chart(weeklyCtx, {
      type: 'line',
      data: {
        labels: ['سبت', 'أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'],
        datasets: [{
          label: 'الإيرادات (جنيه)',
          data: [1400, 2100, 900, 3200, 1800, 3800, 1200],
          borderColor: '#4F46E5',
          backgroundColor: 'rgba(79, 70, 229, 0.1)',
          tension: 0.3,
          fill: true,
          pointBackgroundColor: '#4F46E5'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }

  const monthlyCtx = document.getElementById('monthlyChart');
  if (monthlyCtx) {
    if (monthlyChartInstance) monthlyChartInstance.destroy();
    monthlyChartInstance = new Chart(monthlyCtx, {
      type: 'bar',
      data: {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
        datasets: [{
          label: 'الإيرادات الشهرية',
          data: [21000, 26000, 19000, 29500, 32800, 42000],
          backgroundColor: ['#818CF8', '#A78BFA', '#4F46E5', '#6366F1', '#4338CA', '#3730A3'],
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
          x: { grid: { display: false } }
        }
      }
    });
  }
}
/* ===== PREVIEW LOGO ===== */
function previewLogo(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  if (file.size > 2 * 1024 * 1024) {
    showToast('حجم الصورة أكبر من 2 ميجا!', 'error');
    event.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = document.getElementById('logoPreview');
    const container = document.getElementById('logoPreviewContainer');
    const icon = container.querySelector('i');
    
    if (icon) icon.style.display = 'none';
    img.src = e.target.result;
    img.style.display = 'block';
  };
  reader.readAsDataURL(file);
}

/* ===== INIT ===== */
document.addEventListener('DOMContentLoaded', () => {
  renderNotifs();
  setTimeout(animateNumbers, 300);
  if (document.getElementById('p-tenant-profile')?.classList.contains('on')) {
    renderTablePage();
  }
  setTimeout(initCharts, 400);
});