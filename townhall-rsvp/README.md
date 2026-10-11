# Town Hall Meeting RSVP

A Typeform-style RSVP form in the Rank brand. Each answer is saved as a new row in a Google Sheet.

**What it asks**
1. Name
2. What department are you in?
3. Should we plan for you? (Yes / No)
4. Rice or Swallow? (only asked if they answer Yes)

**Columns it fills:** Timestamp · Name · Department · Should we plan for you? · Rice or Swallow?

The site is this folder: `index.html` plus the `assets/` images.

## 1. Connect the Google Sheet (one time, about 5 minutes)

A small script inside the sheet receives each answer and adds the row. `apps-script.gs` is already set to this sheet's ID.

1. Open the RSVP sheet: https://docs.google.com/spreadsheets/d/1GpieMVaCbJ3-AH-_kw8WIOoHy4SMs4Kv08e-emvi774/edit (you need edit access).
2. Go to **Extensions → Apps Script**.
3. Delete anything in the editor, paste in everything from `apps-script.gs`, and click **Save**.
4. Click **Deploy → New deployment**. Click the gear icon next to "Select type" and choose **Web app**.
5. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
6. Click **Deploy**. Google asks you to authorise it: choose your account, then **Advanced → Go to (project name) → Allow**.
7. Copy the **Web app URL**. It looks like `https://script.google.com/macros/s/AKfy.../exec`.

If the sheet is empty, the script adds the column headers on the first submission. If you'd rather write to a specific tab, put its name in `SHEET_NAME` at the top of the script.

## 2. Paste the URL into the form

Open `index.html`, find this line near the bottom, and paste your URL between the quotes:

```js
const SCRIPT_URL = '';
```

Until it's set, the form shows "This form isn't connected to the sheet yet." when someone tries to submit.

## 3. Put it on Netlify

Either:
- **Drag and drop:** go to app.netlify.com → **Add new site → Deploy manually**, and drop the `townhall-rsvp` folder in.
- **From GitHub:** **Add new site → Import an existing project**, pick this repo, and set **Base directory** to `townhall-rsvp`. Leave the build command empty and set **Publish directory** to `townhall-rsvp`.

## Test it

Submit the form once yourself and check that a new row appears in the sheet.

## Changing the script later

If you edit `apps-script.gs` after deploying, go to **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. The URL stays the same.
