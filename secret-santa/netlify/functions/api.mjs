// Rank Secret Santa API (Netlify Functions v2 + Netlify Blobs)
import crypto from 'node:crypto';
import nodemailer from 'nodemailer';

export const config = { path: '/api/*' };

const DEFAULT_SETTINGS = {
  budget: '₦15,000 – ₦30,000',
  regClose: '2026-12-12',
  drawDate: '2026-12-13',
  exchange: '2026-12-19',
  place: 'Rank office, Lagos',
  domain: process.env.ALLOWED_DOMAIN || 'rank.africa',
};
const CODE_TTL = 15 * 60 * 1000;          // sign-in codes last 15 minutes
const SESSION_TTL = 60 * 24 * 60 * 60 * 1000; // sessions last 60 days
const SECRET = process.env.SESSION_SECRET || 'change-me';

/* ---------- storage ---------- */
let storePromise;
async function store() {
  if (!storePromise) {
    storePromise = (async () => {
      if (process.env.LOCAL_STORE_DIR) return fileStore(process.env.LOCAL_STORE_DIR);
      const { getStore } = await import('@netlify/blobs');
      return getStore({ name: 'secret-santa', consistency: 'strong' });
    })();
  }
  return storePromise;
}
async function fileStore(dir) {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  await fs.mkdir(dir, { recursive: true });
  const f = (k) => path.join(dir, encodeURIComponent(k) + '.json');
  return {
    async get(k) { try { return JSON.parse(await fs.readFile(f(k), 'utf8')); } catch { return null; } },
    async setJSON(k, v) { await fs.writeFile(f(k), JSON.stringify(v)); },
    async delete(k) { try { await fs.unlink(f(k)); } catch {} },
  };
}
async function getJSON(k) {
  const s = await store();
  if (process.env.LOCAL_STORE_DIR) return s.get(k);
  return s.get(k, { type: 'json' });
}
async function setJSON(k, v) { return (await store()).setJSON(k, v); }
async function del(k) { return (await store()).delete(k); }

async function loadState() {
  const st = (await getJSON('state')) || {};
  return {
    settings: { ...DEFAULT_SETTINGS, ...(st.settings || {}) },
    people: st.people || {},       // keyed by email
    drawn: !!st.drawn,
    matches: st.matches || {},     // giverEmail -> recipientEmail (never sent to admin)
    revealed: st.revealed || {},
  };
}
const saveState = (st) => setJSON('state', st);

/* ---------- helpers ---------- */
const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
});
const fail = (msg, status = 400) => json({ error: msg }, status);
const hash = (v) => crypto.createHmac('sha256', SECRET).update(String(v)).digest('hex');
const clean = (v, max = 200) => String(v ?? '').trim().slice(0, max);
const normEmail = (e) => clean(e, 160).toLowerCase();
function safeEqual(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
function publicPerson(p) { return { name: p.name, team: p.team || '', wish: p.wish || null }; }

/* ---------- email ---------- */
let transport;
function mailer() {
  if (process.env.MAIL_DRYRUN) return { sendMail: async (m) => { console.log('[mail]', m.to, '|', m.subject); } };
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  if (!transport) {
    const port = Number(process.env.SMTP_PORT || 465);
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST, port, secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transport;
}
const SITE = () => process.env.URL || 'https://your-site.netlify.app';
function emailHtml(title, body, cta) {
  return `<div style="background:#240701;padding:32px 16px;font-family:Arial,sans-serif">
  <div style="max-width:520px;margin:0 auto;background:#3A1106;border-radius:18px;padding:28px;color:#FBEFDF">
    <p style="margin:0 0 6px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#FF8A3D">Rank Secret Santa · Christmas 2026</p>
    <h1 style="margin:0 0 14px;font-size:26px;line-height:1.15">${title}</h1>
    <div style="font-size:15px;line-height:1.55;color:#D9C6B8">${body}</div>
    ${cta ? `<p style="margin:24px 0 0"><a href="${cta.href}" style="background:#FF6A00;color:#240701;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:999px;display:inline-block">${cta.label}</a></p>` : ''}
  </div></div>`;
}
async function send(to, subject, title, body, cta) {
  const m = mailer();
  if (!m) throw new Error('EMAIL_NOT_CONFIGURED');
  await m.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to, subject,
    html: emailHtml(title, body, cta),
    text: `${title}\n\n${body.replace(/<[^>]+>/g, '')}${cta ? `\n\n${cta.label}: ${cta.href}` : ''}`,
  });
}

