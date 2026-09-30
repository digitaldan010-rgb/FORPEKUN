# Rank Staff Leaderboard

A live Deposit Drive and Referrals leaderboard that reads straight from the Google Sheet. It refreshes every 60 seconds.

The site is the `rank-dashboard/` folder, which holds one `index.html` file.

## 1. Publish the sheet (one time)

1. Open the sheet and go to **File → Share → Publish to web**.
2. Under **Link**, choose **Entire document** and **Web page**, then click **Publish**.
3. Tick **Automatically republish when changes are made** (it's under "Published content & settings").

Google updates the published copy within about 5 minutes of an edit, so the dashboard can trail the sheet by that much.

## 2. Connect the Referrals tab (recommended)

The dashboard tries to find each tab on its own. To be certain it loads the right ones:

1. In the sheet, click the **Referral BOARD** tab. The address bar ends in `#gid=123456789`. Copy that number.
2. Do the same for **LEADERSHIP BOARD (2)**.
3. Open `rank-dashboard/index.html` in any text editor, find `const CONFIG` near the bottom, and paste the numbers:

```js
deposit:  { gid: "PASTE_DEPOSIT_GID",  ... },
referral: { gid: "PASTE_REFERRAL_GID", ... },
```

## 3. Put it online

**Netlify (drag and drop):** go to https://app.netlify.com/drop and drag the `rank-dashboard` folder (or `rank-dashboard.zip`) onto the page. You get a link you can share straight away. To update the site later, open the site in Netlify, go to **Deploys**, and drag the folder in again.

**Vercel:** click **Add New → Project**, import this GitHub repo, set **Root Directory** to `rank-dashboard`, and click **Deploy**.

## Editing

The source lives in `src/app.html`. After changing it, rebuild with:

```
python3 src/build.py --deposit-gid N --referral-gid N
```
