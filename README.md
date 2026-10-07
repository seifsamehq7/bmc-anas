# BMC | Barakat Medcare Center website

Front end only, built with Next.js 16. Arabic is the default language (`/ar`), with a full English version (`/en`).
The full site plan is in [PLAN.md](PLAN.md).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000/ar
npm run build && npm run start   # production preview
```

## Where things live

| What | File |
|---|---|
| All Arabic copy | `src/content/dictionaries/ar.ts` |
| All English copy | `src/content/dictionaries/en.ts` |
| The 8 machines and exams (text, photo, prep, duration) | `src/content/machines.ts` |
| The scans patients book: 8 departments, 32 scan types (from barakatmc.com) | `src/content/scans.ts` |
| Phone, WhatsApp, address, hours (placeholders now), booking demo flag | `src/content/site.ts` |
| Booking store (localStorage now, swap for an API later) | `src/lib/bookings.ts` |
| Dashboard sample data (swap for an API later) | `src/lib/dashboard-data.ts` |
| Colors, type, buttons, fade-ins, loader | `src/app/globals.css` |
| Machine photos (GE HealthCare) | `src/assets/machines/` |
| Brand guide backgrounds (pages 2, 9, 10, 12) | `src/assets/brand/` |

## Pages

- Website (`src/app/[lang]/(site)/`): home, `/machines`, `/machines/[slug]`, `/about`, `/booking` (department chooser), `/booking/radiology` (4-step booking: department, then the exact scan), `/booking/oncology` (coming soon).
- Dashboard (`src/app/[lang]/dashboard/`): overview, plus bookings, calendar, finances, settings, clients and admins (coming soon). The dashboard loader plays when someone walks in (from the website, or by opening a dashboard link), never on reload or between sections (`src/lib/dash-intro.ts`).

## Brand fonts

**Araboto** (Arabic) and **Nexa Slab** (English and numbers) are self-hosted from `src/fonts/`, subset to the characters the site uses (about 22 KB per weight).
Araboto carries only Arabic glyphs, so Latin letters and digits inside Arabic text automatically use Nexa Slab.
Confirm both licenses allow web embedding.

## Motion and accessibility

- Smooth scrolling with Lenis. Every section fades in; everything animates with transform and opacity only.
- Phones, portrait tablets and visitors with "reduce motion" get a calm stacked layout instead of the pinned showcase.
- The intro loader shows once per browser session.
- After it, a welcome popup asks which department the visitor needs (radiology goes to its booking page, oncology shows "coming soon"). It asks once per browser session, using a session cookie, so new tabs stay quiet and it asks again only after the browser is closed (`src/lib/welcome.ts`).
