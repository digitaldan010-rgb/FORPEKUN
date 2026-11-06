import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)('/opt/node-tools/node_modules/playwright');
import fs from 'fs'; import path from 'path';
const files = fs.readdirSync((process.env.DIR||'../preview')).filter(f=>f.endsWith('.png')).sort();
const html = `<body style="margin:0;background:#888;display:flex;flex-wrap:wrap;gap:20px;padding:20px;width:2000px;align-items:flex-start">${files.map(f=>`<img src="file://${path.resolve((process.env.DIR||'../preview')+'/'+f)}" style="height:560px">`).join('')}</body>`;
fs.writeFileSync('sheet.html', html);
const b = await chromium.launch(); const p = await b.newPage({viewport:{width:2040,height:800}});
await p.goto('file://'+path.resolve('sheet.html')); await p.waitForTimeout(500);
await p.screenshot({path:'sheet.png', fullPage:true}); await b.close();
