(()=>{
const HY={
  buy:'Գնել',rent:'Վարձակալել',approach:'Մեր մոտեցումը',map:'Քարտեզ',login:'Մուտք',list:'Վաճառել գույքը',
  eyebrow:'NARION · ԱՆՇԱՐԺ ԳՈՒՅՔ ՀԱՅԱՍՏԱՆՈՒՄ',heroTitle:'Փնտրեք, գտեք և դարձրեք այն ձերը',
  heroSub:'Ընտրված գույքեր, իրական լուսանկարներ և հստակ պայմաններ։ Narion-ը օգնում է ընտրել ու կազմակերպել դիտումը։',
  explore:'Դիտել գույքերը',sellProperty:'Վաճառել գույքը',search:'Փնտրել',searchPh:'Որտե՞ղ եք փնտրում գույք',apartments:'Բնակարաններ',
  privateService:'ԱՆՀԱՏԱԿԱՆ ՍՊԱՍԱՐԿՈՒՄ',proofTitle:'Ամեն ինչ՝ պարզ',proof1:'Իրական լուսանկարներ',proof2:'Գին և հիմնական տվյալներ',proof3:'Դիտման արագ հայտ',discover:'ՏԵՍՆԵԼ ԳՈՒՅՔԵՐԸ',
  promiseTitle:'Գույք ընտրելը պետք է լինի պարզ։',promiseText:'Մի տեղում տեսեք լուսանկարները, գինը, դիրքը և հիմնական պայմանները։',
  serviceBuy:'Գնել գույք',serviceBuyText:'Գտեք տուն կամ ներդրումային գույք։',serviceNew:'Նորակառույցներ',serviceNewText:'Դիտեք նոր նախագծերն ու առաջարկները։',serviceSell:'Վաճառել գույքը',serviceSellText:'Ուղարկեք տվյալները, և մենք կկապվենք ձեզ հետ։',
  catalog:'Գույքեր',catalogTitle:'Ընտրված գույքեր Հայաստանում',catalogSub:'Իրական լուսանկարներ, գներ և թարմ տվյալներ։',all:'Բոլորը',newbuild:'Նորակառույց',
  why:'Ինչու Narion',whyTitle:'Պարզ ընտրություն։ Հստակ քայլեր։',whyIntro:'Տեսեք կարևոր տվյալները և հեշտ կազմակերպեք դիտումը։',
  trust1t:'Իրական տվյալներ',trust1d:'Գինը, լուսանկարները և հիմնական բնութագրերը՝ մեկ տեղում։',trust2t:'Հեշտ համեմատություն',trust2d:'Համեմատեք ըստ գնի, դիրքի և չափերի։',trust3t:'Արագ կապ',trust3d:'Հավանեցի՞ք գույքը։ Ուղարկեք դիտման հայտ։',
  editorialTitle:'Տունը միայն հասցե չէ։ Այն ձեր միջավայրն է։',editorialText:'Narion-ը օգնում է գտնել ձեր նպատակներին համապատասխան գույք։',
  mapTitle:'Գույքերը քարտեզի վրա',mapSub:'Տեսեք, թե որտեղ է գտնվում յուրաքանչյուր գույք։',owners:'ՍԵՓԱԿԱՆԱՏԵՐԵՐԻՆ',sellTitle:'Վաճառո՞ւմ եք գույք։',sellSub:'Ուղարկեք հիմնական տվյալները։ Մենք կկապվենք և կքննարկենք հաջորդ քայլերը։',start:'Ուղարկել տվյալները',footer:'Անշարժ գույք Հայաստանում՝ պարզ և ժամանակակից ձևաչափով։',
  account:'Narion հաշիվ',register:'Գրանցվել',name:'Անուն',password:'Գաղտնաբառ',sellerTitle:'Վաճառել գույքը',sellerText:'Նշեք ձեր կոնտակտները և համառոտ նկարագրեք գույքը։',view:'Դիտել',request:'Դիտման հայտ',send:'Ուղարկել',phone:'Հեռախոս',message:'Հաղորդագրություն',description:'Նկարագրություն',noObjects:'Այս ֆիլտրերով գույք չի գտնվել։',loadingError:'Գույքերի տվյալները հիմա հասանելի չեն։',logout:'Դուրս գալ',sent:'Հայտն ուղարկված է ✓',sellerSent:'Տվյալներն ուղարկված են ✓'
};
const CAT={
  eyebrow:'NARION COLLECTION',title:'Ընտրված գույքեր',sub:'Ընտրեք վայրը, տեսակը և բյուջեն։',
  all:'Բոլորը',sale:'Գնել',rent:'Վարձակալել',primary:'Նորակառույցներ',location:'Վայր',type:'Տեսակ',from:'Գին՝ սկսած $',to:'Մինչև $',beds:'Ննջարաններ',any:'Ցանկացած',reset:'Մաքրել',locationAll:'Բոլոր վայրերը',typeAll:'Բոլոր տեսակները',villa:'Վիլլաներ',penthouse:'Պենտհաուսներ',apartment:'Բնակարաններ',townhouse:'Թաունհաուսներ',viewing:'Պայմանավորվել դիտման',empty:'Այս ֆիլտրերով գույք չի գտնվել։',approx:'Մոտավոր փոխարժեք'
};
const setText=(el,v)=>{if(el&&el.textContent!==v)el.textContent=v};
const isHy=()=>((document.querySelector('.langs button.active')?.dataset.lang)||document.documentElement.lang||'hy').toLowerCase().startsWith('hy');
function patchGlobals(){try{if(typeof T!=='undefined'&&T.hy)Object.assign(T.hy,HY)}catch(e){}}
function patchStatic(){if(!isHy())return;document.documentElement.lang='hy';document.querySelectorAll('[data-t]').forEach(el=>{const v=HY[el.dataset.t];if(v)setText(el,v)});document.querySelectorAll('[data-ph]').forEach(el=>{const v=HY[el.dataset.ph];if(v&&el.placeholder!==v)el.placeholder=v})}
function patchCatalog(){if(!isHy())return;const q=s=>document.querySelector(s);setText(q('.lux-eyebrow'),CAT.eyebrow);setText(q('.lux-heading h2'),CAT.title);setText(q('.lux-heading p'),CAT.sub);
  document.querySelectorAll('.lux-tab').forEach(b=>{const v=CAT[b.dataset.filter];if(v)setText(b,v)});
  const labels=[['luxLocation',CAT.location],['luxType',CAT.type],['luxMin',CAT.from],['luxMax',CAT.to],['luxBeds',CAT.beds]];labels.forEach(([id,v])=>setText(document.getElementById(id)?.closest('label')?.querySelector('span'),v));
  const loc=document.getElementById('luxLocation');if(loc&&loc.options[0])setText(loc.options[0],CAT.locationAll);
  const type=document.getElementById('luxType');if(type){const vals={all:CAT.typeAll,villa:CAT.villa,penthouse:CAT.penthouse,apartment:CAT.apartment,townhouse:CAT.townhouse};[...type.options].forEach(o=>{if(vals[o.value])setText(o,vals[o.value])})}
  const beds=document.getElementById('luxBeds');if(beds&&beds.options[0])setText(beds.options[0],CAT.any);
  const reset=document.getElementById('luxReset');if(reset)setText(reset,'↺ '+CAT.reset);
  const count=document.getElementById('luxCount');if(count){const m=count.textContent.match(/\d+/);if(m)setText(count,`Գտնվել է ${m[0]} գույք`)}
  setText(q('.lux-resultbar small'),'USD / AMD · '+CAT.approx);document.querySelectorAll('.lux-viewing').forEach(b=>{const html=CAT.viewing+'<span>↗</span>';if(b.innerHTML!==html)b.innerHTML=html});document.querySelectorAll('.lux-fav').forEach(b=>b.setAttribute('aria-label','Պահպանել'));setText(q('.lux-empty p'),CAT.empty);
}
function patchBrand(){const mark=document.querySelector('.editorial-mark');if(!mark)return;mark.classList.remove('editorial-mark');mark.classList.add('editorial-brand-logo');mark.innerHTML='<img src="/narion-logo.png" alt="Narion Real Estate">';if(!document.getElementById('narionBrandPatch')){const s=document.createElement('style');s.id='narionBrandPatch';s.textContent='.editorial-brand-logo{display:flex;align-items:flex-start;justify-content:flex-start}.editorial-brand-logo img{display:block;width:190px;max-width:100%;height:auto;object-fit:contain;filter:none}@media(max-width:760px){.editorial-brand-logo img{width:160px}}';document.head.appendChild(s)}}
function apply(){patchGlobals();patchStatic();patchCatalog();patchBrand()}
setTimeout(apply,0);setTimeout(apply,120);
document.querySelectorAll('.langs button').forEach(btn=>btn.addEventListener('click',()=>setTimeout(apply,30)));
const target=document.getElementById('listings');if(target){let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;patchCatalog()})}).observe(target,{childList:true,subtree:true,characterData:true})}
})();
