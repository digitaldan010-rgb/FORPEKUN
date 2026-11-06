// Gospel wall art — poster definitions. Coordinates in % of poster, type in vw (poster width).
const E = !!process.env.EDITABLE;
export const C = { or:'#F2611D', deep:'#C9431A', cream:'#F4EADB', ink:'#1C1915', blue:'#24408E', sun:'#FFB238', pink:'#F4B6C0', green:'#2F5D3A', paper:'#FBF6EE' };
// fit box: text stretched to exactly fill a box (glyph bounds). rot = -90 reads bottom-to-top.
const fit = (text, x, y, w, h, fill, font = 'Anton', weight = 400, rot = 0, ls = 0) =>
  `<div class="fit" data-text="${text}" data-font="${weight} 200px '${font}'" data-fill="${fill}" data-rot="${rot}" data-ls="${ls}" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%"></div>`;
const t = (x, y, css, html) => `<div class="t" style="left:${x}%;top:${y}%;${css}">${html}</div>`;
const arrow = (x, y, w, h, dir, fill) => { const r = {r:0,d:90,l:180,u:-90,ur:-45}[dir];
  return `<svg class="t" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%" viewBox="0 0 100 100"><g transform="rotate(${r} 50 50)" fill="${fill}"><path d="M4 41h62V18l30 32-30 32V59H4z"/></g></svg>`; };

