/* Adventure Fuel shared client: leads, push, install */
(function () {
  var FN = 'https://cjixvpcoivfipmgmvomi.supabase.co/functions/v1/af-push';
  var ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqaXh2cGNvaXZmaXBtZ212b21pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4Nzc0NTgsImV4cCI6MjEwMzQ1MzQ1OH0.-_h0AejMCy98nfgpbwA9TKAO3hkkyL6AJTJNZkmrOQM';
  var VAPID = 'BA0gJavQ1Y75FfDiO0bdfY_E9MzUj_4JzCTMKX5I1_13T1IgRCG1HRMAa_lEQXL8jWYHA9YCPJvf8DhvB4p_g50';

  var ua = navigator.userAgent || '';
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isAndroid = /Android/i.test(ua);
  var standalone = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
  var pushSupported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

  function device() { return /Mobi|Android|iPhone/i.test(ua) ? 'mobile' : (/iPad|Tablet/i.test(ua) ? 'tablet' : 'desktop'); }
  function visitorId() {
    try { var v = localStorage.getItem('afVid'); if (!v) { v = Math.random().toString(36).slice(2, 12) + Date.now().toString(36); localStorage.setItem('afVid', v); } return v; } catch (e) { return null; }
  }
  function utm() {
    var p = new URLSearchParams(location.search), o = {};
    ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (k) { if (p.get(k)) o[k] = p.get(k); });
    return o;
  }

  function call(body, token) {
    var h = { 'Content-Type': 'application/json', apikey: ANON, Authorization: 'Bearer ' + (token || ANON) };
    return fetch(FN, { method: 'POST', headers: h, body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok) throw new Error(j.error || 'Request failed'); return j; }); });
  }

  function sendLead(data) {
    var b = Object.assign({ action: 'lead', page: location.pathname, device: device(), visitor_id: visitorId() }, utm(), data);
    return call(b);
  }

  // service worker (root scope)
  var swReady = null;
  function registerSW() {
    if (!('serviceWorker' in navigator)) return Promise.reject(new Error('This browser does not support app installs.'));
    if (!swReady) swReady = navigator.serviceWorker.register('/sw.js', { scope: '/' }).then(function () { return navigator.serviceWorker.ready; });
    return swReady;
  }

  function b64ToU8(s) {
    var p = '='.repeat((4 - s.length % 4) % 4), b = (s + p).replace(/-/g, '+').replace(/_/g, '/'), raw = atob(b), a = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) a[i] = raw.charCodeAt(i);
    return a;
  }

  function pushState() {
    if (!pushSupported) return Promise.resolve(isIOS && !standalone ? 'needs-install' : 'unsupported');
    if (isIOS && !standalone) return Promise.resolve('needs-install');
    if (Notification.permission === 'denied') return Promise.resolve('blocked');
    return registerSW().then(function (reg) { return reg.pushManager.getSubscription(); })
      .then(function (s) { return s ? 'on' : 'off'; });
  }

  function enablePush(role, token, label) {
    if (isIOS && !standalone) return Promise.reject(new Error('On iPhone, add this app to your Home Screen first, then turn notifications on from the app icon.'));
    if (!pushSupported) return Promise.reject(new Error('This browser does not support push notifications. Try Chrome on Android or Safari on iPhone.'));
    return Notification.requestPermission().then(function (perm) {
      if (perm !== 'granted') throw new Error('Notifications are blocked. Turn them on for this site in your phone settings, then try again.');
      return registerSW();
    }).then(function (reg) {
      return reg.pushManager.getSubscription().then(function (s) {
        return s || reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToU8(VAPID) });
      });
    }).then(function (sub) {
      return call({ action: 'subscribe', role: role || 'client', label: label || null, subscription: sub.toJSON() }, token);
    });
  }

  function disablePush() {
    return registerSW().then(function (reg) { return reg.pushManager.getSubscription(); }).then(function (s) {
      if (!s) return;
      var ep = s.endpoint;
      return s.unsubscribe().then(function () { return call({ action: 'unsubscribe', endpoint: ep }); });
    });
  }

  // install prompt (Android / desktop Chrome)
  var deferred = null, installListeners = [];
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault(); deferred = e;
    installListeners.forEach(function (f) { f(); });
  });
  window.addEventListener('appinstalled', function () { deferred = null; installListeners.forEach(function (f) { f(); }); });
  function canPromptInstall() { return !!deferred; }
  function promptInstall() {
    if (!deferred) return Promise.resolve('unavailable');
    var d = deferred; deferred = null;
    d.prompt();
    return d.userChoice.then(function (c) { installListeners.forEach(function (f) { f(); }); return c.outcome; });
  }
  function onInstallChange(f) { installListeners.push(f); }

  window.AF = {
    call: call, sendLead: sendLead, registerSW: registerSW,
    pushState: pushState, enablePush: enablePush, disablePush: disablePush,
    canPromptInstall: canPromptInstall, promptInstall: promptInstall, onInstallChange: onInstallChange,
    isIOS: isIOS, isAndroid: isAndroid, standalone: standalone, pushSupported: pushSupported
  };

  // register early so the app is installable
  if ('serviceWorker' in navigator) window.addEventListener('load', function () { registerSW().catch(function () {}); });
})();
