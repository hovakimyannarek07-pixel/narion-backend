(()=>{
let publicConfig={whatsapp_number:'',yandex_maps_api_key:''};

function cleanBrand(){
 document.querySelectorAll('.brand-word,.footer-brand-name,.sell-signature').forEach(el=>el.remove());
 document.querySelectorAll('.brand-logo').forEach(box=>{const imgs=[...box.querySelectorAll('img')];imgs.slice(1).forEach(img=>img.remove())});
 document.querySelectorAll('.footer-logo').forEach(box=>{const imgs=[...box.querySelectorAll('img')];imgs.slice(1).forEach(img=>img.remove())});
}

function polish(){
 cleanBrand();
 const activeLang=document.querySelector('.langs button.active')?.dataset.lang||'hy';
 const copy={
  hy:['NARION COLLECTION','Ընտրեք ձեր գույքը','Որոնեք ըստ վայրի, տեսակի և գնի։'],
  ru:['NARION COLLECTION','Выберите свой объект','Фильтруйте по локации, типу и цене.'],
  en:['NARION COLLECTION','Find your property','Filter by location, type and price.']
 }[activeLang]||[];
 const e=document.querySelector('.lux-eyebrow'),h=document.querySelector('.lux-heading h2'),p=document.querySelector('.lux-heading p');
 if(e)e.textContent=copy[0];if(h)h.textContent=copy[1];if(p)p.textContent=copy[2];
 document.querySelectorAll('.lux-empty span').forEach(n=>{if(n.textContent.trim()==='N'){const i=document.createElement('img');i.src='/narion-logo.png';i.alt='Narion';n.replaceWith(i)}});
}

function addCinematicTone(){
 const hero=document.querySelector('.hero');
 if(!hero||hero.querySelector('.narion-video-tone'))return;
 const tone=document.createElement('div');
 tone.className='narion-video-tone';
 const video=hero.querySelector('.hero-video');
 if(video)video.insertAdjacentElement('afterend',tone);
}

const detailCopy={
 hy:{about:'Գույքի մասին',details:'Հիմնական տվյալներ',features:'Առանձնահատկություններ',video:'Տեսանյութ',location:'Գտնվելու վայրը',viewing:'Ամրագրել դիտում',whatsapp:'Գրել WhatsApp',ref:'Հայտարարություն',area:'Մակերես',rooms:'Սենյակներ',beds:'Ննջարաններ',baths:'Սանհանգույցներ',floor:'Հարկ',type:'Տեսակ',parking:'Կայանատեղի',furnished:'Կահավորված',balcony:'Պատշգամբ',terrace:'Տեռաս',pool:'Լողավազան',elevator:'Վերելակ',security:'Անվտանգություն',renovated:'Վերանորոգված'},
 ru:{about:'Об объекте',details:'Основные параметры',features:'Особенности',video:'Видео',location:'Расположение',viewing:'Записаться на просмотр',whatsapp:'Написать в WhatsApp',ref:'Объект',area:'Площадь',rooms:'Комнаты',beds:'Спальни',baths:'Санузлы',floor:'Этаж',type:'Тип',parking:'Парковка',furnished:'Меблирован',balcony:'Балкон',terrace:'Терраса',pool:'Бассейн',elevator:'Лифт',security:'Охрана',renovated:'Ремонт'},
 en:{about:'About the property',details:'Key details',features:'Features',video:'Video',location:'Location',viewing:'Book a viewing',whatsapp:'WhatsApp',ref:'Listing',area:'Area',rooms:'Rooms',beds:'Bedrooms',baths:'Bathrooms',floor:'Floor',type:'Type',parking:'Parking',furnished:'Furnished',balcony:'Balcony',terrace:'Terrace',pool:'Pool',elevator:'Elevator',security:'Security',renovated:'Renovated'}
};

function dc(){try{return detailCopy[lang]||detailCopy.en}catch{return detailCopy.en}}
function has(v){return v!==null&&v!==undefined&&v!==''}
function spec(icon,label,value){return has(value)?`<div class="np-spec"><span>${icon}</span><div><small>${esc(label)}</small><b>${esc(value)}</b></div></div>`:''}
function feature(label){return `<span class="np-feature">${esc(label)}</span>`}

async function premiumOpenProperty(id){
 const modal=document.querySelector('#detailModal');
 if(!modal)return;
 modal.classList.add('open');
 const host=document.querySelector('#detailContent');
 host.innerHTML='<div class="np-loading">NARION</div>';
 try{
  const r=await fetch(`${API}/api/properties/${id}/?_=${Date.now()}`,{cache:'no-store'});
  if(!r.ok)throw Error(r.status);
  const p=await r.json();
  const c=dc();
  const imgs=(p.images||[]).map(x=>mediaUrl(x.image)).filter(Boolean);
  const main=imgs[0]||'';
  const district=p.district?.name||p.district_name||'';
  const city=p.district?.city_name||p.city_name||'';
  const address=[district,city,p.address].filter(Boolean).join(' · ');
  const title=titleOf(p);
  const features=[];
  if(p.has_parking)features.push(feature(c.parking));
  if(p.is_furnished)features.push(feature(c.furnished));
  if(p.has_balcony)features.push(feature(c.balcony));
  if(p.has_terrace)features.push(feature(c.terrace));
  if(p.has_pool)features.push(feature(c.pool));
  if(p.has_elevator)features.push(feature(c.elevator));
  if(p.has_security)features.push(feature(c.security));
  if(p.is_renovated)features.push(feature(c.renovated));
  const specs=[
   spec('↗',c.area,p.area_sqm?`${p.area_sqm} m²`:''),
   spec('◫',c.rooms,p.rooms),
   spec('▱',c.beds,p.bedrooms),
   spec('○',c.baths,p.bathrooms),
   spec('⌂',c.floor,p.floor?`${p.floor}${p.total_floors?` / ${p.total_floors}`:''}`:''),
   spec('◇',c.type,p.property_type)
  ].join('');
  const thumbHtml=imgs.slice(1,6).map((x,i)=>`<button class="np-thumb" data-img="${esc(x)}" aria-label="Image ${i+2}"><img src="${esc(x)}" alt=""></button>`).join('');
  const videoHtml=(p.videos||[]).map(v=>mediaUrl(v.video)).filter(Boolean).slice(0,2).map(src=>`<video class="np-video" controls playsinline preload="metadata" src="${esc(src)}"></video>`).join('');
  const waNumber=publicConfig.whatsapp_number||'';
  const wa=waNumber?`<a class="np-whatsapp" target="_blank" rel="noopener" href="https://wa.me/${waNumber}?text=${encodeURIComponent(title)}">${esc(c.whatsapp)}</a>`:'';
  host.innerHTML=`
   <article class="narion-property">
    <section class="np-gallery">
     <div class="np-main">${main?`<img id="npMainImage" src="${esc(main)}" alt="${esc(title)}">`:`<div class="np-fallback"><img src="/narion-logo.png" alt="Narion"></div>`}</div>
     ${thumbHtml?`<div class="np-thumbs">${thumbHtml}</div>`:''}
    </section>
    <section class="np-shell">
     <main class="np-content">
      <div class="np-eyebrow">NARION · ${esc(c.ref)} #${Number(p.id)||''}</div>
      <h1>${esc(title)}</h1>
      <div class="np-location">${esc(address)}</div>
      <div class="np-price">${esc(money(p))}</div>
      <div class="np-specs">${specs}</div>
      ${descOf(p)?`<section class="np-section"><h2>${esc(c.about)}</h2><p class="np-description">${esc(descOf(p))}</p></section>`:''}
      ${features.length?`<section class="np-section"><h2>${esc(c.features)}</h2><div class="np-features">${features.join('')}</div></section>`:''}
      ${videoHtml?`<section class="np-section np-video-section"><div><span>NARION FILM</span><h2>${esc(c.video)}</h2></div>${videoHtml}</section>`:''}
      ${address?`<section class="np-section"><h2>${esc(c.location)}</h2><div class="np-address-card"><span>⌖</span><div><b>${esc(address)}</b><small>${esc(title)}</small></div></div></section>`:''}
     </main>
     <aside class="np-contact">
      <div class="np-contact-inner">
       <span class="np-contact-kicker">NARION PRIVATE VIEWING</span>
       <h3>${esc(c.viewing)}</h3>
       <div class="np-contact-price">${esc(money(p))}</div>
       <form id="inquiryForm">
        <div class="field"><label>${tr('name')}</label><input id="inqName" required></div>
        <div class="field"><label>${tr('phone')}</label><input id="inqPhone" required></div>
        <div class="field"><label>Email</label><input id="inqEmail" type="email"></div>
        <div class="field"><label>${tr('message')}</label><textarea id="inqMsg"></textarea></div>
        <button class="np-submit">${esc(c.viewing)}</button>
        ${wa}
        <div class="form-msg" id="inqStatus"></div>
       </form>
      </div>
     </aside>
    </section>
   </article>`;
  const form=document.querySelector('#inquiryForm');
  if(form)form.onsubmit=e=>sendInquiry(e,p.id);
  document.querySelectorAll('.np-thumb').forEach(btn=>btn.onclick=()=>{const img=document.querySelector('#npMainImage');if(img){img.style.opacity='.15';setTimeout(()=>{img.src=btn.dataset.img;img.style.opacity='1'},120)}});
 }catch{
  host.innerHTML=`<div class="np-error">${tr('loadingError')}</div>`;
 }
}

window.openProperty=premiumOpenProperty;

function loadYandexScript(key){
 return new Promise((resolve,reject)=>{
  if(window.ymaps)return resolve();
  const existing=document.querySelector('script[data-narion-yandex]');
  if(existing){existing.addEventListener('load',resolve,{once:true});existing.addEventListener('error',reject,{once:true});return}
  const s=document.createElement('script');
  s.dataset.narionYandex='1';
  s.src=`https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(key)}&lang=ru_RU`;
  s.onload=resolve;s.onerror=reject;document.head.appendChild(s);
 });
}

async function setupYandexMap(key){
 if(!key||!document.getElementById('map'))return;
 try{
  await loadYandexScript(key);
  await new Promise(resolve=>window.ymaps.ready(resolve));
  try{if(map&&typeof map.remove==='function')map.remove()}catch{}
  const host=document.getElementById('map');
  host.innerHTML='';
  const ymap=new ymaps.Map('map',{center:[40.1772,44.5035],zoom:11,type:'yandex#hybrid',controls:['zoomControl','geolocationControl']},{suppressMapOpenBlock:true});
  window.narionYandexMap=ymap;
  const response=await fetch(`${API}/api/properties/map/?_=${Date.now()}`,{cache:'no-store'});
  const points=await response.json();
  const svg=`data:image/svg+xml;charset=UTF-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="42" height="52" viewBox="0 0 42 52"><defs><filter id="s" x="-30%" y="-20%" width="160%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="2.3" flood-color="#000" flood-opacity=".32"/></filter></defs><path filter="url(#s)" d="M21 1C10.5 1 2 9.4 2 19.8C2 34.3 21 50 21 50s19-15.7 19-30.2C40 9.4 31.5 1 21 1Z" fill="#050505" stroke="#fff" stroke-width="2"/><circle cx="21" cy="20" r="12.5" fill="#fff"/><svg x="12.5" y="10.5" width="17" height="20" viewBox="0 0 360 440" preserveAspectRatio="xMidYMid meet"><polygon points="39,57 316,338 316,56" fill="#000"/><polygon points="22,121 22,359 259,359" fill="#000"/></svg></svg>')}`;
  (Array.isArray(points)?points:[]).forEach(p=>{
   const lat=Number(p.latitude),lng=Number(p.longitude);
   if(!Number.isFinite(lat)||!Number.isFinite(lng))return;
   const marker=new ymaps.Placemark([lat,lng],{
    balloonContentHeader:esc(titleOf(p)),
    balloonContentBody:`<div style="font:500 13px Inter,sans-serif"><b>${esc(money(p))}</b><br><button onclick="openProperty(${Number(p.id)})" style="margin-top:10px;border:0;border-radius:999px;padding:8px 12px;background:#0b0b0c;color:#fff;cursor:pointer">${esc(tr('view'))}</button></div>`,
    hintContent:esc(titleOf(p))
   },{iconLayout:'default#image',iconImageHref:svg,iconImageSize:[42,52],iconImageOffset:[-21,-50]});
   ymap.geoObjects.add(marker);
  });
  // Keep the initial city-wide view. Visitors can zoom in themselves to inspect streets and nearby infrastructure.
 }catch(err){console.warn('Narion Yandex map unavailable',err)}
}

async function loadPublicConfig(){
 try{
  const r=await fetch(`${API}/api/public-config/?_=${Date.now()}`,{cache:'no-store'});
  if(!r.ok)return;
  publicConfig=Object.assign(publicConfig,await r.json());
  if(publicConfig.yandex_maps_api_key)setupYandexMap(publicConfig.yandex_maps_api_key);
 }catch{}
}

const style=document.createElement('style');
style.textContent=`
.editorial-mark,.brand-word,.footer-brand-name,.sell-signature{display:none!important}
.brand-logo,.footer-logo{display:flex!important;align-items:center!important}
.brand-logo img,.footer-logo img{width:156px!important;max-width:156px!important;height:auto!important;object-fit:contain!important}
.lux-empty img{width:150px;max-width:42%;opacity:.8}
.lux-heading p{max-width:380px!important}
.lux-heading{margin-bottom:32px!important}
.hero-copy h1{font-size:clamp(46px,5.2vw,76px)!important;line-height:.98!important;max-width:820px!important;letter-spacing:-.045em!important}
.hero-video{animation:narionCinematicVideo 22s ease-in-out infinite!important;will-change:filter,transform}
.narion-video-tone{position:absolute;inset:0;pointer-events:none;z-index:1;background:linear-gradient(115deg,rgba(2,10,24,.38),rgba(5,24,48,.14) 55%,rgba(0,0,0,.08));mix-blend-mode:multiply;animation:narionCinematicTone 22s ease-in-out infinite}
@keyframes narionCinematicVideo{0%,18%,100%{filter:grayscale(1) contrast(1.08) brightness(.72) saturate(.55);transform:scale(1.018)}42%,62%{filter:grayscale(0) contrast(1.04) brightness(.84) saturate(1.08);transform:scale(1.005)}78%{filter:grayscale(.82) contrast(1.07) brightness(.74) saturate(.68);transform:scale(1.014)}}
@keyframes narionCinematicTone{0%,18%,100%{opacity:.85}42%,62%{opacity:.18}78%{opacity:.62}}
#detailModal{background:rgba(0,0,0,.82)!important;backdrop-filter:blur(14px)}
#detailModal .sheet{width:min(1500px,96vw)!important;max-width:none!important;height:min(94vh,1120px)!important;max-height:94vh!important;padding:0!important;border-radius:24px!important;overflow:auto!important;background:#f4f2ed!important;color:#111!important}
#detailModal>.sheet>.close{position:sticky!important;top:18px!important;float:right!important;margin:18px 18px -58px 0!important;width:44px!important;height:44px!important;border-radius:50%!important;background:rgba(255,255,255,.92)!important;color:#111!important;z-index:30!important;box-shadow:0 8px 24px rgba(0,0,0,.14)!important}
.np-loading,.np-error{min-height:60vh;display:grid;place-items:center;font:600 13px Inter,sans-serif;letter-spacing:.28em;color:#7b6a47}
.narion-property{background:#f4f2ed}
.np-gallery{background:#090909;padding:12px;display:grid;grid-template-columns:minmax(0,1fr) 180px;gap:10px;min-height:56vh}
.np-main{border-radius:17px;overflow:hidden;background:#111;min-height:560px}
.np-main>img{width:100%;height:100%;object-fit:cover;display:block;transition:opacity .18s ease}
.np-fallback{height:100%;display:grid;place-items:center}.np-fallback img{width:180px;opacity:.55}
.np-thumbs{display:grid;grid-template-rows:repeat(5,minmax(0,1fr));gap:10px;min-height:0}
.np-thumb{padding:0;border:0;border-radius:13px;overflow:hidden;background:#111;cursor:pointer;min-height:0}.np-thumb img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .35s ease}.np-thumb:hover img{transform:scale(1.04)}
.np-shell{display:grid;grid-template-columns:minmax(0,1fr) 390px;gap:64px;padding:58px 64px 76px}
.np-content{min-width:0}.np-eyebrow{font:600 10px Inter,sans-serif;letter-spacing:.22em;color:#95773f;margin-bottom:16px}.np-content>h1{font:600 clamp(38px,4.5vw,68px)/.98 "Space Grotesk",Inter,sans-serif;letter-spacing:-.055em;margin:0;max-width:900px}.np-location{font-size:15px;color:#707074;margin-top:18px}.np-price{font:600 clamp(28px,3vw,42px)/1 "Space Grotesk",Inter,sans-serif;margin-top:30px}.np-specs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:38px}.np-spec{background:#fff;border:1px solid #e1ded6;border-radius:14px;padding:16px;display:flex;gap:12px;align-items:center}.np-spec>span{font-size:18px;color:#99783a}.np-spec small{display:block;font-size:10px;letter-spacing:.07em;text-transform:uppercase;color:#8a8883}.np-spec b{display:block;margin-top:5px;font-size:15px}.np-section{padding-top:48px;margin-top:48px;border-top:1px solid #d9d5cc}.np-section h2{font:600 26px/1.1 "Space Grotesk",Inter,sans-serif;letter-spacing:-.035em;margin:0 0 22px}.np-description{font-size:17px;line-height:1.78;color:#49494d;white-space:pre-line;max-width:840px}.np-features{display:flex;flex-wrap:wrap;gap:9px}.np-feature{background:#0d0d0e;color:white;padding:10px 14px;border-radius:999px;font-size:12px}.np-video-section>div>span{font-size:9px;letter-spacing:.22em;color:#9d7e45}.np-video{width:100%;display:block;background:#050505;border-radius:18px;margin-top:16px;max-height:650px}.np-address-card{display:flex;align-items:center;gap:16px;background:#fff;border:1px solid #e1ded6;padding:20px;border-radius:16px}.np-address-card>span{font-size:28px}.np-address-card b{display:block}.np-address-card small{display:block;margin-top:5px;color:#777}
.np-contact{position:relative}.np-contact-inner{position:sticky;top:28px;background:#0b0b0c;color:#fff;border-radius:20px;padding:28px;box-shadow:0 24px 60px rgba(0,0,0,.12)}.np-contact-kicker{font-size:9px;letter-spacing:.2em;color:#c4a86f}.np-contact h3{font:600 27px/1.08 "Space Grotesk",Inter,sans-serif;margin:12px 0 0}.np-contact-price{font-size:20px;margin:14px 0 24px;color:#d2bd91}.np-contact .field{display:grid;gap:7px;margin-bottom:12px}.np-contact label{font-size:10px;letter-spacing:.06em;text-transform:uppercase;color:#9b9b9f}.np-contact input,.np-contact textarea{width:100%;box-sizing:border-box;background:#171719;border:1px solid #2c2c2e;color:#fff;border-radius:11px;padding:12px 13px;outline:none}.np-contact textarea{min-height:92px;resize:vertical}.np-contact input:focus,.np-contact textarea:focus{border-color:#8d7444}.np-submit,.np-whatsapp{width:100%;box-sizing:border-box;min-height:48px;border-radius:999px;border:0;display:grid;place-items:center;font:600 13px Inter,sans-serif;text-decoration:none;cursor:pointer}.np-submit{background:#fff;color:#0b0b0c;margin-top:8px}.np-whatsapp{background:#1c1c1e;color:#fff;border:1px solid #343436;margin-top:9px}.np-contact .form-msg{font-size:12px;margin-top:10px;color:#d6c49e}
#map .ymaps-2-1-79-map,#map .ymaps-2-1-79-inner-panes{border-radius:22px!important;overflow:hidden!important}
@media(max-width:900px){.hero-copy h1{font-size:clamp(40px,10vw,58px)!important;max-width:620px!important}.np-gallery{grid-template-columns:1fr;min-height:auto}.np-main{min-height:52vh}.np-thumbs{grid-template-columns:repeat(4,1fr);grid-template-rows:none}.np-thumb{aspect-ratio:1.25}.np-thumb:nth-child(n+5){display:none}.np-shell{grid-template-columns:1fr;padding:38px 22px 54px;gap:32px}.np-content>h1{font-size:clamp(35px,9vw,50px)}.np-specs{grid-template-columns:repeat(2,1fr)}.np-contact-inner{position:relative;top:auto}.np-description{font-size:16px;line-height:1.7}}
@media(max-width:760px){.brand-logo img,.footer-logo img{width:128px!important;max-width:128px!important}.hero-copy h1{font-size:clamp(38px,10.4vw,52px)!important;line-height:1.01!important;letter-spacing:-.035em!important}.np-main{min-height:46vh}.np-shell{padding:32px 18px 48px}.np-specs{grid-template-columns:1fr 1fr}.np-gallery{padding:8px}.np-thumbs{gap:7px}}
`;
document.head.appendChild(style);
addCinematicTone();
loadPublicConfig();
polish();setTimeout(polish,120);setTimeout(polish,500);
document.querySelectorAll('.langs button').forEach(b=>b.addEventListener('click',()=>setTimeout(polish,60)));
const bodyObserver=new MutationObserver(()=>requestAnimationFrame(cleanBrand));bodyObserver.observe(document.body,{childList:true,subtree:true});
const s=document.getElementById('listings');if(s)new MutationObserver(()=>requestAnimationFrame(polish)).observe(s,{childList:true,subtree:true});
})();