export const posters = [
{ id:'01-he-is-worthy', name:'He Is Worthy', w:24, h:36, bg:C.cream, html:
  fit('WOR',4,3.5,92,41,C.or,E?'Anton':'Archivo Black') +
  `<div class="t" style="left:4%;top:46.6%;width:92%;display:flex;justify-content:space-between;align-items:center;font:900 7.4vw/1 Inter;color:${C.ink};letter-spacing:-.02em">
     <span>HE IS</span><span style="flex:1;height:.6vw;background:${C.ink};margin:0 3vw"></span><span style="font:600 1.9vw/1.35 Inter;letter-spacing:.14em;text-align:right">REVELATION 4:11<br>GLORY · HONOUR · POWER</span></div>` +
  fit('THY',4,55.5,92,41,C.or,E?'Anton':'Archivo Black') },

{ id:'02-hallelujah-i-am-not-alone', name:'Hallelujah, I Am Not Alone', w:18, h:24, bg:C.or, html:
  `<svg class="t" style="left:0;top:0;width:100%;height:100%" viewBox="0 0 100 133.33" preserveAspectRatio="none">
     <defs><clipPath id="s"><circle cx="50" cy="133.33" r="34"/></clipPath></defs>
     <circle cx="50" cy="133.33" r="34" fill="${C.sun}"/>
     <g clip-path="url(#s)" fill="${C.or}">${[0,1,2,3,4,5].map(i=>`<rect x="0" y="${106+i*4.6}" width="100" height="${0.8+i*0.55}"/>`).join('')}</g></svg>` +
  t(6,4.5,`font:700 2vw/1 Inter;letter-spacing:.3em;color:${C.ink}`,'HE WILL NOT LEAVE THEE') +
  t(60,4.5,`font:700 2vw/1 Inter;letter-spacing:.3em;color:${C.ink};width:34%;text-align:right`,'DEUT 31:6') +
  fit('HALLE',6,9,88,15.5,C.paper,'Fraunces',900) +
  fit('LUJAH',6,26.5,88,15.5,C.paper,'Fraunces',900) +
  fit('I AM NOT',6,45,88,11,C.ink,'Fraunces',900) +
  fit('ALONE',6,58.5,88,15.5,C.paper,'Fraunces',900)  },

{ id:'03-he-is-my-shepherd', name:'He Is My Shepherd', w:18, h:24, bg:C.cream, html:
  t(0,8,`width:100%;text-align:center;font:400 9vw/1 'DM Serif Display';color:${C.deep};letter-spacing:.02em`,'HE IS MY') +
  fit('SHEPHERD',8,17.5,84,11.5,C.deep,'DM Serif Display') +
  t(8,32.5,`width:84%;display:flex;justify-content:space-between;font:400 2.6vw/1 'DM Serif Display';color:${C.deep};letter-spacing:.06em`,'<span>I SHALL NOT WANT</span><span>PSALM 23:1</span>') +
  `<svg class="t" style="left:8%;top:40%;width:84%;height:54%" viewBox="0 0 100 85.7" preserveAspectRatio="none">${
     Array.from({length:11},(_,i)=>`<path d="M${i*9.46} 85.7V2.7a2.7 2.7 0 0 1 5.4 0V85.7z" fill="${C.or}"/>`).join('')}</svg>` },

{ id:'04-pray', name:'Pray', w:12, h:16, bg:C.ink, html:
  fit('PR',6,5,66,44,C.or) + fit('AY',28,51,66,44,C.or) +
  t(77,5,`width:17%;font:700 2.2vw/1.25 Inter;letter-spacing:.14em;color:${C.cream};text-align:right`,'1 THESS<br>5:17') +
  t(6,74,`width:19%;font:800 3.2vw/1.1 Inter;letter-spacing:.02em;color:${C.cream}`,'PRAY<br>WITH&shy;OUT<br>CEAS&shy;ING') },

{ id:'05-amen', name:'Amen', w:16, h:20, bg:C.or, html:
  `<div class="t" style="left:5%;top:4%;width:90%;height:84%;background:${C.ink}"></div>` +
  (E ? fit('AM',10,8,80,37,C.or,'Archivo Black') + fit('EN',10,47,80,37,C.or,'Archivo Black') : fit('AMEN',10,8,80,76,C.or,'Archivo Black',400,-90)) +
  t(5,91,`width:90%;display:flex;justify-content:space-between;font:800 2.4vw/1 Inter;letter-spacing:.18em;color:${C.ink}`,'<span>SO BE IT</span><span>REVELATION 22:20</span>') },

{ id:'06-psalm-ninety-one', name:'Psalm Ninety One', w:12, h:16, bg:C.paper, html:
  `<div class="t" style="left:6%;top:5%;width:2.2%;height:22%;background:${C.or}"></div>` +
  fit('Psalm',6,47,15,48,C.ink,'Inter',800,-90) +
  fit('ninety one',24,30,15,65,C.ink,'Inter',800,-90) +
  `<svg class="t" style="left:80%;top:5%;width:14%;height:10.5%" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="${C.or}"/></svg>` +
  t(46,18,`width:48%;font:italic 600 2.6vw/1.2 Inter;color:${C.ink}`,'MY REFUGE AND<br>MY FORTRESS') +
  t(46,30,`width:48%;font:400 1.75vw/1.55 Inter;color:${C.ink}`,
   `He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty.<br><br>
    I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.<br><br>
    Surely he shall deliver thee from the snare of the fowler, and from the noisome pestilence.<br><br>
    He shall cover thee with his feathers, and under his wings shalt thou trust: his truth shall be thy shield and buckler.<br><br>
    Thou shalt not be afraid for the terror by night; nor for the arrow that flieth by day.`) +
  t(46,91,`width:48%;font:700 1.6vw/1 Inter;letter-spacing:.2em;color:${C.or}`,'PSALM 91 : 1 – 5') },

{ id:'07-grace-upon-grace', name:'Grace Upon Grace', w:11, h:14, bg:C.cream, html:
  `<svg class="t" style="left:8%;top:6%;width:84%;height:62%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
     <path d="M10 8h40a20 20 0 0 1 0 40H10z" fill="${C.or}"/>
     <path d="M54 8h24a14 14 0 0 1 0 28H54z" fill="${C.blue}"/>
     <circle cx="78" cy="52" r="12" fill="${C.sun}"/>
     <path d="M10 52h24a24 24 0 0 1 0 48H10z" fill="${C.ink}"/>
     <path d="M40 66h50a10 10 0 0 1 0 20H40z" fill="${C.or}"/>
     <path d="M40 90h28v10H40z" fill="${C.blue}"/></svg>` +
  t(8,72,`font:700 13vw/0.9 'Space Grotesk';letter-spacing:-.04em;color:${C.ink}`,'grace') +
  t(8,83.5,`font:500 4.4vw/1 'Space Grotesk';letter-spacing:-.01em;color:${C.ink}`,'upon grace') +
  t(56,74,`width:36%;font:400 1.6vw/1.4 'Space Grotesk';color:${C.ink};text-align:right`,'And of his fulness have all we received, and grace for grace.') +
  t(56,90,`width:36%;font:700 1.7vw/1 'Space Grotesk';letter-spacing:.12em;color:${C.or};text-align:right`,'JOHN 1:16') },

{ id:'08-new-every-morning', name:'New Every Morning', w:20, h:16, bg:'linear-gradient(180deg,#FBE7CF 0%,#F9B98A 32%,#F2611D 58%,#B5321D 78%,#3A1F3D 100%)', html:
  `<svg class="t" style="left:0;top:0;width:100%;height:100%" viewBox="0 0 100 80" preserveAspectRatio="none">
     <defs><clipPath id="c"><rect x="0" y="0" width="100" height="49"/></clipPath><clipPath id="c2"><circle cx="50" cy="41" r="17"/></clipPath></defs>
     <circle cx="50" cy="41" r="17" fill="${C.sun}" clip-path="url(#c)"/>
     <circle cx="50" cy="41" r="17" fill="none"/>
     <g clip-path="url(#c2)">${[0,1,2,3].map(i=>`<rect x="30" y="${36+i*3}" width="40" height="${0.6+i*0.4}" fill="#F7905A"/>`).join('')}</g></svg>` +
  t(0,6,`width:100%;text-align:center;font:700 1.5vw/1 Inter;letter-spacing:.5em;color:${C.ink}`,'HIS COMPASSIONS FAIL NOT') +
  fit('New every morning',10,62,80,14,C.paper,'Fraunces',800) +
  t(0,84,`width:100%;text-align:center;font:600 1.4vw/1 Inter;letter-spacing:.45em;color:${C.cream}`,'LAMENTATIONS 3 : 22 – 23') },

{ id:'09-consider-the-lilies', name:'Consider the Lilies', w:8, h:10, bg:C.paper, html:
  t(7,5,`font:700 6.2vw/0.95 'Space Grotesk';letter-spacing:-.03em;color:${C.ink}`,'CONSIDER<br>THE LILIES') +
  t(60,6,`width:33%;text-align:right;font:500 2.2vw/1.3 'Space Grotesk';color:${C.ink}`,'how they grow') +
  `<svg class="t" style="left:7%;top:22%;width:86%;height:68%" viewBox="0 0 90 92">${(() => {
     const cols=[C.or,C.pink,C.sun,C.deep,C.or,C.blue,C.pink,C.or,C.sun]; let s='';
     for (let i=0;i<9;i++){ const cx=15+(i%3)*30, cy=14+Math.floor(i/3)*31, n=[6,8,5,10,6,8,5,6,7][i], col=cols[i];
       s+=`<path d="M${cx} ${cy+6} C${cx-1} ${cy+16} ${cx+1} ${cy+20} ${cx} ${cy+26}" stroke="${C.green}" stroke-width="1.4" fill="none"/>
           <ellipse cx="${cx+4}" cy="${cy+19}" rx="4" ry="1.6" transform="rotate(-30 ${cx+4} ${cy+19})" fill="${C.green}"/>`;
       for(let k=0;k<n;k++) s+=`<ellipse cx="${cx}" cy="${cy-6}" rx="${i%2?2.8:3.4}" ry="6.2" transform="rotate(${k*360/n} ${cx} ${cy})" fill="${col}"/>`;
       s+=`<circle cx="${cx}" cy="${cy}" r="3" fill="${col===C.sun?C.or:C.sun}"/><circle cx="${cx}" cy="${cy}" r="1.2" fill="${C.ink}"/>`; }
     return s; })()}</svg>` +
  t(7,93,`width:86%;display:flex;justify-content:space-between;font:700 1.8vw/1 'Space Grotesk';letter-spacing:.14em;color:${C.ink}`,'<span>MATTHEW 6:28</span><span>GOSPEL SERIES</span>') },

{ id:'10-romans-8-28', name:'Romans 8:28', w:11, h:14, bg:C.or, html:
  fit('Romans',5,4,17,56,C.cream,'Fraunces',900,-90) +
  fit('8',38,4,40,46,C.ink,'Archivo Black') +
  fit('28',30,54,64,42,C.ink,'Archivo Black') +
  `<svg class="t" style="left:84%;top:8%;width:10%;height:8%" viewBox="0 0 10 10"><path d="M5 0C5.6 3.6 6.4 4.4 10 5 6.4 5.6 5.6 6.4 5 10 4.4 6.4 3.6 5.6 0 5 3.6 4.4 4.4 3.6 5 0z" fill="${C.cream}"/></svg>` +
  t(5,64,`width:21%;font:800 1.75vw/1.35 Inter;letter-spacing:.06em;color:${C.cream}`,'AND WE KNOW THAT ALL THINGS WORK TOGETHER FOR GOOD TO THEM THAT LOVE GOD') },

{ id:'11-be-still', name:'Be Still', w:8, h:10, bg:C.paper, html:
  fit('BE',7,6,26,16,C.ink,'Inter',900) + arrow(36,6,26,16,'r',C.or) + arrow(64,6,29,16,'r',C.or) +
  fit('STILL',7,25,86,16,C.ink,'Inter',900) +
  fit('AND',7,44,40,16,C.ink,'Inter',900) + arrow(50,44,20,16,'l',C.or) + arrow(73,44,20,16,'d',C.or) +
  fit('KNOW',7,63,86,16,C.ink,'Inter',900) +
  t(7,85,`font:900 5.4vw/1 Inter;letter-spacing:-.02em;color:${C.ink}`,'THAT I AM GOD.') +
  t(7,94,`width:86%;display:flex;justify-content:space-between;font:700 1.7vw/1 Inter;letter-spacing:.18em;color:${C.or}`,'<span>PSALM 46:10</span><span>→ ← ↓</span>'.replace('→ ← ↓','SELAH')) },
];
