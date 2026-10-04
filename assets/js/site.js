/* Adventure Fuel — site behavior */
(function () {
  'use strict';
  var C = window.AF_CONFIG || {};
  var REST = C.supabaseUrl ? C.supabaseUrl + '/rest/v1/' : null;

  function post(table, row, keepalive) {
    if (!REST) return Promise.reject(new Error('no config'));
    return fetch(REST + table, {
      method: 'POST',
      keepalive: !!keepalive,
      headers: { apikey: C.supabaseKey, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(row)
    }).then(function (r) { if (!r.ok) return r.text().then(function (t) { throw new Error(t || r.status); }); return r; });
  }

  /* ---------- analytics (first-party, anonymous) ---------- */
  function vid() {
    try {
      var v = localStorage.getItem('af_vid');
      if (!v) { v = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('af_vid', v); }
      return v.slice(0, 40);
    } catch (e) { return null; }
  }
  var qs = new URLSearchParams(location.search);
  var utm = {};
  ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (k) {
    var v = qs.get(k);
    try { if (v) sessionStorage.setItem(k, v); else v = sessionStorage.getItem(k); } catch (e) {}
    utm[k] = v ? v.slice(0, 100) : null;
  });
  function device() { var w = window.innerWidth; return w < 600 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop'; }
  function track(type, label) {
    post('af_analytics_events', {
      event_type: type, label: label ? String(label).slice(0, 80) : null, path: location.pathname.slice(0, 200),
      referrer: document.referrer ? document.referrer.slice(0, 300) : null, device: device(), visitor_id: vid(),
      utm_source: utm.utm_source, utm_medium: utm.utm_medium, utm_campaign: utm.utm_campaign
    }, true).catch(function () {});
  }
  window.afTrack = track;
  track('page_view');
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-track]');
    if (a) track(a.getAttribute('data-track'), a.getAttribute('data-label'));
  });

  /* ---------- mobile drawer ---------- */
  var btn = document.querySelector('.menu-btn'), drawer = document.getElementById('drawer');
  function setNav(open) {
    if (!btn || !drawer) return;
    drawer.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    btn.querySelector('.m-open').style.display = open ? 'none' : '';
    btn.querySelector('.m-close').style.display = open ? '' : 'none';
  }
  if (btn) btn.addEventListener('click', function () { setNav(!drawer.classList.contains('open')); });
  if (drawer) drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) { setNav(false); btn.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth >= 960) setNav(false); });

  /* ---------- sticky mobile CTA: show after hero, hide over the form ---------- */
  var bar = document.querySelector('.mbar'), hero = document.querySelector('.hero'), form = document.getElementById('fuel-up');
  if (bar && 'IntersectionObserver' in window) {
    var heroGone = false, formOn = false;
    var upd = function () { bar.classList.toggle('show', heroGone && !formOn); };
    if (hero) new IntersectionObserver(function (en) { heroGone = !en[0].isIntersecting; upd(); }, { rootMargin: '-40% 0px 0px 0px' }).observe(hero);
    else { heroGone = true; upd(); }
    if (form) new IntersectionObserver(function (en) { formOn = en[0].isIntersecting; upd(); }).observe(form);
  } else if (bar) { bar.classList.add('show'); }

  /* ---------- reveal on scroll ---------- */
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }); }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- preset the form's "what's slowing you down" from hero options / kit card ---------- */
  document.querySelectorAll('[data-preset]').forEach(function (a) {
    a.addEventListener('click', function () {
      var s = document.getElementById('f-stuck'); if (s) s.value = a.getAttribute('data-preset');
      setTimeout(function () { var n = document.getElementById('f-name'); if (n) n.focus({ preventScroll: true }); }, 450);
    });
  });

  /* ---------- lead form → Supabase (lands in Command Center › Scout) ---------- */
  var lf = document.getElementById('lead-form');
  if (lf) {
    var msg = lf.querySelector('.form-msg'), sub = lf.querySelector('button[type=submit]'), started = false;
    lf.addEventListener('input', function () { if (!started) { started = true; track('form_start', 'roadmap'); } }, { once: false });
    lf.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = lf.elements, bad = null;
      ['name', 'business', 'phone', 'email'].forEach(function (k) { f[k].removeAttribute('aria-invalid'); });
      var name = f.name.value.trim(), biz = f.business.value.trim(), phone = f.phone.value.trim(), email = f.email.value.trim();
      if (!name) bad = [f.name, 'Tell us your name.'];
      else if (!biz) bad = [f.business, 'What’s the business called?'];
      else if (!phone && !email) bad = [f.phone, 'Leave a phone number or an email so we can reach you.'];
      else if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) bad = [f.email, 'That email doesn’t look right.'];
      else if (phone && phone.replace(/\D/g, '').length < 7) bad = [f.phone, 'That phone number looks short.'];
      if (bad) { bad[0].setAttribute('aria-invalid', 'true'); bad[0].focus(); msg.textContent = bad[1]; msg.className = 'form-msg err'; return; }
      if (f.website.value) { done(); return; } /* honeypot */
      sub.disabled = true; sub.textContent = 'Fueling…'; msg.textContent = ''; msg.className = 'form-msg';
      post('af_website_leads', {
        name: name, business: biz, phone: phone || null, email: email || null, challenge: f.challenge.value,
        page: location.pathname.slice(0, 200), device: device(), visitor_id: vid(),
        utm_source: utm.utm_source, utm_medium: utm.utm_medium, utm_campaign: utm.utm_campaign
      }).then(function () { track('form_submit', f.challenge.value); done(); })
        .catch(function () {
          sub.disabled = false; sub.textContent = 'Fuel up →';
          msg.innerHTML = 'Something jammed on our end. Call or text <a href="tel:+12485095860">(248) 509-5860</a> and we’ll get you sorted.';
          msg.className = 'form-msg err';
        });
    });
    function done() {
      lf.innerHTML = '<div class="success"><p class="disp">Tank’s filling.</p><p style="font-size:18px">Got it — we’ll reach out shortly with next steps. Want to skip the line?</p><a class="btn btn-o" href="tel:+12485095860" data-track="call_click" data-label="success">Call (248) 509-5860</a></div>';
      lf.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
