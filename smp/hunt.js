/* AVF THE HUNT — SMP funnel checklist with task lights, quality grades and scoring */
(function () {
  'use strict';

  /* ---------- the funnel: 8 phases → groups → checklist items ----------
     Item keys are saved in the database — don't rename them once in use. */
  var PHASES = [
    { id: 'attract', name: 'Attract', icon: 'target', line: 'Strategically pull the right people in — Meta ads, Google Search, barber QR cards and Groupon.',
      groups: [
        { id: 'meta', name: 'Meta ads', items: [
          ['pixel', 'Pixel + Conversions API fire on a booked consult', 'Test it: submit a booking and see the event in Events Manager.'],
          ['radius', 'Audience set to the real service radius', 'Only people who can actually drive to the studio.'],
          ['creative', '3+ live creatives: Terrence on camera, before/after, client story', 'Before/after photos only with written client permission.'],
          ['goal', 'Campaign goal = booked consults, not clicks or likes', ''],
          ['utm', 'Every ad link carries UTM tags', 'So each lead lands in the CRM with "Meta" attached.'],
          ['weekly', 'Weekly check: cost per lead + one fresh creative', '']
        ] },
        { id: 'google', name: 'Google Search', items: [
          ['gbp', 'Google Business Profile complete', 'Hours, photos, services, booking link, Q&A answered.'],
          ['keywords', 'Search campaign on SMP buying words', '"scalp micropigmentation near me", "SMP Detroit", "hair tattoo".'],
          ['negatives', 'Negative keywords set', 'Block jobs, DIY, "training" (training has its own campaign).'],
          ['assets', 'Call + location assets turned on', ''],
          ['conv', 'Conversions tracked on form submits and calls', ''],
          ['reviews', 'Review ask sent after every treatment', 'Reviews feed both Maps and Search.']
        ] },
        { id: 'qr', name: 'Barber partner QR', items: [
          ['unique', 'Unique QR + code per barber shop', 'Tracks which partner sent each lead.'],
          ['card', 'Card shows the offer and one clear next step', 'Offer code + "Scan to book a free consult".'],
          ['terms', 'Referral payout terms written and signed', ''],
          ['five', '5 partner shops recruited', ''],
          ['restock', 'Monthly check-in + card restock on the calendar', '']
        ] },
        { id: 'groupon', name: 'Groupon marketplace', items: [
          ['terms', 'Deal terms approved (price, what’s included, consult first)', ''],
          ['cap', 'Monthly voucher cap set to real capacity', ''],
          ['redeem', 'Voucher redemption steps written for the studio', ''],
          ['upsell', 'Voucher → full Comeback package path ready', 'What Terrence says at the consult to move them up.'],
          ['reply', 'Every Groupon review gets a reply', '']
        ] }
      ] },
    { id: 'land', name: 'Land', icon: 'window', line: 'How well — and how simply — does the landing page do its one job: book the consult?',
      groups: [
        { id: 'page', name: 'The Comeback landing page', items: [
          ['speed', 'Loads in under 3 seconds on a phone', 'Test on cellular, not Wi-Fi.'],
          ['cta', 'One clear action above the fold', '"Book your free consult" — nothing competing with it.'],
          ['offer', 'Offer + price signal are obvious', 'People should know the ballpark before they book.'],
          ['proof', 'Proof: before/after, reviews, Terrence’s face', ''],
          ['where', 'Where + who: address, map, parking, hours', ''],
          ['faq', 'FAQ answers the top fears', 'Does it hurt? How long does it last? Upkeep?'],
          ['groupon', 'Separate voucher path for Groupon buyers', 'So they don’t see a different price.'],
          ['tracking', 'Source captured on every visit (UTM / QR code)', '']
        ] }
      ] },
    { id: 'capture', name: 'Capture', icon: 'chat', line: 'Is it easy to reach us — and does every lead land in the CRM with its source?',
      groups: [
        { id: 'forms', name: 'Forms + channels', items: [
          ['short', 'Booking form is 5 fields or fewer', ''],
          ['tested', 'Form tested weekly on iPhone + Android', ''],
          ['whatsapp', 'WhatsApp click-to-chat with a pre-filled message', ''],
          ['callback', 'Callback request option for people who hate forms', ''],
          ['autoreply', 'Instant auto-reply confirms we got it', '']
        ] },
        { id: 'records', name: 'Lead records', items: [
          ['crm', 'Every lead becomes one record in the CRM', 'No duplicates — check by phone number.'],
          ['source', 'Source + campaign attached to every record', ''],
          ['alert', 'Owner phone alert within 1 minute of a new lead', '']
        ] }
      ] },
    { id: 'qualify', name: 'Qualify', icon: 'people', line: 'Spend consult time on people who are ready — five quick questions and a simple score.',
      groups: [
        { id: 'system', name: 'Qualifying system', items: [
          ['script', 'The 5-question script is written and used every time', 'See the scorecard below.'],
          ['score', 'Every lead gets a Hot / Warm / Cold score', 'Put it in the lead notes: "Q-score 8 · Hot".'],
          ['fast', 'Leads answered within 15 minutes in business hours', 'Speed matters more than the script.'],
          ['anchor', 'Price range shared before the consult is booked', 'No sticker shock in the chair.'],
          ['exit', 'Polite exit + reason tagged for poor fits', 'Move to Lost with the reason in notes.'],
          ['nohealth', 'No health or medical details in the CRM', 'Those stay in the studio’s consult paperwork.']
        ] }
      ] },
    { id: 'schedule', name: 'Schedule', icon: 'calendar', line: 'Offer real open times and confirm everything they need to show up.',
      groups: [
        { id: 'booking', name: 'Booking', items: [
          ['live', 'Real availability calendar connected', 'Booksy, Vagaro or Google Calendar — no back-and-forth.'],
          ['slots', 'Offer 2–3 specific times, not "when works for you?"', ''],
          ['confirm', 'Confirmation includes date, time, address and parking', ''],
          ['expect', 'What to expect at the consult is included', ''],
          ['resched', 'Reschedule link in every confirmation', ''],
          ['invite', 'Calendar invite sent', '']
        ] }
      ] },
    { id: 'followup', name: 'Follow up', icon: 'mail', line: 'Fast personal replies, reminders they agreed to, and a plan for no-shows.',
      groups: [
        { id: 'touch', name: 'Touches', items: [
          ['speed', 'First personal reply in under 5 minutes', ''],
          ['consent', 'Texting / WhatsApp consent recorded before reminders', 'Only message people who opted in.'],
          ['reminders', 'Reminders 24 hours and 2 hours before', ''],
          ['noshow', 'No-show recovery message within 1 hour', 'Friendly, with two new times.'],
          ['nurture', '3-touch follow-up for "not ready yet" leads', ''],
          ['optout', 'Stop / opt-out requests honored immediately', ''],
          ['logged', 'Every touch logged in the CRM', '']
        ] }
      ] },
    { id: 'consult', name: 'Consult', icon: 'person', line: 'In-person with Terrence: goals, a realistic look, options and price.',
      groups: [
        { id: 'room', name: 'In the chair', items: [
          ['agenda', 'Same consult agenda every time', ''],
          ['goals', 'Their goals and desired look written down', ''],
          ['realistic', 'Realistic result shown with real examples', ''],
          ['options', 'Options explained: sessions, upkeep, touch-ups', ''],
          ['price', 'Price + payment options presented clearly', ''],
          ['paperwork', 'Consent + aftercare paperwork ready', ''],
          ['ask', 'Ask for the booking + deposit before they leave', '']
        ] }
      ] },
    { id: 'close', name: 'Close + report', short: 'Close', icon: 'trophy', line: 'Book it, collect it, and know what each channel really costs.',
      groups: [
        { id: 'books', name: 'Close + report', items: [
          ['booked', 'Treatment booked + deposit collected', ''],
          ['stage', 'Lead moved to "Deposit paid" the same day', 'That’s what counts it as a sale on the scoreboard.'],
          ['source', 'Source confirmed on every client', ''],
          ['spend', 'Monthly ad spend entered on the Spend tab', ''],
          ['weekly', 'Weekly look at cost per lead, per client and return', ''],
          ['review', 'Review request sent after treatment', ''],
          ['referral', 'Referral ask made at the final session', '']
        ] }
      ] }
  ];

  var QUALIFY_Q = [
    ['Goal', 'What made you start looking into SMP now?', 'Clear goal and a reason now = 2 · Just curious = 0'],
    ['Location', 'Where are you coming from?', 'Within ~45 min of the studio = 2 · Over an hour = 0'],
    ['Timing', 'When would you want to start?', 'Within 30 days = 2 · 1–3 months = 1 · Someday = 0'],
    ['Budget', 'The Comeback is around $2,000 for 2 sessions — does that fit what you had in mind?', 'Yes / ready to pay = 2 · Needs a plan = 1 · No = 0'],
    ['Fit', 'Are you good with a short, buzzed look and coming back for a few sessions?', 'Yes = 2 · Unsure = 1 · No = 0']
  ];


  /* AVF THE HUNT™ wordmark — Luckiest Guy, styled after the FUEL lettering in the AF logo */
  var WORDMARK = '<svg class="hunt-mark" viewBox="0 0 660 272" role="img" aria-hidden="true" focusable="false">' +
    '<defs><linearGradient id="huntFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF8A2A"/><stop offset=".55" stop-color="#FF5A0F"/><stop offset="1" stop-color="#E83A00"/></linearGradient></defs>' +
    '<g transform="skewX(-8) translate(40 0)">' +
      '<text x="12" y="72" class="wm wm-top"><tspan class="wm-avf">AVF</tspan><tspan class="wm-the" dx="18">THE</tspan></text>' +
      '<text x="10" y="252" class="wm wm-shadow" textLength="560" lengthAdjust="spacingAndGlyphs">HUNT</text>' +
      '<text x="4" y="246" class="wm wm-hunt" textLength="560" lengthAdjust="spacingAndGlyphs">HUNT</text>' +
      '<text x="578" y="124" class="wm wm-tm">\u2122</text>' +
    '</g></svg>';

  var GRADES = [null, 'Weak', 'Solid', 'Elite'];
  var RANKS = [[95, 'Apex'], [75, 'Hunter'], [50, 'Closing in'], [25, 'Tracking'], [1, 'Scouting'], [0, 'Cold start']];

  var ICONS = {
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><path d="M16 8l5-5M18 3h3v3"/>',
    window: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 9h18M7 6.5h.01M10 6.5h.01"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.8 7L3 21l2-5.6A8 8 0 1 1 21 12z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01"/>',
    people: '<circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="9" r="2.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M15 14.3c3 0 6.5 1.6 6.5 5.7"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18M8 3v4M16 3v4M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 7l9 6 9-6"/>',
    person: '<circle cx="9" cy="8" r="4"/><path d="M2 21c0-4 3-6.5 7-6.5s7 2.5 7 6.5"/><path d="M16 4h5v4h-3l-2 2z"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4M12 13v4M8 21h8M9 17h6v4H9z"/>'
  };
  function icon(n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[n] + '</svg>'; }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* flatten items */
  PHASES.forEach(function (p, pi) {
    p.n = pi + 1; p.items = [];
    p.groups.forEach(function (g) { g.items = g.items.map(function (it) { var o = { key: p.id + '.' + g.id + '.' + it[0], text: it[1], tip: it[2], group: g.id }; p.items.push(o); return o; }); });
  });

  var H = { sb: null, user: null, toast: function () {}, items: {}, phases: {}, sel: 'attract', ready: false, cleared: {}, err: null, drafts: {} };
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- scoring ---------- */
  function phaseScore(p) {
    var done = 0, gradeSum = 0, graded = 0;
    p.items.forEach(function (it) { var s = H.items[it.key]; if (s && s.done) { done++; if (s.grade) { gradeSum += s.grade; graded++; } } });
    var completion = Math.round(done / p.items.length * 100);
    var quality = done ? Math.round(gradeSum / (3 * done) * 100) : 0;
    return { done: done, total: p.items.length, completion: completion, quality: quality, graded: graded, score: Math.round(completion * 0.7 + quality * 0.3) };
  }
  function overall() {
    var sc = PHASES.map(phaseScore), tot = sc.reduce(function (a, s) { return a + s.score; }, 0);
    var score = Math.round(tot / PHASES.length), rank = RANKS.filter(function (r) { return score >= r[0]; })[0][1];
    var tasks = sc.reduce(function (a, s) { return a + s.done; }, 0), all = sc.reduce(function (a, s) { return a + s.total; }, 0);
    var cleared = sc.filter(function (s) { return s.completion === 100; }).length;
    return { score: score, rank: rank, tasks: tasks, all: all, cleared: cleared, per: sc };
  }
  function status(s) { return s.completion === 100 ? 'cleared' : s.done ? 'live' : 'cold'; }

  /* ---------- render ---------- */
  function render() {
    var root = $('huntRoot'); if (!root) return;
    var ta = root.querySelector('.pp-note textarea'); if (ta) H.drafts[ta.closest('[data-note]').dataset.note] = ta.value;
    if (H.err) { root.innerHTML = '<div class="panel"><span class="say">The Hunt isn’t connected yet</span><p class="muted" style="margin:0">' + esc(H.err) + '</p></div>'; return; }
    if (!H.ready) { root.innerHTML = '<p class="muted">Loading the hunt…</p>'; return; }
    var O = overall(), C = 2 * Math.PI * 52;
    var html = '<header class="hunt-hero">' +
      '<div class="hh-copy"><span class="hh-kicker">AVF × Swurl Kurl · SMP funnel</span>' +
      '<h2 class="hh-title"><span class="sr">AVF The Hunt</span>' + WORDMARK + '</h2>' +
      '<p class="hh-line">Eight phases from first look to booked treatment. Light every task, grade the quality, clear the funnel.</p>' +
      '<div class="hh-lights" role="list" aria-label="Phase lights">' + PHASES.map(function (p, i) { var s = O.per[i]; return '<span role="listitem" class="lamp ' + status(s) + '" title="' + esc(p.name) + ' ' + s.score + '%"><i></i><b>' + p.n + '</b></span>'; }).join('') + '</div></div>' +
      '<div class="hh-score"><svg viewBox="0 0 120 120" class="hh-ring" aria-hidden="true"><circle cx="60" cy="60" r="52" class="trk"/><circle cx="60" cy="60" r="52" class="val" stroke-dasharray="' + (C * O.score / 100).toFixed(1) + ' ' + C.toFixed(1) + '" transform="rotate(-90 60 60)"/></svg>' +
      '<div class="hh-num"><b>' + O.score + '</b><span>Hunt score</span></div>' +
      '<div class="hh-rank"><span class="rank-tag">' + esc(O.rank) + '</span><span class="muted">' + O.tasks + ' of ' + O.all + ' tasks lit · ' + O.cleared + ' of 8 phases cleared</span></div></div>' +
      '</header>';

    html += '<div class="hunt-body"><div class="funnel" role="tablist" aria-label="Funnel phases">' + PHASES.map(function (p, i) {
      var s = O.per[i], st = status(s), w = 100 - i * 5.2;
      return '<button type="button" role="tab" class="band b' + (i % 2) + ' ' + st + (H.sel === p.id ? ' sel' : '') + '" style="--w:' + w + '%" data-phase="' + p.id + '" aria-selected="' + (H.sel === p.id) + '">' +
        '<span class="bn">' + p.n + '</span><span class="bi">' + icon(p.icon) + '</span><span class="bt">' + esc(p.short || p.name) + '</span>' +
        '<span class="leds" aria-hidden="true">' + p.items.map(function (it) { return '<i class="' + (H.items[it.key] && H.items[it.key].done ? 'on' : '') + '"></i>'; }).join('') + '</span>' +
        '<span class="bs">' + s.score + '<small>%</small></span>' + (st === 'cleared' ? '<span class="stamp">Cleared</span>' : '') + '</button>';
    }).join('') + '<div class="funnel-base"><span>Booked treatment</span></div></div>';

    html += '<div class="phase-panel" id="phasePanel">' + renderPhase() + '</div></div>';
    root.innerHTML = html;
    var nt = root.querySelector('.pp-note textarea'); if (nt && H.drafts[H.sel] != null) nt.value = H.drafts[H.sel];
  }

  function renderPhase() {
    var p = PHASES.filter(function (x) { return x.id === H.sel; })[0], s = phaseScore(p), st = status(s), ph = H.phases[p.id] || {};
    var out = '<div class="pp-head ' + st + '"><span class="pp-n">' + p.n + '</span><div><span class="pp-k">Phase ' + p.n + ' of 8 · ' + (st === 'cleared' ? 'Cleared' : st === 'live' ? 'In progress' : 'Not started') + '</span><h3 class="pp-t">' + esc(p.name) + '</h3><p class="pp-line">' + esc(p.line) + '</p></div></div>' +
      '<div class="pp-stats"><div><span class="k">Tasks lit</span><b>' + s.done + '/' + s.total + '</b></div><div><span class="k">Quality</span><b>' + (s.done ? s.quality + '%' : '—') + '</b></div><div><span class="k">Phase score</span><b class="hot">' + s.score + '%</b></div></div>' +
      '<div class="pp-bar"><i style="width:' + s.completion + '%"></i></div>' +
      '<p class="pp-help">Tap the light when a task is done, then grade how well it’s done: <b>Weak</b>, <b>Solid</b> or <b>Elite</b>.</p>';
    if (p.id === 'capture') out += captureCard(ph);
    p.groups.forEach(function (g) {
      out += '<div class="grp">' + (p.groups.length > 1 ? '<h4 class="grp-t">' + esc(g.name) + ' <span>' + g.items.filter(function (it) { return H.items[it.key] && H.items[it.key].done; }).length + '/' + g.items.length + '</span></h4>' : '') +
        g.items.map(function (it) {
          var v = H.items[it.key] || {}, on = !!v.done;
          return '<div class="ck' + (on ? ' on' : '') + '"><button type="button" class="lightbtn" data-toggle="' + it.key + '" aria-pressed="' + on + '" aria-label="' + (on ? 'Mark not done: ' : 'Mark done: ') + esc(it.text) + '"><i></i></button>' +
            '<div class="ck-t"><span class="ck-x">' + esc(it.text) + '</span>' + (it.tip ? '<span class="ck-tip">' + esc(it.tip) + '</span>' : '') + '</div>' +
            '<div class="grade" role="group" aria-label="Quality for: ' + esc(it.text) + '">' + [1, 2, 3].map(function (gv) {
              return '<button type="button" class="gr g' + gv + (v.grade === gv ? ' sel' : '') + '" data-grade="' + it.key + '" data-g="' + gv + '"' + (on ? '' : ' disabled') + ' aria-pressed="' + (v.grade === gv) + '">' + GRADES[gv] + '</button>';
            }).join('') + '</div></div>';
        }).join('') + '</div>';
    });
    if (p.id === 'qualify') out += qualifyCard();
    out += '<form class="pp-note" data-note="' + p.id + '"><label class="k" for="note-' + p.id + '">Phase notes</label><textarea id="note-' + p.id + '" maxlength="2000" placeholder="What’s working, what’s next…">' + esc(ph.note || '') + '</textarea><div class="btn-row"><button class="btn btn-fuel sm" type="submit">Save notes</button>' +
      (ph.updated_at ? '<span class="muted sm-t" style="align-self:center">Saved ' + new Date(ph.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + '</span>' : '') + '</div></form>';
    var idx = PHASES.indexOf(p);
    out += '<div class="pp-nav">' + (idx > 0 ? '<button type="button" class="btn btn-ghost sm" data-phase="' + PHASES[idx - 1].id + '">← ' + esc(PHASES[idx - 1].name) + '</button>' : '<span></span>') +
      (idx < 7 ? '<button type="button" class="btn btn-fuel sm" data-phase="' + PHASES[idx + 1].id + '">' + esc(PHASES[idx + 1].name) + ' →</button>' : '') + '</div>';
    return out;
  }

  function captureCard(ph) {
    var pick = (ph.extra && ph.extra.primary) || '';
    var opt = function (v, t, d) { return '<button type="button" class="pick' + (pick === v ? ' sel' : '') + '" data-primary="' + v + '" aria-pressed="' + (pick === v) + '"><b>' + t + '</b><span>' + d + '</span></button>'; };
    return '<div class="guide"><span class="say">WhatsApp vs. phone push</span>' +
      '<p class="muted" style="margin:0">They do different jobs — use both. <b>WhatsApp</b> is how the client talks to the studio. <b>Phone push</b> is how the team finds out a lead came in. Pick the client’s main door:</p>' +
      '<div class="picks">' + opt('whatsapp', 'WhatsApp first', 'Chat button on the page; replies feel personal; easy photo sharing.') + opt('form', 'Booking form first', 'Cleanest data + source tracking; WhatsApp as backup.') + opt('call', 'Call / callback first', 'Best for people who want to hear a voice; hardest to track.') + '</div>' +
      '<p class="sm-t muted">Recommended: booking form first with WhatsApp as the backup button, plus a push alert to Terrence’s phone for every new lead.</p></div>';
  }

  function qualifyCard() {
    return '<div class="guide"><span class="say">Qualify scorecard · 5 questions · 10 points</span>' +
      '<p class="muted" style="margin:0">Ask these on the first call or chat. Score each 0–2, add them up, and write the score in the lead’s notes.</p>' +
      '<ol class="qlist">' + QUALIFY_Q.map(function (q) { return '<li><b>' + esc(q[0]) + '</b><span class="qq">“' + esc(q[1]) + '”</span><span class="qs">' + esc(q[2]) + '</span></li>'; }).join('') + '</ol>' +
      '<div class="tiers"><div class="tier hot"><b>8–10 · Hot</b><span>Book the consult now — offer two times.</span></div><div class="tier warm"><b>5–7 · Warm</b><span>Answer the blocker (price, timing), then follow up in 3 days.</span></div><div class="tier cold"><b>0–4 · Cold</b><span>Thank them, add to the nurture list, move on.</span></div></div>' +
      '<p class="sm-t muted">Keep it to practical fit. Health questions belong in the studio’s consult paperwork, not here.</p></div>';
  }

  /* ---------- save ---------- */
  function saveItem(key, patch) {
    var prev = H.items[key] ? Object.assign({}, H.items[key]) : null;
    H.items[key] = Object.assign({ done: false, grade: 0 }, H.items[key], patch);
    var p = PHASES.filter(function (x) { return key.indexOf(x.id + '.') === 0; })[0], before = H.cleared[p.id];
    render(); celebrate(p);
    H.sb.from('sk_hunt').upsert({ item_key: key, done: H.items[key].done, grade: H.items[key].grade, updated_by: H.user.id, updated_at: new Date().toISOString() }, { onConflict: 'item_key' }).then(function (r) {
      if (r.error) { if (prev) H.items[key] = prev; else delete H.items[key]; H.cleared[p.id] = before; render(); H.toast('Couldn’t save — try again.'); }
    });
  }
  function savePhase(id, patch, msg) {
    var row = Object.assign({ phase: id, note: null, extra: {} }, H.phases[id], patch, { updated_by: H.user.id, updated_at: new Date().toISOString() });
    delete row.created_at;
    H.sb.from('sk_hunt_phase').upsert(row, { onConflict: 'phase' }).select().single().then(function (r) {
      if (r.error) { H.toast('Couldn’t save — try again.'); return; }
      H.phases[id] = r.data; render(); if (msg) H.toast(msg);
    });
  }
  function celebrate(p) {
    var s = phaseScore(p), now = s.completion === 100;
    if (now && !H.cleared[p.id]) {
      H.toast('Phase ' + p.n + ' cleared — ' + p.name + ' is locked in.');
      var b = document.querySelector('.band[data-phase="' + p.id + '"]'); if (b) { b.classList.add('pop'); setTimeout(function () { b.classList.remove('pop'); }, 900); }
    }
    H.cleared[p.id] = now;
  }

  /* ---------- events ---------- */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#huntRoot')) return;
    var ph = e.target.closest('[data-phase]'), tg = e.target.closest('[data-toggle]'), gr = e.target.closest('[data-grade]'), pr = e.target.closest('[data-primary]');
    if (tg) { var k = tg.dataset.toggle, on = !(H.items[k] && H.items[k].done); saveItem(k, on ? { done: true } : { done: false, grade: 0 }); return; }
    if (gr && !gr.disabled) { var k2 = gr.dataset.grade, g = +gr.dataset.g; saveItem(k2, { grade: (H.items[k2] && H.items[k2].grade === g) ? 0 : g }); return; }
    if (pr) { savePhase('capture', { extra: Object.assign({}, (H.phases.capture || {}).extra, { primary: pr.dataset.primary }) }, 'Main door saved.'); return; }
    if (ph) {
      H.sel = ph.dataset.phase; try { sessionStorage.setItem('huntSel', H.sel); } catch (x) {}
      render();
      if (ph.closest('.pp-nav') || window.innerWidth < 960) { var pp = $('phasePanel'); if (pp) pp.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
  });
  document.addEventListener('submit', function (e) {
    var f = e.target.closest('[data-note]'); if (!f || !e.target.closest('#huntRoot')) return;
    e.preventDefault(); delete H.drafts[f.dataset.note]; savePhase(f.dataset.note, { note: f.querySelector('textarea').value.trim() || null }, 'Notes saved.');
  });

  /* ---------- public ---------- */
  window.Hunt = {
    init: function (sb, user, toast) {
      H.sb = sb; H.user = user; H.toast = toast || H.toast;
      try { H.sel = sessionStorage.getItem('huntSel') || H.sel; } catch (x) {}
      return Promise.all([sb.from('sk_hunt').select('*'), sb.from('sk_hunt_phase').select('*')]).then(function (r) {
        if (r[0].error || r[1].error) { H.err = 'Run the Hunt database setup (sk-hunt-setup.sql) in Supabase, then refresh this page.'; render(); return; }
        H.err = null; H.items = {}; (r[0].data || []).forEach(function (x) { H.items[x.item_key] = x; });
        H.phases = {}; (r[1].data || []).forEach(function (x) { H.phases[x.phase] = x; });
        H.ready = true; PHASES.forEach(function (p) { H.cleared[p.id] = phaseScore(p).completion === 100; });
        render();
      });
    },
    render: render,
    _phases: PHASES
  };
})();
