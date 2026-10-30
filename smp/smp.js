/* AF × SK Studios — SMP Sales Command Center (Supabase-backed, team-only) */
(function () {
  'use strict';
  var C = window.AF_CONFIG || {};
  var STAGES = ['New inquiry', 'Qualified', 'Consultation booked', 'Consultation completed', 'Deposit paid', 'Treatment completed', 'Lost'];
  var WON = ['Deposit paid', 'Treatment completed'];
  var SOURCES = ['Google', 'Meta', 'Groupon / Marketplace', 'Barber referral', 'Organic / Other'];
  var TASKS = [
    'Week 1: Approve package scope, consent, and offer terms',
    'Week 1: Publish SMP consultation landing page',
    'Week 1: Configure CRM, lead intake, response owner',
    'Week 2: Launch Google and Meta tracking + ads',
    'Week 2: Submit Groupon, Booksy / Vagaro listings',
    'Weeks 2–4: Recruit first 5 barber partners',
    'Month 2: Optimize campaigns by qualified appointments',
    'Month 2: Achieve 4 paid clients per month',
    'Month 3: Stabilize acquisition cost and referral pipeline',
    'Month 3: Complete campaign review and next-quarter plan'
  ];
  var DEFAULTS = { package_price: 2000, offer_code: 'AVF500', targets: { inquiries: 40, qualified: 20, consults: 16, paid: 4 }, monthly_revenue_target: 8000, annual_revenue_target: 96000, budget: { total: 1000, google: 450, meta: 350, tests: 200 }, weekly: { 'Google': 4, 'Meta': 3, 'Groupon / Marketplace': 2, 'Barber referral': 1 } };

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var money = function (n) { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(+n || 0); };
  var pct = function (a, b) { return b ? Math.min(100, Math.round(a / b * 100)) : 0; };
  function ymd(d) { var z = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return z.toISOString().slice(0, 10); }
  function monthKey(d) { return ymd(d).slice(0, 7); }
  function sameMonth(iso, key) { return !!iso && monthKey(new Date(iso)) === key; }
  function niceDate(s) { if (!s) return ''; var d = new Date(s + 'T12:00:00'); return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); }

  var sb = null, S = { user: null, admin: false, leads: [], spend: {}, plan: {}, settings: DEFAULTS, team: [], filter: 'Open', q: '', editing: null, tab: 'overview' };

  /* ---------- views ---------- */
  function show(v) { ['vLoading', 'vSignin', 'vNoAccess', 'vApp'].forEach(function (id) { $(id).hidden = id !== v; }); }
  var tt;
  function toast(m) { var t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(tt); tt = setTimeout(function () { t.hidden = true; }, 2600); }
  function setTab(name) {
    S.tab = name;
    document.querySelectorAll('.tab').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.tab === name ? 'true' : 'false'); });
    ['overview', 'hunt', 'leads', 'channels', 'plan', 'data'].forEach(function (t) { $('t-' + t).hidden = t !== name; });
    try { sessionStorage.setItem('smpTab', name); } catch (e) {}
    if (name === 'data') loadTeam();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  document.querySelectorAll('.tab').forEach(function (b) { b.addEventListener('click', function () { setTab(b.dataset.tab); }); });

  /* ---------- auth ---------- */
  function boot() {
    if (!window.supabase || !C.supabaseUrl) { $('vLoading').innerHTML = '<p class="err">Couldn’t load the sign-in service. Refresh to try again.</p>'; return; }
    sb = window.supabase.createClient(C.supabaseUrl, C.supabaseKey, { auth: { persistSession: true, storageKey: 'af-smp-auth' } });
    sb.auth.getSession().then(function (r) { var s = r.data && r.data.session; if (s) enter(s.user); else show('vSignin'); });
  }
  $('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var em = $('lEmail').value.trim(), pw = $('lPass').value;
    if (!em || !pw) { $('lErr').textContent = 'Enter your email and password.'; return; }
    $('lBtn').disabled = true; $('lBtn').textContent = 'Signing in…'; $('lErr').textContent = '';
    sb.auth.signInWithPassword({ email: em, password: pw }).then(function (r) {
      $('lBtn').disabled = false; $('lBtn').textContent = 'Sign in';
      if (r.error) { $('lErr').textContent = 'That email and password didn’t match a Command Center account.'; return; }
      $('lPass').value = ''; enter(r.data.user);
    });
  });
  document.querySelectorAll('[data-signout]').forEach(function (b) { b.addEventListener('click', function () { sb.auth.signOut().then(function () { S.user = null; show('vSignin'); }); }); });

  function enter(user) {
    S.user = user; show('vLoading');
    Promise.all([
      sb.rpc('sk_is_member'),
      sb.from('profiles').select('role').eq('id', user.id).maybeSingle()
    ]).then(function (r) {
      S.admin = !!(r[1].data && r[1].data.role === 'admin');
      if (r[0].error || !r[0].data) { $('naEmail').textContent = user.email; show('vNoAccess'); return; }
      $('who').textContent = user.email;
      if (window.Hunt) window.Hunt.init(sb, user, toast);
      return loadAll().then(function () {
        show('vApp'); $('offerPill').hidden = false;
        var t = 'overview'; try { t = sessionStorage.getItem('smpTab') || t; } catch (e) {}
        setTab(t);
      });
    }).catch(function () { $('vLoading').innerHTML = '<p class="err">Something went wrong loading the board. Refresh to try again.</p>'; show('vLoading'); });
  }

  /* ---------- data ---------- */
  function loadAll() {
    return Promise.all([
      sb.from('sk_leads').select('*').order('created_at', { ascending: false }),
      sb.from('sk_spend').select('*'),
      sb.from('sk_plan').select('*'),
      sb.from('sk_settings').select('data').eq('id', 1).maybeSingle()
    ]).then(function (r) {
      if (r[0].error) throw r[0].error;
      S.leads = r[0].data || [];
      S.spend = {}; (r[1].data || []).forEach(function (x) { S.spend[x.month.slice(0, 7)] = x; });
      S.plan = {}; (r[2].data || []).forEach(function (x) { S.plan[x.task_index] = x; });
      var d = (r[3].data && r[3].data.data) || {};
      S.settings = Object.assign({}, DEFAULTS, d, { targets: Object.assign({}, DEFAULTS.targets, d.targets), budget: Object.assign({}, DEFAULTS.budget, d.budget), weekly: Object.assign({}, DEFAULTS.weekly, d.weekly) });
      renderAll();
    });
  }
  function refresh() { if (S.user && !$('vApp').hidden && !S.editing) loadAll().catch(function () {}); }
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') refresh(); });
  setInterval(refresh, 60000);

  function renderAll() { renderOverview(); renderLeads(); renderChannels(); renderPlan(); renderSettings(); }

  /* ---------- overview ---------- */
  function stageIdx(s) { return STAGES.indexOf(s); }
  function reached(l, s) { return l.stage !== 'Lost' && stageIdx(l.stage) >= stageIdx(s); }
  function renderOverview() {
    var now = new Date(), mk = monthKey(now), T = S.settings.targets, L = S.leads;
    $('monthLabel').textContent = now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    var mLeads = L.filter(function (l) { return sameMonth(l.created_at, mk); });
    var won = L.filter(function (l) { return l.won_at && sameMonth(l.won_at, mk) && WON.indexOf(l.stage) >= 0; });
    var nums = { Inq: [mLeads.length, T.inquiries], Qual: [mLeads.filter(function (l) { return reached(l, 'Qualified'); }).length, T.qualified], Con: [mLeads.filter(function (l) { return reached(l, 'Consultation completed'); }).length, T.consults], Paid: [won.length, T.paid] };
    Object.keys(nums).forEach(function (k) { $('k' + k).textContent = nums[k][0]; $('k' + k + 'T').textContent = 'of ' + nums[k][1]; $('k' + k + 'B').style.width = pct(nums[k][0], nums[k][1]) + '%'; });
    var rev = won.reduce(function (a, l) { return a + (+l.package_value || 0); }, 0);
    $('revM').textContent = money(rev); $('revB').style.width = pct(rev, S.settings.monthly_revenue_target) + '%';
    $('revT').textContent = 'of ' + money(S.settings.monthly_revenue_target) + ' monthly target · ' + money(S.settings.annual_revenue_target) + ' / year';
    var yr = String(now.getFullYear());
    var ytd = L.filter(function (l) { return l.won_at && l.won_at.slice(0, 4) === yr && WON.indexOf(l.stage) >= 0; }).reduce(function (a, l) { return a + (+l.package_value || 0); }, 0);
    $('revY').textContent = money(ytd);
    var allWon = L.filter(function (l) { return WON.indexOf(l.stage) >= 0; }).length;
    $('closeRate').textContent = (L.length ? (allWon / L.length * 100).toFixed(1) : '0') + '%';

    var maxS = Math.max(1, Math.max.apply(null, STAGES.map(function (s) { return L.filter(function (l) { return l.stage === s; }).length; })));
    $('stageList').innerHTML = STAGES.map(function (s) {
      var n = L.filter(function (l) { return l.stage === s; }).length;
      return '<div class="row2' + (s === 'Lost' ? ' lost' : WON.indexOf(s) >= 0 ? ' won' : '') + '"><span class="nm">' + esc(s) + '</span><span class="ct">' + n + '</span><div class="bar"><i style="width:' + Math.round(n / maxS * 100) + '%"></i></div></div>';
    }).join('');

    var wk = new Date(now); wk.setHours(0, 0, 0, 0); wk.setDate(wk.getDate() - ((wk.getDay() + 6) % 7));
    var wLeads = L.filter(function (l) { return new Date(l.created_at) >= wk; });
    $('weekList').innerHTML = Object.keys(S.settings.weekly).map(function (src) {
      var goal = +S.settings.weekly[src] || 0, n = wLeads.filter(function (l) { return l.source === src; }).length;
      return '<div class="row2' + (n >= goal && goal ? ' won' : '') + '"><span class="nm">' + esc(src) + '</span><span class="ct">' + n + ' <small>/ ' + goal + '</small></span><div class="bar"><i style="width:' + pct(n, goal) + '%"></i></div></div>';
    }).join('') + '<p class="muted sm-t">Week starting ' + wk.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + '.</p>';

    var today = ymd(now), soon = ymd(new Date(now.getTime() + 2 * 864e5));
    var due = L.filter(function (l) { return l.next_followup && l.next_followup <= soon && l.stage !== 'Lost' && l.stage !== 'Treatment completed'; })
      .sort(function (a, b) { return a.next_followup < b.next_followup ? -1 : 1; }).slice(0, 8);
    $('dueList').innerHTML = due.length ? due.map(function (l) {
      var cls = l.next_followup < today ? 'late' : l.next_followup === today ? 'today' : '', lab = cls === 'late' ? 'Overdue · ' + niceDate(l.next_followup) : cls === 'today' ? 'Today' : niceDate(l.next_followup);
      return '<button class="due-item" type="button" data-open="' + l.id + '"><b>' + esc(l.name) + '</b><span class="when ' + cls + '">' + lab + '</span><span class="sub">' + esc(l.stage) + (l.owner ? ' · ' + esc(l.owner) : '') + '</span></button>';
    }).join('') : '<p class="empty">Nothing due in the next 2 days. Set follow-up dates on leads to see them here.</p>';
  }
  $('dueList').addEventListener('click', function (e) { var b = e.target.closest('[data-open]'); if (b) { setTab('leads'); openForm(S.leads.find(function (l) { return l.id === b.dataset.open; })); } });
  document.querySelectorAll('[data-goto-add]').forEach(function (b) { b.addEventListener('click', function () { setTab('leads'); openForm(null); }); });

  /* ---------- leads ---------- */
  $('fSource').innerHTML = SOURCES.map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('');
  $('fStage').innerHTML = STAGES.map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('');
  var FILTERS = ['Open', 'All', 'Won', 'Lost'].concat(STAGES.slice(0, 4));
  function renderFilters() {
    $('stageFilter').innerHTML = FILTERS.map(function (f) { return '<button type="button" class="chip f" aria-pressed="' + (S.filter === f) + '" data-f="' + esc(f) + '">' + esc(f) + '</button>'; }).join('');
  }
  $('stageFilter').addEventListener('click', function (e) { var b = e.target.closest('[data-f]'); if (b) { S.filter = b.dataset.f; renderLeads(); } });
  $('q').addEventListener('input', function () { S.q = this.value.trim().toLowerCase(); renderLeads(); });

  function contactLinks(c) {
    if (!c) return '';
    var t = c.trim();
    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(t)) return '<a href="mailto:' + esc(t) + '">' + esc(t) + '</a>';
    var digits = t.replace(/[^\d+]/g, '');
    if (digits.replace(/\D/g, '').length >= 7) return '<a href="tel:' + esc(digits) + '">Call ' + esc(t) + '</a><a href="sms:' + esc(digits) + '">Text</a>';
    return '<span>' + esc(t) + '</span>';
  }
  function renderLeads() {
    renderFilters();
    var today = ymd(new Date());
    var list = S.leads.filter(function (l) {
      var f = S.filter;
      if (f === 'Open' && (l.stage === 'Lost' || l.stage === 'Treatment completed')) return false;
      if (f === 'Won' && WON.indexOf(l.stage) < 0) return false;
      if (f !== 'Open' && f !== 'All' && f !== 'Won' && l.stage !== f) return false;
      if (S.q) return [l.name, l.contact, l.owner, l.notes, l.source].join(' ').toLowerCase().indexOf(S.q) >= 0;
      return true;
    });
    $('leadCount').textContent = list.length + (list.length === 1 ? ' lead' : ' leads') + ' · ' + S.leads.length + ' total';
    $('leadList').innerHTML = list.length ? list.map(function (l) {
      var cls = WON.indexOf(l.stage) >= 0 ? ' won' : l.stage === 'Lost' ? ' lost' : '';
      var late = l.next_followup && l.next_followup < today && cls !== ' lost';
      return '<article class="lc' + cls + '"><div class="lc-top"><span class="lc-name">' + esc(l.name) + '</span><span class="src">' + esc(l.source) + '</span></div>' +
        (l.contact ? '<div class="lc-contact">' + contactLinks(l.contact) + '</div>' : '') +
        '<div class="lc-meta">' + (l.owner ? '<span>Owner <b>' + esc(l.owner) + '</b></span>' : '') +
        (l.next_followup ? '<span class="' + (late ? 'late' : '') + '">Follow up <b>' + niceDate(l.next_followup) + '</b>' + (late ? ' · overdue' : '') + '</span>' : '') +
        '<span>' + money(l.package_value) + '</span><span>Added ' + new Date(l.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + '</span></div>' +
        (l.notes ? '<p class="lc-notes">' + esc(l.notes) + '</p>' : '') +
        '<div class="lc-actions"><div class="f"><label class="sr" for="st-' + l.id + '">Stage for ' + esc(l.name) + '</label><select id="st-' + l.id + '" data-stage="' + l.id + '">' +
        STAGES.map(function (s) { return '<option' + (s === l.stage ? ' selected' : '') + '>' + esc(s) + '</option>'; }).join('') + '</select></div>' +
        '<button class="icon-btn" type="button" data-edit="' + l.id + '" aria-label="Edit ' + esc(l.name) + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>' +
        '<button class="icon-btn" type="button" data-del="' + l.id + '" aria-label="Delete ' + esc(l.name) + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg></button></div></article>';
    }).join('') : '<p class="empty">' + (S.leads.length ? 'No leads match this filter.' : 'No leads yet. Tap “+ Add lead” to log your first inquiry.') + '</p>';
  }
  $('leadList').addEventListener('change', function (e) {
    var s = e.target.closest('[data-stage]'); if (!s) return;
    var l = S.leads.find(function (x) { return x.id === s.dataset.stage; }); if (!l) return;
    var prev = l.stage; l.stage = s.value; renderOverview(); renderLeads();
    sb.from('sk_leads').update({ stage: s.value }).eq('id', l.id).select().single().then(function (r) {
      if (r.error) { l.stage = prev; renderAll(); toast('Couldn’t update — try again.'); return; }
      Object.assign(l, r.data); renderAll(); toast(l.name + ' → ' + l.stage);
    });
  });
  $('leadList').addEventListener('click', function (e) {
    var ed = e.target.closest('[data-edit]'), del = e.target.closest('[data-del]');
    if (ed) openForm(S.leads.find(function (l) { return l.id === ed.dataset.edit; }));
    if (del) {
      var l = S.leads.find(function (x) { return x.id === del.dataset.del; }); if (!l) return;
      confirmBox('Delete ' + l.name + '?', 'This removes the lead for everyone on the team.').then(function (ok) {
        if (!ok) return;
        sb.from('sk_leads').delete().eq('id', l.id).then(function (r) {
          if (r.error) { toast('Couldn’t delete — try again.'); return; }
          S.leads = S.leads.filter(function (x) { return x.id !== l.id; }); renderAll(); toast('Lead deleted.');
        });
      });
    }
  });

  function openForm(l) {
    S.editing = l || 'new';
    $('formTitle').textContent = l ? 'Edit ' + l.name : 'New lead';
    $('fName').value = l ? l.name : ''; $('fContact').value = l ? l.contact || '' : '';
    $('fSource').value = l ? l.source : SOURCES[0]; $('fStage').value = l ? l.stage : STAGES[0];
    $('fOwner').value = l ? l.owner || '' : ''; $('fNext').value = l ? l.next_followup || '' : '';
    $('fValue').value = l ? l.package_value : S.settings.package_price; $('fNotes').value = l ? l.notes || '' : '';
    $('fErr').textContent = ''; $('leadForm').hidden = false; $('addToggle').setAttribute('aria-expanded', 'true');
    $('leadForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(function () { $('fName').focus({ preventScroll: true }); }, 350);
  }
  function closeForm() { S.editing = null; $('leadForm').hidden = true; $('addToggle').setAttribute('aria-expanded', 'false'); }
  $('addToggle').addEventListener('click', function () { if ($('leadForm').hidden) openForm(null); else closeForm(); });
  $('fCancel').addEventListener('click', closeForm);
  $('leadForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('fName').value.trim();
    if (!name) { $('fErr').textContent = 'Add the client’s name.'; $('fName').focus(); return; }
    var row = { name: name, contact: $('fContact').value.trim() || null, source: $('fSource').value, stage: $('fStage').value, owner: $('fOwner').value.trim() || null, next_followup: $('fNext').value || null, notes: $('fNotes').value.trim() || null, package_value: Math.max(0, Math.round(+$('fValue').value || 0)), campaign_code: S.settings.offer_code || null };
    $('fSave').disabled = true; $('fSave').textContent = 'Saving…';
    var editing = S.editing && S.editing !== 'new' ? S.editing : null;
    var q = editing ? sb.from('sk_leads').update(row).eq('id', editing.id).select().single() : sb.from('sk_leads').insert(row).select().single();
    q.then(function (r) {
      $('fSave').disabled = false; $('fSave').textContent = 'Save lead';
      if (r.error) { $('fErr').textContent = 'Couldn’t save — check the fields and try again.'; return; }
      if (editing) Object.assign(editing, r.data); else S.leads.unshift(r.data);
      closeForm(); renderAll(); toast(editing ? 'Lead updated.' : 'Lead added.');
    });
  });

  /* ---------- channels ---------- */
  function spendTotal(s) { return s ? (+s.google || 0) + (+s.meta || 0) + (+s.marketplace || 0) + (+s.other || 0) : 0; }
  function renderChannels() {
    var B = S.settings.budget;
    $('planTiles').innerHTML = [['Monthly ad budget', B.total], ['Google', B.google], ['Meta', B.meta], ['Tests / creative', B.tests]].map(function (x, i) {
      return '<div class="kpi plan-tile' + (i === 0 ? ' hotk' : '') + '"><span class="k">' + x[0] + '</span><span class="v">' + money(x[1]) + '</span><span class="d">planned</span></div>';
    }).join('');
    if (!$('sMonth').value) $('sMonth').value = monthKey(new Date());
    fillSpend();
    var mix = SOURCES.map(function (s) { return [s, S.leads.filter(function (l) { return l.source === s; }).length]; });
    var mx = Math.max(1, Math.max.apply(null, mix.map(function (m) { return m[1]; })));
    $('mixList').innerHTML = mix.map(function (m) { return '<div class="row2"><span class="nm">' + esc(m[0]) + '</span><span class="ct">' + m[1] + '</span><div class="bar"><i style="width:' + Math.round(m[1] / mx * 100) + '%"></i></div></div>'; }).join('');
  }
  function fillSpend() {
    var mk = $('sMonth').value, s = S.spend[mk] || {};
    $('sGoogle').value = s.google ? +s.google : ''; $('sMeta').value = s.meta ? +s.meta : ''; $('sMarket').value = s.marketplace ? +s.marketplace : ''; $('sOther').value = s.other ? +s.other : '';
    updSpendTotal(); roi(mk);
  }
  function updSpendTotal() { $('sTotal').textContent = money(['sGoogle', 'sMeta', 'sMarket', 'sOther'].reduce(function (a, id) { return a + Math.max(0, +$(id).value || 0); }, 0)); }
  function roi(mk) {
    var d = new Date(mk + '-01T12:00:00'); $('roiMonth').textContent = d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    var spend = spendTotal(S.spend[mk]);
    var leads = S.leads.filter(function (l) { return sameMonth(l.created_at, mk); }).length;
    var won = S.leads.filter(function (l) { return l.won_at && sameMonth(l.won_at, mk) && WON.indexOf(l.stage) >= 0; });
    var sales = won.reduce(function (a, l) { return a + (+l.package_value || 0); }, 0);
    $('cpl').textContent = spend && leads ? money(spend / leads) : '—';
    $('cpc').textContent = spend && won.length ? money(spend / won.length) : '—';
    $('roiSales').textContent = money(sales);
    $('roas').textContent = spend ? (sales / spend).toFixed(1) + '×' : '—';
  }
  $('sMonth').addEventListener('change', fillSpend);
  ['sGoogle', 'sMeta', 'sMarket', 'sOther'].forEach(function (id) { $(id).addEventListener('input', updSpendTotal); });
  $('spendForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var mk = $('sMonth').value; if (!mk) return;
    var row = { month: mk + '-01', google: Math.max(0, +$('sGoogle').value || 0), meta: Math.max(0, +$('sMeta').value || 0), marketplace: Math.max(0, +$('sMarket').value || 0), other: Math.max(0, +$('sOther').value || 0), updated_at: new Date().toISOString() };
    $('sSave').disabled = true;
    sb.from('sk_spend').upsert(row, { onConflict: 'month' }).select().single().then(function (r) {
      $('sSave').disabled = false;
      if (r.error) { toast('Couldn’t save spend.'); return; }
      S.spend[mk] = r.data; roi(mk); toast('Spend saved.');
    });
  });

  /* ---------- plan ---------- */
  function renderPlan() {
    var done = TASKS.filter(function (_, i) { return S.plan[i] && S.plan[i].done; }).length, p = pct(done, TASKS.length);
    $('planPct').textContent = p + '%'; $('planBar').style.width = p + '%';
    $('taskList').innerHTML = TASKS.map(function (t, i) {
      var parts = t.split(': '), on = !!(S.plan[i] && S.plan[i].done), at = on && S.plan[i].done_at ? new Date(S.plan[i].done_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '';
      return '<label class="task' + (on ? ' done' : '') + '"><input type="checkbox" data-task="' + i + '"' + (on ? ' checked' : '') + '><span class="bx" aria-hidden="true">' + (on ? '✓' : '') + '</span><span><span class="wk">' + esc(parts[0]) + '</span><span class="tt">' + esc(parts.slice(1).join(': ')) + '</span>' + (at ? '<span class="by">Done ' + at + '</span>' : '') + '</span></label>';
    }).join('');
  }
  $('taskList').addEventListener('change', function (e) {
    var c = e.target.closest('[data-task]'); if (!c) return;
    var i = +c.dataset.task, on = c.checked;
    S.plan[i] = { task_index: i, done: on, done_at: on ? new Date().toISOString() : null }; renderPlan();
    sb.from('sk_plan').upsert({ task_index: i, done: on, done_by: on ? S.user.id : null, done_at: on ? new Date().toISOString() : null }, { onConflict: 'task_index' }).then(function (r) {
      if (r.error) { S.plan[i].done = !on; renderPlan(); toast('Couldn’t save — try again.'); }
    });
  });

  /* ---------- settings + team ---------- */
  function renderSettings() {
    var s = S.settings;
    $('tPrice').value = s.package_price; $('tCode').value = s.offer_code || '';
    $('tInq').value = s.targets.inquiries; $('tQual').value = s.targets.qualified; $('tCon').value = s.targets.consults; $('tPaid').value = s.targets.paid;
    $('tRev').value = s.monthly_revenue_target; $('tBud').value = s.budget.total;
    var pill = money(s.package_price) + (s.offer_code ? ' · ' + s.offer_code : '');
    $('offerPill').textContent = pill; $('footCode').textContent = s.offer_code || '';
  }
  $('setForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var n = function (id) { return Math.max(0, Math.round(+$(id).value || 0)); };
    var d = JSON.parse(JSON.stringify(S.settings));
    d.package_price = n('tPrice'); d.offer_code = $('tCode').value.trim();
    d.targets = { inquiries: n('tInq'), qualified: n('tQual'), consults: n('tCon'), paid: n('tPaid') };
    d.monthly_revenue_target = n('tRev'); d.annual_revenue_target = n('tRev') * 12; d.budget.total = n('tBud');
    sb.from('sk_settings').update({ data: d, updated_at: new Date().toISOString() }).eq('id', 1).then(function (r) {
      if (r.error) { toast('Couldn’t save targets.'); return; }
      S.settings = d; renderAll(); toast('Targets saved.');
    });
  });
  function loadTeam() {
    if (!sb) return;
    sb.rpc('sk_team_list').then(function (r) {
      S.team = r.data || [];
      $('teamList').innerHTML = S.team.length ? S.team.map(function (m) {
        var lv = m.is_admin ? 'AF admin' : m.access === 'studio' ? 'SK Studios' : 'AF team';
        return '<div class="member"><span><span class="em">' + esc(m.full_name || m.email) + '</span><br><span class="muted sm-t">' + esc(m.email) + '</span></span><span class="lv">' + lv + '</span>' +
          (S.admin && !m.is_admin ? '<button class="linkish" type="button" data-revoke="' + m.user_id + '">Remove</button>' : '') + '</div>';
      }).join('') : '<p class="empty">Couldn’t load the team list.</p>';
      $('grantForm').hidden = !S.admin;
      $('teamNote').textContent = S.admin ? 'AF admins always have access. The person needs a Command Center login first.' : 'Only AF admins can add or remove people.';
    });
  }
  $('teamList').addEventListener('click', function (e) {
    var b = e.target.closest('[data-revoke]'); if (!b) return;
    confirmBox('Remove access?', 'They’ll lose access to this board right away.').then(function (ok) {
      if (!ok) return;
      sb.rpc('sk_revoke_access', { p_user: b.dataset.revoke }).then(function (r) { if (r.error) toast('Couldn’t remove.'); else { toast('Access removed.'); loadTeam(); } });
    });
  });
  $('grantForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var em = $('gEmail').value.trim(); $('gErr').textContent = '';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { $('gErr').textContent = 'Enter a valid email.'; return; }
    sb.rpc('sk_grant_access', { p_email: em, p_access: $('gAccess').value }).then(function (r) {
      if (r.error) { $('gErr').textContent = 'Couldn’t give access.'; return; }
      if (r.data === 'not_found') { $('gErr').textContent = 'No Command Center account uses that email yet. Have them create one first.'; return; }
      $('gEmail').value = ''; toast('Access granted.'); loadTeam();
    });
  });

  /* ---------- export ---------- */
  function download(name, body, type) { var a = document.createElement('a'), u = URL.createObjectURL(new Blob([body], { type: type })); a.href = u; a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(u); a.remove(); }, 1000); }
  $('exCSV').addEventListener('click', function () {
    var cols = ['name', 'contact', 'source', 'stage', 'owner', 'next_followup', 'package_value', 'campaign_code', 'notes', 'created_at', 'won_at'];
    var csv = [cols.join(',')].concat(S.leads.map(function (r) { return cols.map(function (c) { return '"' + String(r[c] == null ? '' : r[c]).replace(/"/g, '""') + '"'; }).join(','); })).join('\n');
    download('sk-studios-leads-' + ymd(new Date()) + '.csv', csv, 'text/csv');
  });
  $('exJSON').addEventListener('click', function () {
    download('sk-studios-backup-' + ymd(new Date()) + '.json', JSON.stringify({ exported_at: new Date().toISOString(), settings: S.settings, leads: S.leads, spend: S.spend, plan: S.plan }, null, 2), 'application/json');
  });

  /* ---------- confirm dialog ---------- */
  function confirmBox(title, text) {
    var d = $('confirmDlg'); $('cTitle').textContent = title; $('cText').textContent = text;
    if (!d.showModal) return Promise.resolve(window.confirm(title));
    return new Promise(function (res) { d.returnValue = ''; d.showModal(); d.addEventListener('close', function h() { d.removeEventListener('close', h); res(d.returnValue === 'yes'); }); });
  }

  boot();
})();
