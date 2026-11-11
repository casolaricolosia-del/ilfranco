// Genera il sito statico de Il Franco in ./site a partire da articles.js, archive.js e src.html
const fs=require("fs"),path=require("path");
const BASE="https://ilfranco.com", OUT=path.join(__dirname,"..","_site_tmp");
global.window={};eval(fs.readFileSync(path.join(__dirname,"articles.js"),"utf8"));eval(fs.readFileSync(path.join(__dirname,"archive.js"),"utf8"));
const src=fs.readFileSync(path.join(__dirname,"src.html"),"utf8");
const css=src.match(/<style>([\s\S]*?)<\/style>/)[1].replace("nav.cats button{","nav.cats a{").replace('nav.cats button[aria-pressed="true"]','nav.cats a[aria-current="page"]');
let PAGES;eval("PAGES="+src.match(/var PAGES=(\{[\s\S]*?\n  \});/)[1]);
const all=(window.ARTICLES||[]).concat(window.ARCHIVE||[]).sort((a,b)=>(b.date+(b.time||"")).localeCompare(a.date+(a.time||"")));
const HUES={Cronaca:4,Comune:222,Eventi:286,Sport:150,Salute:176,Economia:32,Scuola:255};
const MESI=["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=d=>{const p=String(d).split("-");return (+p[2])+" "+MESI[+p[1]-1]+" "+p[0];};
const url=a=>"/notizie/"+a.id.replace(/^a-/,"")+"/";
const slug=c=>c.toLowerCase();
const iso=a=>(a.published||a.date)+"T"+(a.time||"08:00")+":00+01:00";
const safeUrl=u=>/^https?:\/\//i.test(u||"")?u:"/";
const cats=[];all.forEach(a=>{if(a.category&&!cats.includes(a.category))cats.push(a.category);});
const cover=a=>'<div class="cover" style="--h:'+(HUES[a.category]==null?210:HUES[a.category])+'" data-letter="'+esc((a.category||"N").charAt(0))+'"></div>';
const item=(a,s)=>'<a class="item" href="'+url(a)+'"><span class="eyebrow">'+esc(a.category||"Notizie")+'</span><h2>'+esc(a.title)+'</h2>'+(s?'<p>'+esc(a.summary)+'</p>':'')+'<span class="meta">'+esc(fmt(a.date))+'</span></a>';
const ad=t=>'<a class="ad" href="/pubblicita/"><small>Spazio pubblicitario</small><b>'+t+'</b><span>Scopri come comparire su Il Franco</span></a>';
const nav=cur=>'<nav class="cats" aria-label="Sezioni"><a href="/"'+(cur==="Tutte"?' aria-current="page"':'')+'>Tutte</a>'+cats.map(c=>'<a href="/sezione/'+slug(c)+'/"'+(c===cur?' aria-current="page"':'')+'>'+esc(c)+'</a>').join("")+'</nav>';
const ORG={"@context":"https://schema.org","@type":"NewsMediaOrganization","name":"Il Franco","url":BASE+"/","logo":BASE+"/icona.svg","description":"Sito di informazione locale su Castelfranco Emilia (MO)","areaServed":"Castelfranco Emilia","inLanguage":"it","sameAs":["https://www.facebook.com/profile.php?id=61596625792838"]};
const ld=o=>'<script type="application/ld+json">'+JSON.stringify(o).replace(/</g,"\\u003c")+'</script>';
function shell(o){ // o: title, desc, path, main, type, extraHead
  const t=o.title?o.title+" | Il Franco":"Il Franco – Notizie da Castelfranco Emilia";
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t)}</title>
<meta name="description" content="${esc(o.desc)}">
<link rel="canonical" href="${BASE+o.path}">
<meta property="og:site_name" content="Il Franco">
<meta property="og:type" content="${o.type||"website"}">
<meta property="og:title" content="${esc(o.title||"Il Franco – Notizie da Castelfranco Emilia")}">
<meta property="og:description" content="${esc(o.desc)}">
<meta property="og:url" content="${BASE+o.path}">
<meta property="og:image" content="${BASE}/condivisione.png">
<meta property="og:locale" content="it_IT">
<meta name="twitter:card" content="summary">
<link rel="icon" href="/icona.svg" type="image/svg+xml">
<link rel="alternate" type="application/rss+xml" title="Il Franco" href="/feed.xml">
${o.extraHead||ld(ORG)}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600&family=Newsreader:opsz,wght@6..72,400;6..72,600;6..72,700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/stile.css">
</head>
<body>
<div class="util"><div class="wrap">
  <span id="today"></span>
  <nav aria-label="Servizio"><a href="/chi-siamo/">Chi siamo</a><a href="/contatti/">Contatti</a><a href="/pubblicita/">Pubblicità</a></nav>
