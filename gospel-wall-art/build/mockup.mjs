import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('/opt/node-tools/node_modules/playwright');
import { posters } from './posters.mjs'; import fs from 'fs'; import path from 'path';
const P = Object.fromEntries(posters.map(p=>[p.id.slice(0,2),p]));
// [id, x, y] in inches on a 170 x 100 in wall
const L = [['01',28.5,12],['05',9.5,24],['07',41.5,51],['06',26.5,51],
  ['04',61,18],['09',76,24],['10',87,20],['11',101,24],
  ['02',117.5,12],['03',117.5,39],['08',138.5,20]];
const u = 10; // px per inch
const frames = L.map(([id,x,y])=>{const p=P[id];return `<div class="fr" style="left:${x*u}px;top:${y*u}px;width:${p.w*u}px;height:${p.h*u}px"><img src="file://${path.resolve('../preview/'+p.id+'.png')}"></div>
 <div class="lbl" style="left:${x*u}px;top:${(y+p.h)*u+6}px;width:${p.w*u}px">${p.w}×${p.h}</div>`}).join('');
const html = `<style>*{margin:0;box-sizing:border-box}body{width:1700px;height:1000px;position:relative;overflow:hidden;
 background:linear-gradient(90deg,rgba(0,0,0,.06),transparent 30%,transparent 70%,rgba(0,0,0,.08)),#E3D6C3;font-family:sans-serif}
 .fr{position:absolute;border:6px solid #17140f;box-shadow:0 10px 18px rgba(0,0,0,.28),0 2px 4px rgba(0,0,0,.2);background:#fff}
 .fr img{width:100%;height:100%;display:block}
 .lbl{position:absolute;text-align:center;font:600 11px/1 sans-serif;color:rgba(0,0,0,.35);letter-spacing:.08em}
 .tv{position:absolute;left:565px;top:400px;width:570px;height:320px;background:linear-gradient(135deg,#1b1d22,#050506 60%);border:5px solid #0b0b0c;border-radius:4px;box-shadow:0 14px 30px rgba(0,0,0,.35)}
 .console{position:absolute;left:400px;top:790px;width:900px;height:170px;background:linear-gradient(#9a6a42,#835834);border-radius:4px;box-shadow:0 18px 30px rgba(0,0,0,.25)}
 .console:after{content:'';position:absolute;inset:18px 30px;background:repeating-linear-gradient(90deg,#8a5d38 0 220px,#6e4728 220px 224px);border-radius:2px}
 .floor{position:absolute;left:0;right:0;top:960px;bottom:0;background:#b98d63}</style>
 <body>${frames}<div class="tv"></div><div class="floor"></div><div class="console"></div></body>`;
fs.writeFileSync('mockup.html', html);
const b = await chromium.launch(); const pg = await b.newPage({viewport:{width:1700,height:1000},deviceScaleFactor:2});
await pg.goto('file://'+path.resolve('mockup.html')); await pg.waitForTimeout(400);
await pg.screenshot({path:'../tv-wall-mockup.png'}); await b.close();
