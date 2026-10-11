/**
 * Town Hall Meeting RSVP: receives form submissions and adds a row to this sheet.
 * Paste this into Extensions → Apps Script in the RSVP Google Sheet, then deploy
 * it as a web app (see README.md).
 */

// Name of the tab to write to. Leave blank to use the first tab.
const SHEET_NAME = '';

const HEADERS = ['Timestamp', 'Name', 'Department', 'Should we plan for you?', 'Rice or Swallow?'];

function doPost(e) {
  const p = (e && e.parameter) || {};

  // Honeypot: bots fill the hidden "website" field, people don't.
  if (p.website) return json({ ok: true });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = SHEET_NAME ? ss.getSheetByName(SHEET_NAME) : ss.getSheets()[0];

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),
      clean(p.name),
      clean(p.department),
      clean(p.attending),
      clean(p.food),
    ]);

    return json({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// Lets you open the web app URL in a browser to check it's live.
function doGet() {
  return json({ ok: true, form: 'Town Hall Meeting RSVP' });
}

// Trim, cap length, and stop text like "=SUM(...)" from running as a formula.
function clean(value) {
  const s = String(value || '').trim().slice(0, 200);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