/* ---------- auth ---------- */
async function sessionEmail(req) {
  const h = req.headers.get('authorization') || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  if (!token || token.length < 20) return null;
  const s = await getJSON('sess:' + hash(token));
  if (!s || s.exp < Date.now()) return null;
  return s.email;
}
function isAdmin(req) {
  const pass = process.env.ADMIN_PASSCODE;
  const got = req.headers.get('x-admin-passcode') || '';
  return !!pass && got && safeEqual(got, pass);
}

/* ---------- handler ---------- */
export default async (req) => {
  const url = new URL(req.url);
  const route = url.pathname.replace(/^\/(\.netlify\/functions\/)?api\/?/, '').replace(/\/$/, '');
  const method = req.method;
  let body = {};
  if (method !== 'GET' && method !== 'HEAD') { try { body = await req.json(); } catch { body = {}; } }

  try {
    /* public event info */
    if (route === 'public' && method === 'GET') {
      const st = await loadState();
      return json({ settings: st.settings, count: Object.keys(st.people).length, drawn: st.drawn });
    }

    /* step 1: request a sign-in code */
    if (route === 'request-code' && method === 'POST') {
      const st = await loadState();
      const email = normEmail(body.email);
      const name = clean(body.name, 80);
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fail('Enter a valid email address.');
      if (email.split('@')[1] !== st.settings.domain.toLowerCase()) return fail(`Use your Rank work email ending in @${st.settings.domain}.`);
      const existing = st.people[email];
      if (!existing) {
        if (st.drawn) return fail('Registration has closed because the draw is done. Ask the organisers to add you.');
        if (name.split(/\s+/).filter(Boolean).length < 2) return fail('Add your first and last name to join.');
      }
      const prev = await getJSON('code:' + email);
      if (prev && prev.sentAt && Date.now() - prev.sentAt < 45 * 1000) return fail('We just sent you a code. Wait a minute before asking for another.', 429);
      const code = String(crypto.randomInt(100000, 1000000));
      await setJSON('code:' + email, { hash: hash(code), exp: Date.now() + CODE_TTL, tries: 0, sentAt: Date.now(), name, team: clean(body.team, 60) });
      try {
        await send(email, `Your Rank Secret Santa code: ${code}`, 'Here is your sign-in code',
          `Use this code to ${existing ? 'sign in to' : 'join'} the Rank Secret Santa:<br><br><b style="font-size:28px;letter-spacing:6px;color:#FDBA30">${code}</b><br><br>It expires in 15 minutes. If you didn't ask for it, you can ignore this email.`);
      } catch (e) {
        if (e.message === 'EMAIL_NOT_CONFIGURED') return fail('Email sending isn\'t set up yet. Ask the organisers to add the SMTP settings.', 503);
        console.error(e); return fail('We couldn\'t send the email. Try again in a moment.', 502);
      }
      return json({ ok: true, existing: !!existing });
    }

    /* step 2: verify code, start a session */
    if (route === 'verify' && method === 'POST') {
      const email = normEmail(body.email);
      const rec = await getJSON('code:' + email);
      if (!rec || rec.exp < Date.now()) return fail('That code has expired. Ask for a new one.');
      if (rec.tries >= 5) return fail('Too many attempts. Ask for a new code.', 429);
      if (!safeEqual(hash(clean(body.code, 10)), rec.hash)) {
        rec.tries++; await setJSON('code:' + email, rec);
        return fail('That code doesn\'t match. Check the email and try again.');
      }
      await del('code:' + email);
      const st = await loadState();
      if (!st.people[email]) {
        if (st.drawn) return fail('Registration has closed because the draw is done.');
        st.people[email] = { id: crypto.randomUUID(), name: rec.name, email, team: rec.team, wish: null, joined: Date.now() };
        await saveState(st);
        send(email, 'You\'re in the Rank Secret Santa!', 'You\'re in!',
          `Thanks for joining, ${rec.name.split(' ')[0]}. Add your wishlist so your Secret Santa can pick something thoughtful. Budget: ${st.settings.budget}.`,
          { href: SITE() + '/#wishlist', label: 'Add my wishlist' }).catch(console.error);
      }
      const token = crypto.randomBytes(32).toString('base64url');
      await setJSON('sess:' + hash(token), { email, exp: Date.now() + SESSION_TTL });
      return json({ token });
    }

    /* signed-in routes */
    if (['me', 'wishlist', 'reveal', 'signout'].includes(route)) {
      const email = await sessionEmail(req);
      if (!email) return fail('Please sign in again.', 401);
      if (route === 'signout' && method === 'POST') {
        const t = (req.headers.get('authorization') || '').slice(7); await del('sess:' + hash(t)); return json({ ok: true });
      }
      const st = await loadState();
      const me = st.people[email];
      if (!me) return fail('You\'re no longer on the participant list. Contact the organisers.', 404);

      if (route === 'me' && method === 'GET') {
        const out = { me: { name: me.name, email, team: me.team, wish: me.wish }, settings: st.settings, drawn: st.drawn, count: Object.keys(st.people).length, hasMatch: false, revealed: false, recipient: null };
        if (st.drawn && st.matches[email] && st.people[st.matches[email]]) {
          out.hasMatch = true;
          out.revealed = !!st.revealed[email];
          if (out.revealed) out.recipient = publicPerson(st.people[st.matches[email]]);
        }
        return json(out);
      }
      if (route === 'wishlist' && method === 'PUT') {
        const ideas = (Array.isArray(body.ideas) ? body.ideas : []).slice(0, 3).map((i) => clean(i, 120));
        if (ideas.filter(Boolean).length < 3) return fail('Add three gift ideas so your Santa has options.');
        me.wish = { ideas, likes: clean(body.likes, 200), avoid: clean(body.avoid, 200), hints: clean(body.hints, 400) };
        await saveState(st);
        return json({ ok: true, wish: me.wish });
      }
      if (route === 'reveal' && method === 'POST') {
        if (!st.drawn || !st.matches[email]) return fail('The draw hasn\'t happened yet.');
        st.revealed[email] = true; await saveState(st);
        return json({ recipient: publicPerson(st.people[st.matches[email]]) });
      }
    }

    /* organiser routes */
    if (route.startsWith('admin')) {
      if (!process.env.ADMIN_PASSCODE) return fail('Set ADMIN_PASSCODE in Netlify before using the organiser view.', 503);
      if (!isAdmin(req)) return fail('Wrong organiser passcode.', 401);
      const st = await loadState();
      const sub = route.slice(6);

      if (sub === '' && method === 'GET') {
        const people = Object.values(st.people).sort((a, b) => a.joined - b.joined).map((p) => ({
          email: p.email, name: p.name, team: p.team || '', hasWish: !!p.wish, revealed: !!st.revealed[p.email], matched: !!st.matches[p.email],
        }));
        return json({ settings: st.settings, drawn: st.drawn, people, emailReady: !!mailer() });
      }
      if (sub === 'settings' && method === 'PUT') {
        const s = st.settings;
        const date = (v, d) => (/^\d{4}-\d{2}-\d{2}$/.test(v || '') ? v : d);
        st.settings = {
          budget: clean(body.budget, 40) || s.budget,
          regClose: date(body.regClose, s.regClose), drawDate: date(body.drawDate, s.drawDate), exchange: date(body.exchange, s.exchange),
          place: clean(body.place, 80) || s.place,
          domain: (clean(body.domain, 60) || s.domain).replace(/^@/, '').toLowerCase(),
        };
        await saveState(st); return json({ ok: true, settings: st.settings });
      }
      if (sub === 'draw' && method === 'POST') {
        if (st.drawn) return fail('The draw has already happened.');
        const emails = Object.keys(st.people);
        if (emails.length < 3) return fail('You need at least 3 people to run the draw.');
        for (let i = emails.length - 1; i > 0; i--) { const j = crypto.randomInt(0, i + 1); [emails[i], emails[j]] = [emails[j], emails[i]]; }
        const m = {}; emails.forEach((e, i) => { m[e] = emails[(i + 1) % emails.length]; });
        st.matches = m; st.drawn = true; st.revealed = {};
        await saveState(st);
        let sent = 0, failed = 0;
        for (const e of emails) {
          try {
            await send(e, 'Your Secret Santa is ready! 🎁', 'Psst… someone is waiting for a Christmas surprise!',
              `The draw is done, ${st.people[e].name.split(' ')[0]}. Sign in and tap <b>Reveal my person</b> to see who you're gifting.<br><br>Budget: ${st.settings.budget}<br>Exchange: ${st.settings.exchange} · ${st.settings.place}`,
              { href: SITE() + '/#my-santa', label: 'Reveal my person' });
            sent++;
          } catch (err) { failed++; console.error(err.message); }
        }
        return json({ ok: true, matches: emails.length, sent, failed });
      }
      if (sub === 'undo-draw' && method === 'POST') {
        st.drawn = false; st.matches = {}; st.revealed = {};
        await saveState(st); return json({ ok: true });
      }
      if (sub === 'remind' && method === 'POST') {
        const miss = Object.values(st.people).filter((p) => !p.wish);
        let sent = 0;
        for (const p of miss) {
          try { await send(p.email, 'Don\'t forget your Secret Santa wishlist', 'Your Santa needs some ideas',
            `Hi ${p.name.split(' ')[0]}, add three gift ideas so your Secret Santa can pick something you'll love.`,
            { href: SITE() + '/#wishlist', label: 'Add my wishlist' }); sent++; } catch (e) { console.error(e.message); }
        }
        return json({ ok: true, missing: miss.length, sent });
      }
      if (sub === 'remove' && method === 'POST') {
        const email = normEmail(body.email);
        if (st.drawn) return fail('Undo the draw before removing someone, or everyone\'s matches would break.');
        delete st.people[email]; await saveState(st); return json({ ok: true });
      }
      if (sub === 'add' && method === 'POST') {
        const email = normEmail(body.email), name = clean(body.name, 80);
        if (email.split('@')[1] !== st.settings.domain) return fail(`Use an @${st.settings.domain} email.`);
        if (st.people[email]) return fail('That person is already registered.');
        if (name.split(/\s+/).filter(Boolean).length < 2) return fail('Add their first and last name.');
        st.people[email] = { id: crypto.randomUUID(), name, email, team: clean(body.team, 60), wish: null, joined: Date.now() };
        if (st.drawn) {
          // late joiner: slot them into the chain without changing anyone's revealed match
          const giver = Object.keys(st.matches).find((g) => !st.revealed[g]);
          if (!giver) { delete st.people[email]; return fail('Everyone has already revealed. Undo the draw to add someone.'); }
          st.matches[email] = st.matches[giver]; st.matches[giver] = email;
        }
        await saveState(st); return json({ ok: true });
      }
    }

    return fail('Not found.', 404);
  } catch (e) {
    console.error(e);
    return fail('Something went wrong on our side. Try again.', 500);
  }
};
