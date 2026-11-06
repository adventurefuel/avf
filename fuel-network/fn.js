/* The Fuel Intelligence Network — private org chart for AF's paid media bot workforce */
(function () {
  'use strict';
  var C = window.AF_CONFIG || {};
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var STATUS = { proposed: 'Proposed', building: 'Building', testing: 'Testing', live: 'Live', paused: 'Paused' };
  var sb = null, S = { user: null, admin: false, bots: [], byId: {}, net: null, running: false };

  /* ---------- bot faces (branded neon fire crew) ---------- */
  function face(id) {
    var F = function (cx, by, s, cls) {
      return '<g transform="translate(' + cx + ' ' + by + ') scale(' + s + ')"><g class="fl' + (cls ? ' ' + cls : '') + '">' +
        '<path class="fo" d="M0 0C-9 0-12-7-10-13C-8-18-4-20-3-27C1-23 3-19 2-14C4-16 6-18 6-22C10-17 12-10 10-5C8-1 4 0 0 0Z"/>' +
        '<path class="fi" d="M0 0C-5 0-6-4-5-7C-4-10-2-11-1-15C2-12 3-9 3-7C4-8 5-9 5-11C7-8 7-4 5-2C4-.5 2 0 0 0Z"/>' +
        '<path class="fc" d="M0 0C-2 0-3-2-2-4C-1-5 0-6 0-8C2-6 3-4 2-2C2-1 1 0 0 0Z"/></g></g>';
    };
    var defs = '<defs><linearGradient id="afbS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4D6"/><stop offset=".45" stop-color="#FFC633"/><stop offset="1" stop-color="#FF6B1A"/></linearGradient></defs>';
    var ears = '<rect class="ear" x="9" y="62" width="11" height="26" rx="5"/><rect class="ear" x="100" y="62" width="11" height="26" rx="5"/>';
    var head = '<rect class="head" x="20" y="42" width="80" height="66" rx="20"/>';
    var mouth = '<rect class="mouth" x="46" y="90" width="28" height="7" rx="3.5"/>';
    var ant = '<line class="stalk" x1="60" y1="42" x2="60" y2="32"/><circle class="bulb" cx="60" cy="30" r="3.6"/>' + F(60, 28, .9);
    var top = '', eyes = '', extra = '', after = '';
    switch (id) {
      case 'lucille':
        ant = '';
        top = '<g class="crownfl">' + F(46, 30, .7, 'd1') + F(60, 26, .95) + F(74, 30, .7, 'd2') + '</g>' +
          '<path class="crown" d="M30 44 L28 24 L44 34 L60 18 L76 34 L92 24 L90 44 Z"/><circle class="cball" cx="28" cy="23" r="3.4"/><circle class="cball" cx="92" cy="23" r="3.4"/><circle class="cball" cx="60" cy="17" r="3"/>';
        eyes = '<g class="eyes"><path class="lid" d="M35 70q8-9 16 0"/><path class="lid" d="M69 70q8-9 16 0"/></g>';
        mouth = '<path class="smile" d="M48 86q12 9 24 0"/>';
        extra = '<path class="mic" d="M101 80q4 18-14 22"/><rect class="micend" x="80" y="98" width="10" height="6" rx="3"/>';
        break;
      case 'fuel':
        eyes = '<rect class="visor" x="30" y="60" width="60" height="20" rx="10"/><g class="eyes scan"><path d="M38 66 L52 69 L48 74 L39 72Z"/><path d="M82 66 L68 69 L72 74 L81 72Z"/></g>';
        break;
      case 'spark':
        ant = '';
        eyes = '<g class="eyes fe">' + F(43, 78, .72, 'd1') + F(77, 78, .72, 'd2') + '</g>';
        mouth = '<path class="smile" d="M47 88q13 10 26 0"/>';
        break;
      case 'grid':
        head = '<rect class="head" x="20" y="42" width="80" height="66" rx="14"/><path class="gridlines" d="M24 64H96M24 86H96M47 46V104M73 46V104"/>';
        ant = '<line class="stalk" x1="40" y1="42" x2="40" y2="32"/><line class="stalk" x1="80" y1="42" x2="80" y2="32"/>' + F(40, 31, .75, 'd1') + F(80, 31, .75, 'd2');
        eyes = '<g class="bars"><rect class="bar b1" x="33" y="78" width="9" height="8" rx="1"/><rect class="bar b2" x="46" y="72" width="9" height="14" rx="1"/><rect class="bar b3" x="59" y="66" width="9" height="20" rx="1"/><rect class="bar b4" x="72" y="56" width="9" height="30" rx="1"/></g>';
        mouth = '<rect class="mouth" x="48" y="94" width="24" height="6" rx="3"/>';
        break;
      case 'pulse':
        eyes = '<rect class="visor" x="28" y="62" width="64" height="18" rx="9"/><g class="boltg"><path class="trail" d="M66 64 C76 62 84 64 92 60 C86 66 88 70 80 74 C76 72 70 72 64 72Z"/><path class="bolt" d="M64 56 L48 74 H58 L52 88 L72 66 H62 Z"/></g>';
        break;
      case 'scout':
        ant = '';
        head = '<path class="head" d="M20 60 Q20 46 34 44 L60 32 L86 44 Q100 46 100 60 V90 Q100 108 80 108 H40 Q20 108 20 90 Z"/><path class="hood" d="M24 54 L60 38 L96 54"/>';
        after = F(60, 62, .75);
        eyes = '<g class="eyes"><circle cx="43" cy="76" r="6.5"/><circle cx="77" cy="76" r="6.5"/></g>';
        break;
      case 'hunter':
        eyes = '<g class="eyes"><circle cx="40" cy="74" r="6"/></g><g class="xh"><circle class="lens" cx="76" cy="74" r="12"/><path class="xhair" d="M76 56V64M76 84V92M58 74H66M86 74H94"/></g>' + F(76, 81, .45);
        mouth = '<path class="smirk" d="M36 92q9 6 20-1"/>';
        break;
      case 'black_mamba':
        ant = '';
        after = '<g class="hair">' + F(60, 52, 1.55) + '</g>';
        head = '<path class="head" d="M20 62 Q20 44 38 44 L48 44 L54 34 L60 46 L66 34 L72 44 L82 44 Q100 44 100 62 V90 Q100 108 80 108 H40 Q20 108 20 90 Z"/>';
        eyes = '<g class="eyes mad"><path d="M32 66 L52 74 L44 78 Z"/><path d="M88 66 L68 74 L76 78 Z"/></g>';
        mouth = '<path class="grin" d="M38 86 Q60 92 82 86 Q78 104 60 104 Q42 104 38 86Z"/><path class="fang" d="M44 88 L48 96 L52 89 L56 97 L60 90 L64 97 L68 89 L72 96 L76 88"/>';
        break;
    }
    return '<svg class="bot bot-' + id + '" viewBox="0 0 120 120" aria-hidden="true">' + defs + top + ant + ears + head + eyes + mouth + extra + after + '</svg>';
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