</div></div>
<div class="wrap">
  <header class="mast">
    <a class="logo" href="/" aria-label="Il Franco, prima pagina">
      <svg viewBox="0 0 68 76" aria-hidden="true"><path d="M0 76V0h14v12h13V0h14v12h13V0h14v76Z" fill="var(--accent)"/><text x="34" y="64" text-anchor="middle" font-family="Newsreader, Georgia, serif" font-weight="700" font-size="52" fill="var(--paper)">F</text></svg>
      <span><${o.path==="/"?"h1":"p"} class="name">Il Franco</${o.path==="/"?"h1":"p"}><small>Notizie da Castelfranco Emilia</small></span>
    </a>
  </header>
  <main>${o.main}</main>
</div>
<footer class="foot"><div class="wrap">
  <div><strong>Il Franco</strong><p>Le notizie di Castelfranco Emilia e delle frazioni: cronaca, Comune, eventi, sport e salute.</p></div>
  <div><h4>Il sito</h4><ul><li><a href="/">Prima pagina</a></li><li><a href="/archivio/">Archivio</a></li><li><a href="/chi-siamo/">Chi siamo</a></li><li><a href="/contatti/">Contatti e segnalazioni</a></li><li><a href="/pubblicita/">Pubblicità</a></li><li><a href="/feed.xml">Feed RSS</a></li></ul></div>
  <div><h4>Informazioni legali</h4><ul><li><a href="/privacy/">Privacy</a></li><li><a href="/cookie-policy/">Cookie</a></li><li><a href="/rettifiche/">Rettifiche e rimozioni</a></li></ul></div>
  <div><h4>Seguici</h4><ul><li><a href="https://www.facebook.com/profile.php?id=61596625792838" target="_blank" rel="noopener">Facebook</a></li></ul></div>
  <p class="legal">© ${new Date().getFullYear()} Il Franco. Sito di informazione locale. I testi sono originali; la riproduzione è consentita citando la fonte.</p>
