# adventurefuel.agency

Static site for Adventure Fuel. No build step — Render serves this folder as-is.

| Path | What |
|---|---|
| `/` | Homepage (Brand Guide v1 look). CTAs go to the Fuel Check app; free Social Media Fuel form → `af-push` lead |
| `/fuel-check/` | AF Fuel Check — installable app (Android + iPhone). 8-question fuel gauge, roadmap, example Fuel Report, roadmap-call booking, client push opt-in |
| `/alerts/` | AF Alerts — owner-only (Command Center admin login). Turns on lead push alerts for this phone, shows latest leads, pushes notifications to clients |
| `/socials-setup/` | Socials Setup checklist (saves to this device, or to `af_social_setups` when signed in with a Command Center account) |
| `sw.js` | Service worker (root scope): push notifications + offline app shell |
| `assets/af.js` | Shared client for leads, push subscribe, install prompt |
| `assets/js/config.js` | Supabase URL + publishable key (safe to ship — RLS protects data) |

**Deploy:** Render static site · build command `true` · publish directory `.` · auto-deploy on push to `main`.

**Analytics:** first-party events in `af_analytics_events` (page views, CTA/call clicks, form start/submit).

**Leads + push:** forms post to the Supabase Edge Function `af-push`, which inserts into `af_website_leads` (the existing trigger still creates the Scout prospect + 4-touch cadence) and pushes an alert to every owner phone in `af_push_subscriptions`. VAPID keys live server-side in `af_push_config`.

**iPhone:** web push only works for apps added to the Home Screen (Share → Add to Home Screen). Android Chrome shows an Install button.
