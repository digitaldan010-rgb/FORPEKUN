# Rank Secret Santa

Live version of the Rank Christmas 2026 Secret Santa site. Staff join with their work email (verified by a 6-digit emailed code), add a wishlist, and reveal their match after the organisers run the draw.

- `public/` – the website
- `netlify/functions/api.mjs` – the server (sign-in codes, wishlists, draw, reveal, organiser tools)
- Data is stored in Netlify Blobs (built in, nothing to set up)

## Deploy on Netlify

Drag-and-drop (Netlify Drop) does **not** run the server part, so use one of these:

**Option A – from GitHub (easiest to update)**
1. In Netlify: Add new site → Import an existing project → GitHub → pick the repo.
2. Set **Base directory** to `secret-santa`. Leave the build command and publish folder as they are (they come from `netlify.toml`).
3. Add the environment variables below, then Deploy.

**Option B – Netlify CLI**
```
cd secret-santa
npm install
npx netlify-cli deploy --prod
```

## Environment variables (Site configuration → Environment variables)

| Name | What to put | Required |
|---|---|---|
| `ADMIN_PASSCODE` | The organiser passcode (pick something long) | Yes |
| `SESSION_SECRET` | Any long random string (40+ characters) | Yes |
| `SMTP_HOST` | Email server, e.g. `smtp.gmail.com` for Google Workspace | Yes |
| `SMTP_PORT` | `465` | Yes |
| `SMTP_USER` | The sending mailbox, e.g. `santa@rank.africa` | Yes |
| `SMTP_PASS` | That mailbox's app password (Google: Account → Security → App passwords) | Yes |
| `MAIL_FROM` | Sender shown to staff, e.g. `Rank Secret Santa <santa@rank.africa>` | Optional |
| `ALLOWED_DOMAIN` | Work email domain if not `rank.africa` | Optional |

Redeploy after adding or changing variables.

## Organiser view

Go to `https://<your-site>/#organiser` (there's also an "Organisers" link in the footer) and enter `ADMIN_PASSCODE`. From there you can:

- see who has joined and who still needs a wishlist, and send reminders
- edit the budget, dates, place and email domain
- run the draw (asks you to confirm), or undo it
- add a late joiner (after the draw they're slotted in without changing anyone's revealed match)
- remove someone (before the draw)

Organisers never see who is matched with whom.

## Defaults

Budget ₦15,000 – ₦30,000 · sign-ups close 12 Dec · draw 13 Dec · exchange 19 Dec · Rank office, Lagos. Change these in the organiser view.