</div></footer>
<script>document.getElementById("today").textContent=new Date().toLocaleDateString("it-IT",{weekday:"long",day:"numeric",month:"long",year:"numeric"});</script>
</body>
</html>
`;}
function write(p,c){const f=path.join(OUT,p);fs.mkdirSync(path.dirname(f),{recursive:true});fs.writeFileSync(f,c);}
fs.rmSync(OUT,{recursive:true,force:true});
const urls=[];
function pageOut(p,o,lastmod){write(p==="/"?"index.html":p+"index.html",shell(Object.assign({path:p},o)));urls.push([p,lastmod]);}
const HOME_DESC="Il Franco: le notizie di Castelfranco Emilia e delle frazioni. Cronaca, Comune, eventi, sport e salute, ogni giorno.";
// Prima pagina
{const l=all[0],side=all.slice(1,5),rest=all.slice(5,17);
 pageOut("/",{desc:HOME_DESC,main:nav("Tutte")+'<section class="top"><a class="lead" href="'+url(l)+'"><span class="eyebrow">'+esc(l.category)+'</span><h2>'+esc(l.title)+'</h2><p>'+esc(l.summary)+'</p><span class="meta">'+esc(fmt(l.date))+'</span>'+cover(l)+'</a><aside class="side"><h3>Ultime notizie</h3>'+side.map(a=>item(a,false)).join("")+ad("Questo spazio è libero")+'</aside></section>'+ad("La tua attività, davanti ai lettori di Castelfranco")+'<section class="rows">'+rest.map(a=>item(a,true)).join("")+'</section><p style="text-align:center;margin:26px 0 0"><a class="back" href="/archivio/">Tutte le notizie in archivio ('+all.length+') →</a></p>'},all[0].published||all[0].date);}
// Sezioni
cats.forEach(c=>{const list=all.filter(a=>a.category===c);
 pageOut("/sezione/"+slug(c)+"/",{title:c,desc:c+": tutte le notizie de Il Franco su Castelfranco Emilia e frazioni.",main:nav(c)+'<section class="prose"><h1 class="pt">'+esc(c)+'</h1>'+list.map(a=>item(a,true)).join("")+'</section>'},list[0].published||list[0].date);});
// Archivio
{let h='<section class="prose"><a class="back" href="/">← Torna alla prima pagina</a><h1 class="pt">Archivio</h1>',cur="";
 all.forEach(a=>{const k=a.date.slice(0,7);if(k!==cur){cur=k;const m=MESI[+k.slice(5)-1];h+='<h3>'+m.charAt(0).toUpperCase()+m.slice(1)+' '+k.slice(0,4)+'</h3>';}h+=item(a,false);});
 pageOut("/archivio/",{title:"Archivio",desc:"Tutte le notizie de Il Franco su Castelfranco Emilia, mese per mese.",main:h+'</section>'},all[0].published||all[0].date);}
// Articoli
all.forEach(a=>{
 const more=all.filter(x=>x.id!==a.id&&x.category===a.category).slice(0,3);
 const art={"@context":"https://schema.org","@type":"NewsArticle","mainEntityOfPage":BASE+url(a),"headline":a.title,"description":a.summary,"datePublished":iso(a),"dateModified":iso(a),"articleSection":a.category,"inLanguage":"it","articleBody":(a.body||[]).join("\n\n"),"image":BASE+"/condivisione.png","author":{"@type":"Organization","name":"Il Franco","url":BASE+"/"},"publisher":{"@type":"NewsMediaOrganization","name":"Il Franco","logo":{"@type":"ImageObject","url":BASE+"/condivisione.png"}},"contentLocation":{"@type":"Place","name":"Castelfranco Emilia"}};
 const crumbs={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Il Franco","item":BASE+"/"},{"@type":"ListItem","position":2,"name":a.category,"item":BASE+"/sezione/"+slug(a.category)+"/"},{"@type":"ListItem","position":3,"name":a.title}]};
 pageOut(url(a),{title:a.title,desc:a.summary,type:"article",extraHead:ld(art)+"\n"+ld(crumbs)+'\n<meta property="article:published_time" content="'+iso(a)+'">\n<meta property="article:section" content="'+esc(a.category)+'">',
  main:'<article class="full"><a class="back" href="/">← Torna alla prima pagina</a><a class="eyebrow" href="/sezione/'+slug(a.category)+'/">'+esc(a.category)+'</a><h1 class="pt">'+esc(a.title)+'</h1><p class="sum">'+esc(a.summary)+'</p><span class="meta">Il Franco · '+(a.archive?'Archivio · fatti del '+esc(fmt(a.date))+' · inserito il <time datetime="'+a.published+'">'+esc(fmt(a.published))+'</time>':'<time datetime="'+iso(a)+'">'+esc(fmt(a.date))+(a.time?' · ore '+esc(a.time):'')+'</time>')+'</span>'+cover(a)+'<div class="body">'+(a.body||[]).map(p=>'<p>'+esc(p)+'</p>').join("")+'</div>'+(a.source?'<p class="meta">Fonte: <a href="'+esc(safeUrl(a.sourceUrl))+'" target="_blank" rel="noopener">'+esc(a.source)+'</a></p>':'')+ad("Il tuo annuncio qui")+(more.length?'<section><h2 class="eyebrow" style="color:var(--muted);margin:8px 0 0;font-size:12px">Leggi anche</h2>'+more.map(x=>item(x,false)).join("")+'</section>':'')+'</article>'},a.published||a.date);
});
// Pagine fisse
Object.keys(PAGES).forEach(k=>{const p=PAGES[k];const body=p[1].replace(/href="#([a-z-]+)"/g,'href="/$1/"');
 pageOut("/"+k+"/",{title:p[0],desc:p[0]+" – Il Franco, notizie da Castelfranco Emilia.",main:'<section class="prose"><a class="back" href="/">← Torna alla prima pagina</a><h1 class="pt">'+p[0]+'</h1><div style="border-top:1px solid var(--line);margin-top:14px;padding-top:16px">'+body+'</div></section>'},"2026-11-11");});
// 404
write("404.html",shell({path:"/",title:"Pagina non trovata",desc:"Pagina non trovata.",main:'<section class="prose"><h1 class="pt">Pagina non trovata</h1><p>La pagina che cerchi non esiste o è stata spostata.</p><p><a href="/">Vai alla prima pagina</a> oppure cerca nell\'<a href="/archivio/">archivio</a>.</p></section>',extraHead:'<meta name="robots" content="noindex">'}));
// CSS e risorse
write("stile.css",css+"\n.mast .name{font-weight:700;font-size:clamp(38px,7vw,62px);line-height:.95;margin:0;letter-spacing:-.01em}\nh1.pt{font-weight:700;font-size:clamp(30px,5vw,44px);line-height:1.07;margin:0;text-wrap:balance}\nnav.cats a{text-decoration:none}\n");
write("icona.svg",'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -2 80 80"><path d="M0 76V0h14v12h13V0h14v12h13V0h14v76Z" fill="#b3121d"/><text x="34" y="64" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="52" fill="#fff">F</text></svg>');
const png=path.join(__dirname,"..","logo","profilo-quadrato-rosso-1080.png");if(fs.existsSync(png))fs.copyFileSync(png,path.join(OUT,"condivisione.png"));
write("CNAME","ilfranco.com\n");write(".nojekyll","");
write("robots.txt","User-agent: *\nAllow: /\n\nSitemap: "+BASE+"/sitemap.xml\n");
write("sitemap.xml",'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls.map(u=>'<url><loc>'+BASE+u[0]+'</loc><lastmod>'+u[1]+'</lastmod></url>').join("\n")+'\n</urlset>\n');
const feed=all.slice().sort((a,b)=>iso(b).localeCompare(iso(a))||b.date.localeCompare(a.date)).filter(a=>!a.archive).slice(0,30);
write("feed.xml",'<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Il Franco</title><link>'+BASE+'/</link><description>Notizie da Castelfranco Emilia</description><language>it</language><atom:link href="'+BASE+'/feed.xml" rel="self" type="application/rss+xml"/>\n'+feed.map(a=>'<item><title>'+esc(a.title)+'</title><link>'+BASE+url(a)+'</link><guid isPermaLink="true">'+BASE+url(a)+'</guid><pubDate>'+new Date(iso(a)).toUTCString()+'</pubDate><category>'+esc(a.category)+'</category><description>'+esc(a.summary)+'</description></item>').join("\n")+'\n</channel></rss>\n');
console.log("pagine:",urls.length,"articoli:",all.length);
