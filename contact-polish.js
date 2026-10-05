(()=>{
let cfg={phone_number:'',whatsapp_number:''};
let loading=false;

async function loadCfg(){
 if(loading)return;
 loading=true;
 try{
  const r=await fetch('https://narion-backend.onrender.com/api/public-config/?_='+Date.now(),{cache:'no-store'});
  if(r.ok)cfg=Object.assign(cfg,await r.json());
 }catch{}
 loading=false;
 enhance();
}

function labels(){
 const l=document.querySelector('.langs button.active')?.dataset.lang||'hy';
 if(l==='ru')return{call:'Позвонить',wa:'WhatsApp'};
 if(l==='en')return{call:'Call',wa:'WhatsApp'};
 return{call:'Զանգահարել',wa:'WhatsApp'};
}

function enhance(){
 const form=document.querySelector('#detailModal #inquiryForm');
 if(!form||form.querySelector('.narion-direct-actions'))return;
 const {call,wa}=labels();
 const wrap=document.createElement('div');
 wrap.className='narion-direct-actions';
 if(cfg.phone_number){
  const a=document.createElement('a');
  a.className='narion-call-action';
  a.href='tel:'+cfg.phone_number;
  a.innerHTML='<span>☎</span><b>'+call+'</b><small>'+cfg.phone_number+'</small>';
  wrap.appendChild(a);
 }
 if(cfg.whatsapp_number){
  const title=document.querySelector('.np-content>h1')?.textContent?.trim()||'Narion';
  const a=document.createElement('a');
  a.className='narion-wa-action';
  a.target='_blank';a.rel='noopener';
  a.href='https://wa.me/'+cfg.whatsapp_number+'?text='+encodeURIComponent(title);
  const shown=cfg.whatsapp_number==='37499606644'?'+374 99 606 644':('+'+cfg.whatsapp_number);
  a.innerHTML='<span>◉</span><b>'+wa+'</b><small>'+shown+'</small>';
  wrap.appendChild(a);
 }
 if(wrap.children.length)form.appendChild(wrap);
}

const style=document.createElement('style');
style.textContent=`
.narion-direct-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:10px}
.narion-direct-actions a{min-height:54px;border-radius:14px;display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;align-items:center;column-gap:9px;padding:10px 12px;text-decoration:none!important;font-family:Inter,sans-serif}
.narion-direct-actions a>span{grid-row:1/3;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-size:13px}
.narion-direct-actions a>b{font-size:12px;line-height:1.15}.narion-direct-actions a>small{font-size:9px;opacity:.66;margin-top:2px;white-space:nowrap}
.narion-call-action{background:#f0ede6;color:#111!important;border:1px solid #ded8cc}.narion-call-action>span{background:#111;color:#fff}
.narion-wa-action{background:#111;color:#fff!important;border:1px solid #111}.narion-wa-action>span{background:#fff;color:#111}
@media(max-width:620px){.narion-direct-actions{grid-template-columns:1fr}}
`;
document.head.appendChild(style);

const host=document.getElementById('detailContent');
if(host)new MutationObserver(()=>requestAnimationFrame(enhance)).observe(host,{childList:true,subtree:true});
document.querySelectorAll('.langs button').forEach(b=>b.addEventListener('click',()=>setTimeout(enhance,100)));
loadCfg();
})();
