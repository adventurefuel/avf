/* Adventure Fuel — Socials Setup tool */
(function () {
  'use strict';

  var PHASES = [
    { name: 'Account Foundation', steps: [
      { title: 'Convert Instagram to a Professional Business Account', req: true,
        why: 'Scheduling, Business Suite access, insights, ads, and permission-based team access all depend on the Instagram account being set up correctly.',
        todo: ['Open Instagram → Profile → Menu → Settings and activity.', 'Confirm the client Instagram is a Professional account.', 'Choose Business rather than Creator for a standard local-business operating account unless strategy requires otherwise.', 'Confirm business category, contact options, bio, and website are current.'],
        ex: '@4drip313 → Business account → category: Clothing / Shopping & Retail → contact path points to the 4DRIP landing page.',
        checks: [['Business account is active', 1], ['Profile image and bio are on-brand', 1], ['Website / landing page works on mobile', 1], ['No outdated contact information', 1]] },
      { title: 'Create / Clean Up the Facebook Page', req: true,
        why: 'The Facebook Page is part of the Meta infrastructure even when Instagram is the primary organic channel.',
        todo: ['Create or open the client Facebook Page.', 'Use the correct business name, category, location, website, and profile assets.', 'Claim a matching username where possible.', 'Treat the Page as part of the long-term Meta asset structure.'],
        ex: 'Page name: 4DRIP • username: @4drip313 • location: Metro Detroit • website: branded 4DRIP hub.',
        checks: [['Page identity matches Instagram', 1], ['Business category is accurate', 1], ['Location / website are current', 1], ['Profile + cover assets are brand-consistent', 0]] }
    ]},
    { name: 'Meta Business Structure', steps: [
      { title: 'Create the Meta Business Portfolio', req: true,
        why: 'Business assets should live under the business — not under one person’s personal login. This makes permissions, handoffs, ads, and future growth safer.',
        todo: ['Open Meta Business Suite / Business Settings.', 'Create or verify a Business Portfolio named for the client.', 'Confirm the correct owner/admin account.', 'Document who has full control.'],
        ex: 'Business Portfolio = “4DRIP” → owner/admin = business owner → Adventure Fuel receives only the access required to manage social.',
        checks: [['Portfolio uses the correct business identity', 1], ['At least one trusted owner has full control', 1], ['No unknown admins are present', 1], ['Access is role-based, not password-shared', 1]] },
      { title: 'Add the Facebook Page + Instagram Account', req: true,
        why: 'Both assets should appear inside the same Meta business environment so publishing, permissions, ads, and reporting are centralized.',
        todo: ['Add or claim the Facebook Page.', 'Add the Instagram account.', 'Confirm both assets display under the same Business Portfolio.', 'Resolve any ownership conflicts before scheduling content.'],
        ex: 'Pass condition: Business Suite shows the client Facebook Page + Instagram account under the same business.',
        checks: [['Facebook Page is connected', 1], ['Instagram account is connected', 1], ['Both belong to the intended business portfolio', 1], ['No duplicate / legacy business assets causing confusion', 0]] }
    ]},
    { name: 'Security + Access', steps: [
      { title: 'Turn On Two-Factor Authentication', req: true,
        why: 'A locked or compromised Meta account can interrupt publishing, ads, DMs, and client access. Security is part of the setup.',
        todo: ['Enable 2FA on the Facebook admin account.', 'Enable 2FA on Instagram.', 'Confirm recovery email and phone numbers are current.', 'Store backup codes securely.'],
        ex: 'Adventure Fuel standard: every person with elevated business access must use 2FA.',
        checks: [['Facebook admin uses 2FA', 1], ['Instagram uses 2FA', 1], ['Recovery channels are current', 1], ['Backup / recovery process is documented', 0]] },
      { title: 'Set Team Permissions Without Sharing Passwords', req: true,
        why: 'Team members and agencies should receive only the permissions they need. Password sharing creates avoidable security and accountability problems.',
        todo: ['Invite team members through Meta business access.', 'Assign the minimum permissions needed for their job.', 'Keep full-control access limited.', 'Remove former employees / vendors immediately.'],
        ex: 'Social manager = content access. Paid media manager = ad account access. Business owner = full control.',
        checks: [['No shared Instagram password is required for daily work', 1], ['Permissions match actual responsibilities', 1], ['Former users are removed', 1], ['Full-control access is limited', 1]] }
    ]},
    { name: 'Publishing Connection', steps: [
      { title: 'Verify Instagram + Facebook Publishing Connection', req: true,
        why: 'Before Adventure Fuel builds a schedule, prove that Meta can actually publish to the intended placements.',
        todo: ['Open Meta Business Suite → Create Post.', 'Confirm Instagram and Facebook appear as selectable placements.', 'Create a draft test post.', 'Verify the correct Instagram account appears before scheduling.'],
        ex: 'Test: create a throwaway draft → select Instagram only → save draft. Do not publish until account identity is verified.',
        checks: [['Correct Instagram account is selectable', 1], ['Correct Facebook Page is selectable', 1], ['Draft saves successfully', 1], ['No duplicate / wrong account is selected', 1]] },
      { title: 'Test the Planner / Scheduler', req: true,
        why: 'The client is not fully set up until a scheduled post can move from draft to the correct account at the correct time.',
        todo: ['Open Business Suite → Planner.', 'Schedule a low-risk test post or private test window.', 'Confirm date, local time zone, caption, creative, and placement.', 'After publishing, verify the live post on Instagram.'],
        ex: 'Pass condition: the scheduled post publishes to the intended IG account with the correct asset, caption, crop, and time.',
        checks: [['Time zone is correct', 1], ['Creative crop is correct', 1], ['Caption + CTA are correct', 1], ['Published post matches the scheduled draft', 1]] }
    ]},
    { name: 'Content Operations', steps: [
      { title: 'Create the Content Status Pipeline', req: true,
        why: 'The system should show exactly where every post is in production so nothing is forgotten or published prematurely.',
        todo: ['Use one source of truth for the content calendar.', 'Adopt statuses: Planned → Assets Ready → Creative Ready → Caption Ready → Approved → Scheduled → Published → Reviewed.', 'Assign an owner for each stage.', 'Record scheduled date/time.'],
        ex: 'Day 10 / Moncler / Detail Treatment → Creative Ready → Caption Approved → Scheduled 6:30 PM → Reviewed after 72 hours.',
        checks: [['Every post has a status', 1], ['Every post has an owner', 1], ['Every post has a CTA', 1], ['No post can skip approval without an approved exception', 1]] },
      { title: 'Use a 7-Day Scheduling Window', req: false,
        why: 'Produce farther ahead, but schedule only the next week so the brand can react to sold-out inventory, new arrivals, trends, and performance.',
        todo: ['Maintain a 30-day strategy.', 'Aim to keep ~14 days of creative in production / ready.', 'Schedule the next 7 days in Meta.', 'Review inventory and priorities before locking the following week.'],
        ex: 'Operating rhythm: 30-day strategy → 14 days produced → 7 days scheduled → daily engagement → weekly review.',
        checks: [['Next 7 days are scheduled', 0], ['Upcoming inventory has been checked', 1], ['Sold-out products are removed / replaced', 1], ['Schedule still matches current business priorities', 1]] }
    ]},
    { name: 'Pre-Publish QA', steps: [
      { title: 'Run the Social Post Quality Gate', req: true,
        why: 'Scheduling is not the same as publishing quality. Every scheduled post should pass a consistent brand and execution review.',
        todo: ['Check logo, spelling, crop, product details, CTA, and placement.', 'Confirm imagery matches the client’s brand rules.', 'Confirm inventory / offer details are still true.', 'Preview on mobile before final approval.'],
        ex: '4DRIP: correct 4DRIP logo • no accidental public price • product is accurate • CTA routes to DM / approved destination • no fake scarcity.',
        checks: [['Branding is correct', 1], ['Spelling / grammar are correct', 1], ['Product / offer details are accurate', 1], ['Mobile crop / safe area are correct', 1], ['CTA is clear and usable', 1]] },
      { title: 'Confirm Client Approval Rules', req: true,
        why: 'Adventure Fuel needs a clear answer to who can approve content and when approval is considered final.',
        todo: ['Define who approves content.', 'Define the deadline for approvals.', 'Define what happens when approval is late.', 'Document whether routine posts can use pre-approved templates / treatments.'],
        ex: 'Client approves weekly batch by Thursday 5 PM. Routine pre-approved product treatments can move directly to scheduling once inventory is confirmed.',
        checks: [['Approver is named', 1], ['Approval deadline is documented', 1], ['Late-approval rule exists', 1], ['Exceptions are documented', 0]] }
    ]},
    { name: 'Post-Publish', steps: [
      { title: 'Assign Daily Engagement Ownership', req: true,
        why: 'Publishing can be automated. Relationships cannot. Comments and DMs still need a human response process.',
        todo: ['Assign who checks comments and DMs.', 'Define response-time expectations.', 'Escalate sales, complaints, and sensitive issues appropriately.', 'Log common questions that can improve future content.'],
        ex: '4DRIP: product-size and availability inquiries move into DM; common size / brand requests are logged for future inventory content.',
        checks: [['Daily engagement owner is assigned', 1], ['Response expectation is defined', 1], ['Escalation path exists', 1], ['Common customer questions are captured', 0]] },
      { title: 'Review Performance After 48–72 Hours', req: false,
        why: 'The setup is only useful if Adventure Fuel learns from what gets published and feeds those learnings into the next content cycle.',
        todo: ['Record reach / views.', 'Record saves, shares, comments, profile actions, and organic inquiries.', 'Note which hook, treatment, product, and CTA were used.', 'Feed strong organic ideas into future content and paid testing when appropriate.'],
        ex: 'Scorecard: Reach • Saves • Shares • Profile Visits • DMs • Product inquiries • Best-performing treatment.',
        checks: [['Performance is recorded', 0], ['Results are tied to the content concept', 0], ['A next action is documented', 0], ['Winning ideas are reused / tested intentionally', 0]] }
    ]}
  ];

  /* number steps */
  var n = 0;
  PHASES.forEach(function (ph, pi) { ph.num = String(pi + 1).padStart(2, '0'); ph.steps.forEach(function (s) { n++; s.id = 's' + n; s.n = String(n).padStart(2, '0'); }); });

  var $ = function (id) { return document.getElementById(id); };
  var LS_DRAFT = 'af_ss_draft_v3', LS_CLIENTS = 'af_ss_clients_v3';
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function blank() { return { key: 'c' + Date.now().toString(36), remoteId: null, profile: { date: new Date().toISOString().slice(0, 10) }, done: {}, checks: {}, savedAt: null }; }
  var S = lsGet(LS_DRAFT, null) || blank();
  var sb = null, user = null;

  /* ---------- build phases ---------- */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var html = PHASES.map(function (ph) {
    return '<section class="panel phase" aria-labelledby="ph-' + ph.num + '"><div class="phase-head"><h2 class="disp" id="ph-' + ph.num + '"><span class="o">' + ph.num + '</span>' + esc(ph.name) + '</h2>' +
      '<div class="phase-stats"><span class="mono">Comp <strong data-pc="' + ph.num + '">0%</strong></span><span class="mono q">Qual <strong data-pq="' + ph.num + '">0%</strong></span></div></div>' +
      ph.steps.map(function (s) {
        return '<div class="step-row"><button class="done-btn" type="button" aria-pressed="false" data-done="' + s.id + '" aria-label="Mark step ' + s.n + ' complete: ' + esc(s.title) + '"><span class="bx" aria-hidden="true"></span></button>' +
          '<div class="step-body"><button class="step-toggle" type="button" aria-expanded="false" aria-controls="d-' + s.id + '" data-open="' + s.id + '">' +
          '<span class="step-t"><span class="mono">Step ' + s.n + ' · <span class="' + (s.req ? 'req' : '') + '">' + (s.req ? 'Required' : 'Optional') + '</span></span><span class="ttl">' + esc(s.title) + '</span></span>' +
          '<span class="mono step-q">Quality <span data-sq="' + s.id + '">0%</span></span><span class="caret" aria-hidden="true">+</span></button>' +
          '<div class="step-detail" id="d-' + s.id + '" hidden><div><h4>Why it matters</h4><p>' + esc(s.why) + '</p><h4 style="margin-top:16px">Do this</h4><ol>' +
          s.todo.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol><p class="ex" style="margin-top:14px"><b>Example · </b>' + esc(s.ex) + '</p></div>' +
          '<div class="qbox"><h4>Quality checks</h4>' + s.checks.map(function (c, i) {
            return '<button class="chk" type="button" aria-pressed="false" data-chk="' + s.id + '-' + i + '"><span class="bx" aria-hidden="true"></span><span class="t">' + esc(c[0]) + '</span><span class="tag' + (c[1] ? ' r' : '') + '">' + (c[1] ? 'Req' : 'Opt') + '</span></button>';
          }).join('') + '</div></div></div></div>';
      }).join('') + '</section>';
  }).join('');
  $('phases').innerHTML = html;
  $('phase-bars').innerHTML = PHASES.map(function (ph) {
    return '<div><div class="pbar-l"><span>' + ph.num + ' ' + esc(ph.name) + '</span><span class="mono" data-pb-t="' + ph.num + '">0%</span></div><div class="pbar"><i data-pb="' + ph.num + '" style="width:0%"></i></div></div>';
  }).join('');

  /* ---------- compute + paint ---------- */
  function calc() {
    var steps = 0, sd = 0, gates = 0, go = 0, blockers = 0, per = {};
    PHASES.forEach(function (ph) {
      var ps = 0, pd = 0, pg = 0, po = 0;
      ph.steps.forEach(function (s) {
        ps++; if (S.done[s.id]) pd++; else if (s.req) blockers++;
        var qo = 0;
        s.checks.forEach(function (c, i) { pg++; if (S.checks[s.id + '-' + i]) { po++; qo++; } else if (c[1]) blockers++; });
        per[s.id] = Math.round(qo / s.checks.length * 100);
      });
      steps += ps; sd += pd; gates += pg; go += po;
      per[ph.num] = { c: Math.round(pd / ps * 100), q: Math.round(po / pg * 100) };
    });
    var completion = Math.round(sd / steps * 100), quality = Math.round(go / gates * 100);
    return { completion: completion, quality: quality, readiness: Math.round(completion * 0.7 + quality * 0.3), blockers: blockers, per: per };
  }
  function statusOf(r) {
    if (r.readiness === 0) return { label: 'Not started', color: '#8a857c' };
    if (r.blockers === 0) return { label: 'Launch ready', color: '#2E8CFF' };
    if (r.readiness < 40) return { label: 'Stalled', color: '#FDB012' };
    return { label: 'Running', color: '#FF4D00' };
  }
  function paint() {
    var r = calc(), st = statusOf(r), C = 2 * Math.PI * 50;
    document.querySelectorAll('[data-done]').forEach(function (b) { var on = !!S.done[b.dataset.done]; b.setAttribute('aria-pressed', on); b.firstChild.textContent = on ? '✓' : ''; });
    document.querySelectorAll('[data-chk]').forEach(function (b) { var on = !!S.checks[b.dataset.chk]; b.setAttribute('aria-pressed', on); b.firstChild.textContent = on ? '✓' : ''; });
    document.querySelectorAll('[data-sq]').forEach(function (e) { e.textContent = r.per[e.dataset.sq] + '%'; });
    PHASES.forEach(function (ph) {
      var p = r.per[ph.num];
      document.querySelector('[data-pc="' + ph.num + '"]').textContent = p.c + '%';
      document.querySelector('[data-pq="' + ph.num + '"]').textContent = p.q + '%';
      document.querySelector('[data-pb="' + ph.num + '"]').style.width = p.c + '%';
      document.querySelector('[data-pb-t="' + ph.num + '"]').textContent = p.c + '%';
    });
    $('ring-fg').setAttribute('stroke-dasharray', (C * r.readiness / 100).toFixed(1) + ' ' + C.toFixed(1));
    $('ring-fg').setAttribute('stroke', st.color);
    $('ring-txt').textContent = r.readiness + '%';
    $('status-label').textContent = st.label; $('status-label').style.color = st.color;
    $('blockers-top').textContent = r.blockers;
    $('sc-comp').textContent = r.completion + '%'; $('sc-qual').textContent = r.quality + '%'; $('sc-block').textContent = r.blockers;
    $('dock-pct').textContent = r.readiness + '%'; $('dock-pct').style.color = st.color;
    $('dock-label').textContent = st.label; $('dock-block').textContent = r.blockers;
    var sob = $('signoff-btn'), ready = r.blockers === 0;
    sob.disabled = !ready; sob.classList.toggle('ready', ready);
    sob.textContent = ready ? (S.profile.signedOff ? 'Signed off ✓ — launch ready' : 'Sign off — launch ready →') : 'Not ready for sign-off · ' + r.blockers + ' open';
    return r;
  }
  function persist() { lsSet(LS_DRAFT, S); $('save-state').textContent = S.savedAt ? 'Edited · not saved' : 'Not saved'; }

  /* ---------- interactions ---------- */
  $('phases').addEventListener('click', function (e) {
    var d = e.target.closest('[data-done]'), c = e.target.closest('[data-chk]'), o = e.target.closest('[data-open]');
    if (d) { S.done[d.dataset.done] = !S.done[d.dataset.done]; paint(); persist(); }
    else if (c) { S.checks[c.dataset.chk] = !S.checks[c.dataset.chk]; paint(); persist(); }
    else if (o) { var x = o.getAttribute('aria-expanded') === 'true'; o.setAttribute('aria-expanded', !x); $('d-' + o.dataset.open).hidden = x; }
  });
  function setAll(open) { document.querySelectorAll('[data-open]').forEach(function (o) { o.setAttribute('aria-expanded', open); $('d-' + o.dataset.open).hidden = !open; }); }
  $('expand-btn').onclick = function () { setAll(true); };
  $('collapse-btn').onclick = function () { setAll(false); };

  var inputs = document.querySelectorAll('[data-k]');
  function loadProfile() { inputs.forEach(function (el) { el.value = S.profile[el.dataset.k] || (el.tagName === 'SELECT' ? el.options[0].value : ''); }); }
  inputs.forEach(function (el) { el.addEventListener('input', function () { S.profile[el.dataset.k] = el.value; persist(); }); });

  var tt;
  function toast(m) { var t = $('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(tt); tt = setTimeout(function () { t.classList.remove('show'); }, 2600); }

  /* ---------- saving: Supabase when signed in, else this device ---------- */
  function summary() { var r = calc(); return { client_name: (S.profile.client || '').trim(), completion: r.completion, quality: r.quality, readiness: r.readiness, blockers: r.blockers }; }
  function save() {
    var sm = summary();
    if (!sm.client_name) { $('p-client').focus(); toast('Add the client / brand name first.'); return; }
    S.savedAt = new Date().toISOString();
    var payload = { profile: S.profile, done: S.done, checks: S.checks };
    if (window.afTrack) window.afTrack('setup_save', user ? 'team' : 'device');
    if (sb && user) {
      var row = Object.assign({ payload: payload, updated_at: S.savedAt, updated_by: user.id }, sm);
      var q = S.remoteId ? sb.from('af_social_setups').update(row).eq('id', S.remoteId).select('id').single() : sb.from('af_social_setups').insert(row).select('id').single();
      q.then(function (res) {
        if (res.error) { toast('Couldn’t sync — saved on this device.'); saveLocal(sm); return; }
        S.remoteId = res.data.id; lsSet(LS_DRAFT, S); $('save-state').textContent = 'Synced ' + new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); toast('Saved to the team.'); renderDash();
      });
    } else { saveLocal(sm); toast('Saved on this device.'); }
  }
  function saveLocal(sm) {
    var list = lsGet(LS_CLIENTS, []), i = list.findIndex(function (c) { return c.key === S.key; });
    var rec = Object.assign({ key: S.key, savedAt: S.savedAt, state: JSON.parse(JSON.stringify(S)) }, sm);
    if (i >= 0) list[i] = rec; else list.unshift(rec);
    lsSet(LS_CLIENTS, list); lsSet(LS_DRAFT, S);
    $('save-state').textContent = 'Saved ' + new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    renderDash();
  }
  $('save-btn').onclick = save; $('dock-save').onclick = save;
  $('new-btn').onclick = function () { S = blank(); lsSet(LS_DRAFT, S); loadProfile(); paint(); setAll(false); $('save-state').textContent = 'Not saved'; window.scrollTo({ top: 0, behavior: 'smooth' }); toast('New client ready.'); };
  $('reset-btn').onclick = function () { if (!confirm('Clear every checkbox for this client?')) return; S.done = {}; S.checks = {}; paint(); persist(); toast('Checklist reset.'); };
  $('signoff-btn').onclick = function () {
    if (calc().blockers) return;
    if (!S.profile.signAf || !S.profile.signDate) { toast('Add the AF approver and approval date.'); (S.profile.signAf ? $('s-date') : $('s-af')).focus(); return; }
    S.profile.signedOff = true; paint(); save();
  };

  function pillColor(c) { return c.blockers === 0 ? '#2E8CFF' : c.readiness < 40 ? '#FDB012' : '#FF4D00'; }
  function renderDash() {
    var el = $('dash');
    function draw(list, remote) {
      if (!list.length) { el.innerHTML = '<p class="dash-empty">No saved clients yet. Fill in a profile and hit <strong>Save client</strong>.</p>'; return; }
      el.innerHTML = list.map(function (c, i) {
        var st = c.readiness === 0 ? 'Not started' : c.blockers === 0 ? 'Launch ready' : c.readiness < 40 ? 'Stalled' : 'Running';
        return '<div class="dcard"><span class="nm">' + esc(c.client_name) + '</span><span class="pct" style="color:' + pillColor(c) + '">' + c.readiness + '%</span>' +
          '<div class="meta"><span class="pill" style="color:' + pillColor(c) + '">' + st + '</span><span class="mono">Comp ' + c.completion + '%</span><span class="mono">Qual ' + c.quality + '%</span><span class="mono">' + c.blockers + ' open</span><span class="mono">' + new Date(c.updated_at || c.savedAt).toLocaleDateString() + '</span></div>' +
          '<div class="acts"><button class="sbtn" type="button" data-resume="' + i + '">Resume</button><button class="sbtn" type="button" data-report="' + i + '">Report</button></div></div>';
      }).join('');
      el.onclick = function (e) {
        var r = e.target.closest('[data-resume]'), p = e.target.closest('[data-report]');
        var c = r ? list[r.dataset.resume] : p ? list[p.dataset.report] : null; if (!c) return;
        var state = remote ? { key: 'r' + c.id, remoteId: c.id, profile: c.payload.profile || {}, done: c.payload.done || {}, checks: c.payload.checks || {}, savedAt: c.updated_at } : c.state;
        if (r) { S = JSON.parse(JSON.stringify(state)); lsSet(LS_DRAFT, S); loadProfile(); paint(); $('save-state').textContent = 'Loaded'; window.scrollTo({ top: 0, behavior: 'smooth' }); toast('Loaded ' + c.client_name + '.'); }
        else { var keep = S; S = state; download(); S = keep; }
      };
    }
    if (sb && user) {
      $('dash-src').textContent = 'Team · synced'; $('dash-note').textContent = 'Everyone signed in to the Command Center sees these.';
      sb.from('af_social_setups').select('id,client_name,payload,completion,quality,readiness,blockers,updated_at').order('updated_at', { ascending: false }).then(function (res) { draw(res.data || [], true); });
    } else {
      $('dash-src').textContent = 'This device'; $('dash-note').textContent = 'Saved here on this device. Sign in with your Command Center account to sync across the team.';
      draw(lsGet(LS_CLIENTS, []), false);
    }
  }

  /* ---------- reports ---------- */
  function report() {
    var r = calc(), st = statusOf(r), p = S.profile, L = [];
    L.push('ADVENTURE FUEL — SOCIALS SETUP REPORT', '');
    L.push('Client: ' + (p.client || '—'), 'Instagram: ' + (p.ig || '—') + '   Facebook: ' + (p.fb || '—'), 'AF owner: ' + (p.owner || '—') + '   Approver: ' + (p.approver || '—'), 'Access: ' + (p.access || '—') + '   Login/recovery: ' + (p.login || '—'), 'Setup date: ' + (p.date || '—'), '');
    L.push('READINESS ' + r.readiness + '% — ' + st.label.toUpperCase(), 'Completion ' + r.completion + '% · Quality ' + r.quality + '% · ' + r.blockers + ' required gates open', '');
    PHASES.forEach(function (ph) {
      L.push(ph.num + ' — ' + ph.name.toUpperCase());
      ph.steps.forEach(function (s) {
        L.push('  [' + (S.done[s.id] ? 'x' : ' ') + '] Step ' + s.n + ' ' + s.title + (s.req ? '' : ' (optional)'));
        s.checks.forEach(function (c, i) { if (!S.checks[s.id + '-' + i] && c[1]) L.push('       open gate: ' + c[0]); });
      });
      L.push('');
    });
    if (p.notes) L.push('Notes / blockers: ' + p.notes, '');
    if (p.signedOff) L.push('Signed off by ' + (p.signAf || '—') + ' / ' + (p.signClient || '—') + ' on ' + (p.signDate || '—'));
    return L.join('\n');
  }
  function download() {
    var blob = new Blob([report()], { type: 'text/plain' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'AF-socials-setup-' + ((S.profile.client || 'client').replace(/[^a-z0-9]+/gi, '-').toLowerCase()) + '.txt';
    document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }
  $('dl-btn').onclick = download;
  $('copy-btn').onclick = function () {
    var t = report();
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { toast('Report copied.'); }, function () { download(); });
  };
  $('print-btn').onclick = function () { window.print(); };

  /* ---------- team auth (same Supabase project as the Command Center) ---------- */
  var dlg = $('team-dlg');
  function setUser(u) {
    user = u;
    var b = $('team-btn'); b.classList.toggle('on', !!u); b.textContent = u ? 'Team · sign out' : 'Team sign in';
    renderDash();
  }
  $('team-btn').onclick = function () {
    if (user && sb) { sb.auth.signOut().then(function () { setUser(null); toast('Signed out.'); }); return; }
    if (!sb) { toast('Sign-in is still loading — try again in a second.'); return; }
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    setTimeout(function () { $('t-email').focus(); }, 50);
  };
  $('dlg-close').onclick = function () { dlg.close ? dlg.close() : dlg.removeAttribute('open'); };
  $('team-form').addEventListener('submit', function (e) {
    e.preventDefault(); $('t-msg').textContent = ''; $('t-submit').disabled = true; $('t-submit').textContent = 'Signing in…';
    sb.auth.signInWithPassword({ email: $('t-email').value.trim(), password: $('t-pass').value }).then(function (res) {
      $('t-submit').disabled = false; $('t-submit').textContent = 'Sign in →';
      if (res.error) { $('t-msg').textContent = 'That email and password didn’t match a Command Center account.'; return; }
      $('t-pass').value = ''; dlg.close ? dlg.close() : dlg.removeAttribute('open'); setUser(res.data.user); toast('Signed in — saves now sync to the team.');
    });
  });
  function initSb() {
    var C = window.AF_CONFIG;
    if (!window.supabase || !C) return;
    sb = window.supabase.createClient(C.supabaseUrl, C.supabaseKey, { auth: { persistSession: true, storageKey: 'af-site-auth' } });
    sb.auth.getSession().then(function (r) { if (r.data && r.data.session) setUser(r.data.session.user); });
  }

  /* ---------- go ---------- */
  loadProfile(); paint(); renderDash();
  if (S.savedAt) $('save-state').textContent = 'Draft restored';
  if (window.supabase) initSb(); else window.addEventListener('load', initSb);
})();
