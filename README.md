# adventurefuel.agency

Static site for Adventure Fuel. No build step — Render serves this folder as-is.

| Path | What |
|---|---|
| `/` | Homepage (lead form → Supabase `af_website_leads` → Command Center › Scout prospect + 4-touch cadence) |
| `/socials-setup/` | Socials Setup checklist (saves to this device, or to `af_social_setups` when signed in with a Command Center account) |
| `assets/js/config.js` | Supabase URL + publishable key (safe to ship — RLS protects data) |

**Deploy:** Render static site · build command `true` · publish directory `.` · auto-deploy on push to `main`.

**Analytics:** first-party events in `af_analytics_events` (page views, CTA/call clicks, form start/submit).
