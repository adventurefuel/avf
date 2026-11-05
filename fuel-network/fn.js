/* The Fuel Intelligence Network — private org chart for AF's paid media bot workforce */
(function () {
  'use strict';
  var C = window.AF_CONFIG || {};
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var STATUS = { proposed: 'Proposed', building: 'Building', testing: 'Testing', live: 'Live', paused: 'Paused' };
  var sb = null, S = { user: null, admin: false, bots: [], byId: {}, net: null, running: false };

  /* ---------- bot faces (original robots — one personality each) ---------- */
  function face(id) {
    var eyes = '<g class="eyes"><rect x="38" y="52" width="14" height="14" rx="7"/><rect x="68" y="52" width="14" height="14" rx="7"/></g>';
    var head = '<rect class="head" x="22" y="34" width="76" height="64" rx="18"/>';
    var ant = '<line class="stalk" x1="60" y1="34" x2="60" y2="18"/><circle class="bulb" cx="60" cy="14" r="6"/>';
    var mouth = '<rect class="mouth" x="46" y="76" width="28" height="6" rx="3"/>';
    var ears = '<rect class="ear" x="14" y="56" width="8" height="20" rx="3"/><rect class="ear" x="98" y="56" width="8" height="20" rx="3"/>';
    var extra = '', cls = id;
    switch (id) {
      case 'lucille':
        ant = '<path class="crown" d="M42 32 L46 14 L54 26 L60 10 L66 26 L74 14 L78 32 Z"/><circle class="bulb" cx="60" cy="10" r="3.5"/>';
        eyes = '<g class="eyes"><path d="M37 60 q8 -9 16 0" class="lid"/><path d="M67 60 q8 -9 16 0" class="lid"/></g>';
        extra = '<path class="mic" d="M100 70 q10 14 -8 22"/><circle class="micend" cx="90" cy="92" r="3.5"/>';
        mouth = '<path class="smile" d="M48 78 q12 8 24 0"/>';
        break;
      case 'fuel':
        ant = '<line class="stalk" x1="60" y1="34" x2="60" y2="24"/><path class="flame" d="M60 2 C70 12 70 18 66 23 C64 26 56 26 54 23 C50 18 52 12 56 9 C56 14 58 15 60 13 C61 10 59 6 60 2 Z"/>';
        eyes = '<g class="eyes"><rect class="visor" x="32" y="52" width="56" height="14" rx="7"/><rect x="40" y="55" width="12" height="8" rx="4"/><rect x="68" y="55" width="12" height="8" rx="4"/></g>';
        break;
      case 'spark':
        ant = '<path class="bolt" d="M64 2 L50 20 H59 L54 34 L70 14 H61 Z"/>';
        eyes = '<g class="eyes"><circle cx="45" cy="59" r="9"/><circle cx="75" cy="59" r="9"/><circle class="glint" cx="48" cy="56" r="2.5"/><circle class="glint" cx="78" cy="56" r="2.5"/></g>';
        mouth = '<path class="smile" d="M46 78 q14 10 28 0"/>';
        break;
      case 'grid':
        head = '<rect class="head" x="22" y="34" width="76" height="64" rx="6"/><path class="gridlines" d="M22 55 H98 M22 76 H98 M47 34 V98 M73 34 V98"/>';
        eyes = '<g class="eyes"><rect x="34" y="46" width="13" height="13" rx="2"/><rect x="73" y="46" width="13" height="13" rx="2"/></g>';
        mouth = '<rect class="mouth" x="48" y="82" width="24" height="5" rx="1"/>';
        ant = '<line class="stalk" x1="40" y1="34" x2="40" y2="22"/><line class="stalk" x1="80" y1="34" x2="80" y2="22"/><rect class="bulb" x="35" y="16" width="10" height="7" rx="1"/><rect class="bulb" x="75" y="16" width="10" height="7" rx="1"/>';
        break;
      case 'pulse':
        eyes = '<g class="eyes"><rect class="visor" x="30" y="50" width="60" height="20" rx="10"/><path class="beat" d="M34 60 H48 L52 52 L57 68 L62 55 L66 60 H86"/></g>';
        break;
      case 'scout':
        eyes = '<g class="eyes"><circle class="lens" cx="74" cy="59" r="13"/><circle cx="74" cy="59" r="6"/><rect x="38" y="54" width="12" height="10" rx="5"/></g>';
        ant = '<line class="stalk" x1="52" y1="34" x2="46" y2="18"/><circle class="bulb" cx="45" cy="14" r="5"/>';
        break;
      case 'hunter':
        eyes = '<g class="eyes"><rect x="38" y="54" width="12" height="10" rx="5"/><circle class="lens" cx="74" cy="59" r="11"/><path class="xhair" d="M74 44 V52 M74 66 V74 M59 59 H67 M81 59 H89"/><circle cx="74" cy="59" r="2.5"/></g>';
        mouth = '<path class="smirk" d="M48 80 q10 4 22 -3"/>';
        break;
      case 'black_mamba':
        head = '<path class="head" d="M24 50 Q24 34 42 34 H78 Q96 34 96 50 V82 Q96 98 78 98 H42 Q24 98 24 82 Z"/>';
        eyes = '<g class="eyes"><path d="M34 62 L52 54 L52 64 Z"/><path d="M86 62 L68 54 L68 64 Z"/></g>';
        mouth = '<path class="fang" d="M52 80 L56 90 L60 80 M60 80 L64 90 L68 80"/><path class="mouthline" d="M46 80 H74"/>';
        ant = '<path class="stalk" d="M60 34 Q60 24 68 20 Q76 16 72 8"/><circle class="bulb" cx="72" cy="8" r="4"/>';
        break;
    }
    return '<svg class="bot bot-' + cls + '" viewBox="0 0 120 112" aria-hidden="true">' + ant + ears + head + eyes + mouth + extra + '</svg>';
  }

  /* ---------- views ---------- */
  function show(v) { ['vLoading', 'vSignin', 'vNoAccess', 'vApp'].forEach(function (id) { $(id).hidden = id !== v; }); $('signOut').hidden = v === 'vSignin' || v === 'vLoading'; }
  var tt; function toast(m) { var t = $('toast'); t.textContent = m; t.hidden = false; clearTimeout(tt); tt = setTimeout(function () { t.hidden = true; }, 2600); }

  function boot() {
    if (!window.supabase || !C.supabaseUrl) { $('vLoading').innerHTML = '<p class="err">Couldn’t load sign-in. Refresh to try again.</p>'; return; }
    sb = window.supabase.createClient(C.supabaseUrl, C.supabaseKey, { auth: { persistSession: true, storageKey: 'af-fn-auth' } });
    sb.auth.getSession().then(function (r) { var s = r.data && r.data.session; if (s) enter(s.user); else show('vSignin'); });
  }
  $('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var em = $('lEmail').value.trim(), pw = $('lPass').value;
    if (!em || !pw) { $('lErr').textContent = 'Enter your email and password.'; return; }
    $('lBtn').disabled = true; $('lBtn').textContent = 'Booting…'; $('lErr').textContent = '';
    sb.auth.signInWithPassword({ email: em, password: pw }).then(function (r) {
      $('lBtn').disabled = false; $('lBtn').textContent = 'Boot up';
      if (r.error) { $('lErr').textContent = 'That email and password didn’t match a Command Center account.'; return; }
      $('lPass').value = ''; enter(r.data.user);
    });
  });
  $('signOut').addEventListener('click', function () { sb.auth.signOut().then(function () { show('vSignin'); }); });

  function enter(user) {
    S.user = user; show('vLoading');
    Promise.all([
      sb.from('profiles').select('role').eq('id', user.id).maybeSingle(),
      sb.from('af_bots').select('*').order('sort'),
      sb.from('af_network').select('data').eq('id', 1).maybeSingle()
    ]).then(function (r) {
      if (!r[0].data) { show('vNoAccess'); return; }
      S.admin = r[0].data.role === 'admin';
      if (r[1].error || !r[1].data || !r[1].data.length || !r[2].data) { $('vLoading').innerHTML = '<p class="err">Couldn’t load the network. Refresh to try again.</p>'; show('vLoading'); return; }
      S.bots = r[1].data; S.byId = {}; S.bots.forEach(function (b) { S.byId[b.id] = b; });
      S.net = r[2].data.data;
      $('who').textContent = user.email;
      render(); show('vApp');
    }).catch(function () { $('vLoading').innerHTML = '<p class="err">Something went wrong. Refresh to try again.</p>'; show('vLoading'); });
  }

  /* ---------- render ---------- */
  function pill(b) { return '<span class="st st-' + b.status + '"><i class="led"></i>' + STATUS[b.status] + '</span>'; }
  function card(b, size) {
    return '<button type="button" class="bc bc-' + size + ' lane-' + b.lane + '" data-bot="' + b.id + '" aria-label="Open ' + esc(b.name) + ', ' + esc(b.title) + '">' +
      '<span class="bc-av">' + face(b.id) + '<span class="bubble" aria-hidden="true">' + esc(b.quip || '') + '</span></span>' +
      '<span class="bc-txt"><span class="bc-name">' + esc(b.name) + '</span><span class="bc-title">' + esc(b.title) + '</span>' +
      (size !== 'mini' ? '<span class="bc-sum">' + esc(b.summary) + '</span>' : '') + pill(b) + '</span></button>';
  }
  function render() {
    var N = S.net;
    $('hKicker').textContent = N.kicker; $('hTag').textContent = N.tagline; $('hEngine').textContent = N.engine; $('fFoot').textContent = N.footer;
    var live = S.bots.filter(function (b) { return b.status === 'live'; }).length;
    $('hCount').textContent = S.bots.length + ' specialists'; $('hLive').textContent = live + ' live · ' + (S.bots.length - live) + ' in the shop';
    $('heroBots').innerHTML = S.bots.map(function (b, i) { return '<span class="hb" style="--i:' + i + '">' + face(b.id) + '</span>'; }).join('');

    var top = S.bots.filter(function (b) { return !b.parent; })[0];
    var heads = S.bots.filter(function (b) { return b.parent === top.id; });
    $('org').innerHTML = '<div class="org-top">' + card(top, 'lg') + '</div><div class="org-bus" aria-hidden="true"></div>' +
      '<div class="org-row">' + heads.map(function (h) {
        var kids = S.bots.filter(function (b) { return b.parent === h.id; });
        return '<div class="org-col' + (kids.length ? ' has-kids' : '') + '">' + card(h, 'md') + (kids.length ? '<div class="org-kids">' + kids.map(function (k) { return card(k, 'mini'); }).join('') + '</div>' : '') + '</div>';
      }).join('') + '</div>';

    $('loop').innerHTML = N.loop.map(function (s, i) {
      var nm = function (ids) { return ids.map(function (id) { return '<b>' + esc(S.byId[id] ? S.byId[id].name : id) + '</b>'; }).join(' + '); };
      return '<li class="ls" data-step="' + i + '"><span class="ls-n">' + (i + 1) + '</span><div><div class="ls-route">' + nm(s.from) + ' <span class="arrow" aria-hidden="true">→</span> ' + nm(s.to) + '</div><p>' + esc(s.text) + '</p></div></li>';
    }).join('');
    $('rules').innerHTML = N.rules.map(function (r) { return '<article class="rule"><span class="rule-n">' + esc(r.n) + '</span><h3>' + esc(r.title) + '</h3><p>' + esc(r.text) + '</p></article>'; }).join('');
  }

  /* ---------- bot file ---------- */
  var dlg = $('botDlg');
  function openBot(id) {
    var b = S.byId[id]; if (!b) return;
    var reports = b.parent ? S.byId[b.parent] : null, team = S.bots.filter(function (x) { return x.parent === b.id; });
    var loopIn = S.net.loop.filter(function (s) { return s.to.indexOf(id) >= 0; }), loopOut = S.net.loop.filter(function (s) { return s.from.indexOf(id) >= 0; });
    var html = '<div class="file-head"><span class="file-av">' + face(b.id) + '</span><div><span class="eyebrow">Bot file · ' + esc(b.lane) + '</span><h3 id="dName">' + esc(b.name) + '</h3><p class="file-title">' + esc(b.title) + '</p>' + pill(b) + '</div>' +
      '<button class="x-btn" type="button" data-close aria-label="Close">×</button></div>' +
      '<p class="file-quip">“' + esc(b.quip) + '”</p><p class="file-sum">' + esc(b.summary) + '</p>' +
      '<div class="file-grid"><div><span class="say">Owns</span><ul>' + b.owns.map(function (o) { return '<li>' + esc(o) + '</li>'; }).join('') + '</ul></div>' +
      '<div><span class="say">Takes in</span><p>' + esc(b.inputs) + '</p><span class="say">Hands off</span><p>' + esc(b.outputs) + '</p></div></div>' +
      '<div class="file-guard"><span class="say">Human approval</span><p>' + esc(b.approval) + '</p></div>' +
      '<div class="file-links">' + (reports ? '<span>Reports to <button type="button" class="link-bot" data-bot="' + reports.id + '">' + esc(reports.name) + '</button></span>' : '<span>Reports to <b>the human owner</b></span>') +
      (team.length ? '<span>Leads ' + team.map(function (t) { return '<button type="button" class="link-bot" data-bot="' + t.id + '">' + esc(t.name) + '</button>'; }).join(', ') + '</span>' : '') +
      '<span>In the loop: ' + (loopIn.length + loopOut.length) + ' handoff' + (loopIn.length + loopOut.length === 1 ? '' : 's') + '</span></div>';
    if (S.admin) {
      html += '<form class="file-edit" id="statusForm"><span class="say">Build status · admins</span><div class="two"><div class="f"><label for="bStatus">Status</label><select id="bStatus">' +
        Object.keys(STATUS).map(function (k) { return '<option value="' + k + '"' + (b.status === k ? ' selected' : '') + '>' + STATUS[k] + '</option>'; }).join('') + '</select></div>' +
        '<div class="f"><label for="bNote">Note</label><input id="bNote" maxlength="500" value="' + esc(b.status_note || '') + '" placeholder="What’s blocking or next"></div></div>' +
        '<button class="btn btn-fuel sm" type="submit">Save status</button></form>';
    } else if (b.status_note) { html += '<div class="file-guard"><span class="say">Status note</span><p>' + esc(b.status_note) + '</p></div>'; }
    if (b.updated_at) html += '<p class="muted sm-t">Updated ' + new Date(b.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) + '</p>';
    $('botBody').innerHTML = html; $('botBody').dataset.file = id;
    if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); }
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-bot]'); if (b && !S.running) { openBot(b.dataset.bot); return; }
    if (e.target.closest('[data-close]')) dlg.close();
  });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('submit', function (e) {
    if (e.target.id !== 'statusForm') return; e.preventDefault();
    var id = $('botBody').dataset.file, row = { status: $('bStatus').value, status_note: $('bNote').value.trim() || null, updated_by: S.user.id, updated_at: new Date().toISOString() };
    sb.from('af_bots').update(row).eq('id', id).select().single().then(function (r) {
      if (r.error || !r.data) { toast('Couldn’t save — admins only.'); return; }
      Object.assign(S.byId[id], r.data); render(); openBot(id); toast(S.byId[id].name + ' → ' + STATUS[row.status]);
    });
  });

  /* ---------- run the loop ---------- */
  $('runLoop').addEventListener('click', function () {
    if (S.running) return;
    S.running = true; var btn = this; btn.disabled = true; btn.querySelector('span').textContent = 'Running…';
    document.body.classList.add('looping');
    var steps = S.net.loop, i = 0;
    $('org').scrollIntoView({ behavior: 'smooth', block: 'start' });
    function clear() { document.querySelectorAll('.bc.tx,.bc.rx,.ls.on').forEach(function (el) { el.classList.remove('tx', 'rx', 'on'); }); document.querySelectorAll('.bc .bubble.say-step').forEach(function (el) { el.classList.remove('say-step'); el.textContent = el.dataset.quip || el.textContent; }); }
    function step() {
      clear();
      if (i >= steps.length) { S.running = false; btn.disabled = false; btn.querySelector('span').textContent = 'Run it again'; document.body.classList.remove('looping'); toast('Loop complete — the next cycle starts sharper.'); return; }
      var s = steps[i];
      s.from.forEach(function (id) { var el = document.querySelector('.bc[data-bot="' + id + '"]'); if (el) { el.classList.add('tx'); var bb = el.querySelector('.bubble'); bb.dataset.quip = bb.dataset.quip || bb.textContent; bb.textContent = s.text; bb.classList.add('say-step'); } });
      s.to.forEach(function (id) { var el = document.querySelector('.bc[data-bot="' + id + '"]'); if (el) el.classList.add('rx'); });
      var li = document.querySelector('.ls[data-step="' + i + '"]'); if (li) li.classList.add('on');
      i++; setTimeout(step, 2600);
    }
    setTimeout(step, 500);
  });

  boot();
})();
