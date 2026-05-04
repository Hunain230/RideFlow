/* ── Global shared utilities ─────────────────────────────────── */

// Toast
const toast = (() => {
  let el, timer;
  function show(msg, type='') {
    if (!el) el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = type ? `show ${type}` : 'show';
    clearTimeout(timer);
    timer = setTimeout(() => { el.className = ''; }, 3600);
  }
  return {
    success: m => show(m, 'success'),
    error:   m => show(m, 'error'),
    info:    m => show(m, 'info'),
  };
})();

// Generic fetch
async function api(url, method = 'GET', body = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res  = await fetch(url, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

// Badge
function badge(status) {
  const map = {
    Completed: 'b-green',  InProgress: 'b-cyan',  Accepted: 'b-violet',
    Requested: 'b-amber',  Cancelled:  'b-rose',
    Open:      'b-amber',  Resolved:   'b-green',  Dismissed: 'b-gray',
    Active:    'b-green',  Suspended:  'b-rose',   Banned: 'b-rose',
    Paid:      'b-green',  Pending:    'b-amber',   Failed: 'b-rose', Refunded: 'b-violet',
    Verified:  'b-green',  Unverified: 'b-amber',
    Online:    'b-green',  Offline:    'b-gray',   'In-Ride': 'b-cyan',
    Admin:     'b-violet', Rider:      'b-cyan',   Driver: 'b-amber',
    Economy:   'b-cyan',   Business:   'b-violet', Bike: 'b-green',
  };
  return `<span class="badge ${map[status] || 'b-gray'}">${status}</span>`;
}

// Stars
function stars(score) {
  return Array.from({ length: 5 }, (_, i) =>
    `<span style="color:${i < score ? '#F59E0B' : '#4A6080'}">★</span>`
  ).join('');
}

// PKR formatter
function pkr(n) {
  const v = Number(n || 0);
  return 'PKR\u00A0' + v.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// Modal helpers
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// Section switcher (used in all dashboards)
function showSection(sections, name, navEls) {
  sections.forEach(s => {
    const el = document.getElementById(`sec-${s}`);
    if (el) el.style.display = s === name ? '' : 'none';
  });
  if (navEls) navEls.forEach((el, i) => el.classList.toggle('active', i === sections.indexOf(name)));
}
