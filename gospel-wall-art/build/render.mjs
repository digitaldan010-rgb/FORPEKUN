import { posters } from './posters.mjs';
import { createRequire } from 'module'; const { chromium } = createRequire(import.meta.url)(process.env.PWPATH || 'playwright');
import fs from 'fs'; import path from 'path';
const F = p => 'file://' + path.resolve('node_modules/@fontsource/' + p);
const faces = [['Anton','anton/files/anton-latin-400-normal.woff2',400],['Archivo Black','archivo-black/files/archivo-black-latin-400-normal.woff2',400],
 ['DM Serif Display','dm-serif-display/files/dm-serif-display-latin-400-normal.woff2',400],
 ...[400,600,700,800,900].map(w=>['Fraunces',`fraunces/files/fraunces-latin-${w}-normal.woff2`,w]),
 ...[400,500,600,700,800,900].map(w=>['Inter',`inter/files/inter-latin-${w}-normal.woff2`,w]),
 ['Inter','inter/files/inter-latin-600-italic.woff2',600,'italic'],
 ...[400,500,700].map(w=>['Space Grotesk',`space-grotesk/files/space-grotesk-latin-${w}-normal.woff2`,w])]
 .map(([f,p,w,s='normal'])=>`@font-face{font-family:'${f}';src:url(${F(p)});font-weight:${w};font-style:${s}}`).join('');
const fitJS = `(async()=>{await document.fonts.ready;
 for(const el of document.querySelectorAll('.fit')){const {text,font,fill,rot,ls}=el.dataset;await document.fonts.load(font);
  const c=document.createElement('canvas').getContext('2d');c.font=font;c.letterSpacing=ls+'px';const m=c.measureText(text);
  const L=m.actualBoundingBoxLeft,R=m.actualBoundingBoxRight,A=m.actualBoundingBoxAscent,D=m.actualBoundingBoxDescent;
  let R2; const [fw,fam]=[font.split(' ')[0],font.slice(font.indexOf("'"))];
  let r=+rot, pa='none', lsx=+ls;
  if (window.EDITABLE){ pa='xMidYMid meet'; const bw=el.offsetWidth, bh=el.offsetHeight; const run=(r?bh/bw:bw/bh)*(A+D), nat=L+R, n=[...text].length;
    if (run>nat && n>1){ lsx=(run-nat)/(n-1); c.letterSpacing=lsx+'px'; const m2=c.measureText(text); R2=m2.actualBoundingBoxRight; } }
  const RR = (typeof R2!=='undefined')?R2:R;
  const vb = r? \`\${-A} \${-RR} \${A+D} \${L+RR}\` : \`\${-L} \${-A} \${L+RR} \${A+D}\`;
  el.innerHTML=\`<svg viewBox="\${vb}" preserveAspectRatio="\${pa}" width="100%" height="100%" style="display:block;overflow:visible"><text x="0" y="0" \${r?'transform="rotate(-90)"':''} fill="\${fill}" style="font-family:\${fam};font-weight:\${fw};font-size:200px;letter-spacing:\${lsx}px">\${text}</text></svg>\`;}
 window.__ready=true;})()`;
const page = (p) => `<!doctype html><html><head><meta charset="utf-8"><style>${faces}
 *{margin:0;padding:0;box-sizing:border-box}html,body{width:100vw;height:100vh;overflow:hidden}
 body{background:${p.bg};position:relative;-webkit-font-smoothing:antialiased}
 .fit,.t{position:absolute}</style></head><body>${p.html}<script>window.EDITABLE=${!!process.env.EDITABLE};${fitJS}</script></body></html>`;
const only = process.argv[2];
const out = path.resolve(process.env.EDITABLE ? '../canva-editable' : '..'); fs.mkdirSync(out+'/print-pdf',{recursive:true}); fs.mkdirSync(out+'/preview',{recursive:true});
const b = await chromium.launch();
for (const p of posters) { if (only && !p.id.includes(only)) continue;
  const W = p.w*96, H = p.h*96; const scale = 1400/Math.max(W,H) ;
  const ctx = await b.newContext({ viewport:{width:W,height:H}, deviceScaleFactor: Math.max(scale,0.5) });
  const pg = await ctx.newPage(); fs.writeFileSync('tmp.html', page(p)); await pg.goto('file://'+path.resolve('tmp.html'));
  await pg.waitForFunction('window.__ready');
  await pg.screenshot({ path:`${out}/preview/${p.id}.png` });
  await pg.pdf({ path:`${out}/print-pdf/${p.id}_${p.w}x${p.h}in${process.env.EDITABLE?'_editable':''}.pdf`, width:p.w+'in', height:p.h+'in', printBackground:true, pageRanges:'1' });
  await ctx.close(); console.log('done', p.id);
}
await b.close();
