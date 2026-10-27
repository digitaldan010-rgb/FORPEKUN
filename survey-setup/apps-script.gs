/**
 * Rank H2 2026 Employee Experience Survey: saves each response as one row.
 *
 * Setup (once):
 * 1. Create a blank Google Sheet (sheets.new) and name it, e.g. "Rank H2 2026 Survey Responses".
 * 2. Extensions > Apps Script. Delete what's there, paste this whole file, click Save.
 * 3. Deploy > New deployment > gear icon > Web app.
 *      Execute as: Me
 *      Who has access: Anyone
 *    Click Deploy, allow access, then copy the Web app URL (ends in /exec).
 * 4. Put that URL in CONFIG.endpoint in the survey's index.html.
 *
 * Anonymity: nothing about the person is stored. Only the date (not the time) is recorded.
 */
const SHEET_NAME = 'Responses';
const TIMEZONE = 'Africa/Lagos';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const data = JSON.parse(e.postData.contents);
    if (!data || !data.id || !Array.isArray(data.fields)) return reply({ ok: false, error: 'Bad request' });

    const sheet = getSheet();

    let headers = sheet.getLastColumn() > 0
      ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String)
      : [];
    if (headers.length === 0) headers = ['Response ID', 'Date submitted'];

    // Ignore a response that was already saved (e.g. a retry after a slow connection).
    const idCol = headers.indexOf('Response ID') + 1;
    if (idCol > 0 && sheet.getLastRow() > 1) {
      const hit = sheet.getRange(2, idCol, sheet.getLastRow() - 1, 1)
        .createTextFinder(String(data.id)).matchEntireCell(true).findNext();
      if (hit) return reply({ ok: true, duplicate: true });
    }

    const values = {};
    data.fields.forEach(function (f) {
      const header = String(f[0]).slice(0, 500);
      if (headers.indexOf(header) === -1) headers.push(header);
      values[header] = clean(f[1]);
    });
    values['Response ID'] = String(data.id).slice(0, 64);
    values['Date submitted'] = Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd');

    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold').setWrap(true);
    sheet.setFrozenRows(1);
    sheet.appendRow(headers.map(function (h) { return values[h] !== undefined ? values[h] : ''; }));
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Visit the /exec URL in a browser to check the script is running.
// The survey also calls ?check=<id>&callback=<fn> to confirm a response was saved.
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.check && /^[A-Za-z_$][\w$]{0,60}$/.test(p.callback || '')) {
    let found = false;
    try {
      const sheet = getSheet();
      const headers = sheet.getLastColumn() > 0 ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String) : [];
      const idCol = headers.indexOf('Response ID') + 1;
      if (idCol > 0 && sheet.getLastRow() > 1) {
        found = !!sheet.getRange(2, idCol, sheet.getLastRow() - 1, 1)
          .createTextFinder(String(p.check)).matchEntireCell(true).findNext();
      }
    } catch (err) {}
    return ContentService.createTextOutput(p.callback + '(' + JSON.stringify({ found: found }) + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  let status = 'Rank survey endpoint is running.';
  try { getSheet(); } catch (err) { status = 'Running, but: ' + err.message; }
  return reply({ ok: true, message: status });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('This script is not attached to a sheet. Open the sheet, then Extensions > Apps Script, and paste it there.');
  return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
}

// Stop answers from being read as spreadsheet formulas, and cap their length.
function clean(v) {
  let s = v == null ? '' : String(v).slice(0, 5000);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
