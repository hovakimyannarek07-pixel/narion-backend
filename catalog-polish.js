(()=>{
function cleanBrand(){
 document.querySelectorAll('.brand-word,.footer-brand-name,.sell-signature').forEach(el=>el.remove());
 document.querySelectorAll('.brand-logo').forEach(box=>{const imgs=[...box.querySelectorAll('img')];imgs.slice(1).forEach(img=>img.remove())});
 document.querySelectorAll('.footer-logo').forEach(box=>{const imgs=[...box.querySelectorAll('img')];imgs.slice(1).forEach(img=>img.remove())});
}
function polish(){
 cleanBrand();
 const lang=document.querySelector('.langs button.active')?.dataset.lang||'hy';
 const copy={
  hy:['NARION COLLECTION','Ընտրեք ձեր գույքը','Որոնեք ըստ վայրի, տեսակի և գնի։'],
  ru:['NARION COLLECTION','Выберите свой объект','Фильтруйте по локации, типу и цене.'],
  en:['NARION COLLECTION','Find your property','Filter by location, type and price.']
 }[lang]||[];
 const e=document.querySelector('.lux-eyebrow'),h=document.querySelector('.lux-heading h2'),p=document.querySelector('.lux-heading p');
 if(e)e.textContent=copy[0];if(h)h.textContent=copy[1];if(p)p.textContent=copy[2];
 document.querySelectorAll('.lux-empty span').forEach(n=>{if(n.textContent.trim()==='N'){const i=document.createElement('img');i.src='/narion-logo.png';i.alt='Narion';n.replaceWith(i)}});
}
const style=document.createElement('style');
style.textContent=`
.editorial-mark,.brand-word,.footer-brand-name,.sell-signature{display:none!important}
.brand-logo,.footer-logo{display:flex!important;align-items:center!important}
.brand-logo img,.footer-logo img{width:156px!important;max-width:156px!important;height:auto!important;object-fit:contain!important}
.lux-empty img{width:150px;max-width:42%;opacity:.8}
.lux-heading p{max-width:380px!important}
.lux-heading{margin-bottom:32px!important}
@media(max-width:760px){.brand-logo img,.footer-logo img{width:128px!important;max-width:128px!important}}
`;
document.head.appendChild(style);
polish();setTimeout(polish,120);setTimeout(polish,500);
document.querySelectorAll('.langs button').forEach(b=>b.addEventListener('click',()=>setTimeout(polish,60)));
const bodyObserver=new MutationObserver(()=>requestAnimationFrame(cleanBrand));bodyObserver.observe(document.body,{childList:true,subtree:true});
const s=document.getElementById('listings');if(s)new MutationObserver(()=>requestAnimationFrame(polish)).observe(s,{childList:true,subtree:true});
})();