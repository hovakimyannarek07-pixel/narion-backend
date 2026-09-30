(()=>{
const HY={
  buy:'Գնել',rent:'Վարձակալել',map:'Քարտեզ',login:'Մուտք',list:'Վաճառել գույքը',
  eyebrow:'NARION · ԱՆՇԱՐԺ ԳՈՒՅՔ ՀԱՅԱՍՏԱՆՈՒՄ',
  heroTitle:'Փնտրեք, գտեք և դարձրեք այն ձերը',
  heroSub:'Ընտրեք գույքը, համեմատեք գինը և ամրագրեք դիտում։',
  explore:'Դիտել գույքերը',sellProperty:'Վաճառել գույքը',search:'Փնտրել',searchPh:'Թաղամաս, հասցե կամ գույք',apartments:'Բնակարաններ',discover:'ԳՈՒՅՔԵՐ',
  catalog:'Գույքեր',catalogTitle:'Ընտրված գույքեր',catalogSub:'Գներ, լուսանկարներ և հիմնական տվյալներ՝ մեկ տեղում։',all:'Բոլորը',newbuild:'Նորակառույց',
  mapTitle:'Գույքերը քարտեզի վրա',mapSub:'Տեսեք գույքի դիրքը և շրջակայքը։',
  owners:'ՍԵՓԱԿԱՆԱՏԵՐԵՐԻՆ',sellTitle:'Վաճառո՞ւմ եք գույք։',sellSub:'Ուղարկեք տվյալները։ Մենք կկապվենք ձեզ հետ։',start:'Ուղարկել տվյալները',footer:'Անշարժ գույք Հայաստանում։',
  account:'Narion հաշիվ',register:'Գրանցվել',name:'Անուն',password:'Գաղտնաբառ',sellerTitle:'Վաճառել գույքը',sellerText:'Նշեք կոնտակտները և գույքի հիմնական տվյալները։',view:'Դիտել',request:'Ամրագրել դիտում',send:'Ուղարկել',phone:'Հեռախոս',message:'Հաղորդագրություն',description:'Նկարագրություն',noObjects:'Այս ֆիլտրերով գույք չի գտնվել։',loadingError:'Գույքերի տվյալները հիմա հասանելի չեն։',logout:'Դուրս գալ',sent:'Հայտն ուղարկված է ✓',sellerSent:'Տվյալներն ուղարկված են ✓'
};
const CAT={
  eyebrow:'NARION COLLECTION',title:'Ընտրված գույքեր',sub:'Ֆիլտրեք ըստ վայրի, տեսակի, գնի և ննջարանների։',
  all:'Բոլորը',sale:'Գնել',rent:'Վարձակալել',primary:'Նորակառույցներ',location:'Վայր',type:'Տեսակ',from:'Գին՝ $-ից',to:'Մինչև $',beds:'Ննջարաններ',any:'Ցանկացած',reset:'Մաքրել',
  locationAll:'Բոլոր վայրերը',typeAll:'Բոլոր տեսակները',villa:'Վիլլաներ',penthouse:'Պենտհաուսներ',apartment:'Բնակարաններ',townhouse:'Թաունհաուսներ',viewing:'Ամրագրել դիտում',empty:'Այս ֆիլտրերով գույք չի գտնվել։',approx:'Մոտավոր փոխարժեք'
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
  setText(q('.lux-resultbar small'),'USD / AMD · '+CAT.approx);
  document.querySelectorAll('.lux-viewing').forEach(b=>{const html=CAT.viewing+'<span>↗</span>';if(b.innerHTML!==html)b.innerHTML=html});
  document.querySelectorAll('.lux-fav').forEach(b=>b.setAttribute('aria-label','Պահպանել'));
  setText(q('.lux-empty p'),CAT.empty);
}
function apply(){patchGlobals();patchStatic();patchCatalog()}
setTimeout(apply,0);setTimeout(apply,120);
document.querySelectorAll('.langs button').forEach(btn=>btn.addEventListener('click',()=>setTimeout(apply,30)));
const target=document.getElementById('listings');if(target){let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;patchCatalog()})}).observe(target,{childList:true,subtree:true,characterData:true})}
})();