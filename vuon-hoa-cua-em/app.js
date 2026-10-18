(() => {
 'use strict';
 document.documentElement.classList.add('js');
 const $=id=>document.getElementById(id),content=window.GARDEN_CONTENT,flowers=window.LOVE_FLOWERS;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:760px)');
 const read=new Set(),focusReturn=new Map();
 let motion=!reduced.matches,manualMotion=false,currentFlower=0,currentPhoto=0,bed=0,petalTimer,toastTimer,letterTimer;
 let player=null,letterOpening=false,currentScreen='intro',filter='all';
 const sections={home:'garden',forest:'forest',memories:'memories',letter:'letter',wish:'wish'};
 const normalize=text=>text.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d');
 function toast(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').classList.add('visible');toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),3800);}
 function hearts(x,y,count=9){if(!motion)return;for(let i=0;i<count;i++){const e=document.createElement('span');e.className='spark-heart';e.textContent=i%3?'♡':'✧';e.style.left=x+(Math.random()-.5)*70+'px';e.style.top=y+(Math.random()-.5)*20+'px';e.style.setProperty('--drift',(Math.random()-.5)*100+'px');e.style.fontSize=11+Math.random()*15+'px';e.style.animationDelay=i*.035+'s';document.body.appendChild(e);setTimeout(()=>e.remove(),2400);}}
 function petal(){if(!motion||document.hidden||currentScreen==='intro')return;const e=document.createElement('span');e.className='petal';e.style.setProperty('--left',Math.random()*100+'%');e.style.setProperty('--drift',(Math.random()-.5)*220+'px');e.style.setProperty('--duration',13+Math.random()*7+'s');e.style.width=5+Math.random()*5+'px';e.style.height=8+Math.random()*7+'px';$('petalLayer').appendChild(e);setTimeout(()=>e.remove(),21000);}
 function setMotion(value){motion=value;document.documentElement.classList.toggle('motion-paused',!value);$('motionToggle').setAttribute('aria-pressed',String(value));$('motionToggle').querySelector('span').textContent=value?'Hiệu ứng bật':'Hiệu ứng tắt';Garden.setMotion(value);clearInterval(petalTimer);if(value)petalTimer=setInterval(petal,1800);else{$('petalLayer').replaceChildren();document.querySelectorAll('.spark-heart').forEach(e=>e.remove());}}
 $('motionToggle').addEventListener('click',()=>{manualMotion=true;setMotion(!motion);});
 reduced.addEventListener('change',()=>{if(!manualMotion)setMotion(!reduced.matches);});
 setMotion(motion);
 function setTime(value){document.documentElement.dataset.time=value;Garden.setTime(value);document.querySelectorAll('.time-switch button').forEach(e=>e.setAttribute('aria-pressed',String(e.dataset.time===value)));}
 document.querySelectorAll('.time-switch button').forEach(e=>e.addEventListener('click',()=>setTime(e.dataset.time)));
 function go(screen,historyMode='push'){
  if(screen!=='intro'&&!sections[screen])return;
  for(const dialog of document.querySelectorAll('dialog[open]'))dialog.close();
  currentScreen=screen;document.body.dataset.screen=screen;
  $('experience').inert=screen==='intro';document.querySelector('.site-header').inert=screen==='intro';
  for(const [key,id] of Object.entries(sections))$(id).hidden=screen!==(key==='home'&&screen==='intro'?'intro':key);
  if(screen==='intro')$('garden').hidden=false;
  $('intro').hidden=screen!=='intro';
  if(screen==='home'||screen==='intro')Garden.moveTo($('garden'),'home');
  else if(screen==='forest'){Garden.moveTo($('forestViewport'),'forest');renderBed();}
  document.querySelectorAll('.reveal').forEach(e=>e.classList.add('shown'));
  const active=screen==='intro'?$('garden'):$(sections[screen]);
  if(screen!=='intro'){active.classList.remove('screen-arriving');void active.offsetWidth;active.classList.add('screen-arriving');}
  const root=document.documentElement,previous=root.style.scrollBehavior;root.style.scrollBehavior='auto';window.scrollTo(0,0);root.style.scrollBehavior=previous;
  if(screen!=='intro'){
   const h=active.querySelector('h1,h2');if(h){h.tabIndex=-1;h.focus({preventScroll:true});}
   if(historyMode==='push')history.pushState({screen},'','#'+screen);
   else if(historyMode==='replace')history.replaceState({screen},'','#'+screen);
  }
 }
 document.querySelectorAll('[data-go]').forEach(e=>e.addEventListener('click',event=>{event.preventDefault();go(e.dataset.go);}));
 document.querySelectorAll('a[href="#garden"]').forEach(e=>e.addEventListener('click',event=>{event.preventDefault();go('home');}));
 addEventListener('popstate',event=>{if(currentScreen==='intro')return;const screen=event.state?.screen||location.hash.slice(1);go(sections[screen]?screen:'home','none');});
 $('replayIntro').addEventListener('click',()=>{go('intro','none');window.Intro.play();});
 function openDialog(id){focusReturn.set(id,document.activeElement);$(id).showModal();$(id).scrollTop=0;document.body.classList.add('modal-open');}
 document.querySelectorAll('[data-close]').forEach(e=>e.addEventListener('click',()=>$(e.dataset.close).close()));
 document.querySelectorAll('dialog').forEach(dialog=>{
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');const e=focusReturn.get(dialog.id);if(e?.isConnected&&e.getClientRects().length)e.focus({preventScroll:true});});
 });
 function updateRead(){
  $('flowerProgress').textContent=read.size+' / '+flowers.length;
  $('forestReadNote').textContent=read.size?'Em đã nhận '+read.size+' lời thương. Còn nhiều bông hoa đang chờ em.':'Mỗi loài hoa, một ý nghĩa. Mỗi lời thương, dành cho Cún.';
  document.querySelectorAll('[data-flower-index]').forEach(e=>{const seen=read.has(Number(e.dataset.flowerIndex));e.classList.toggle('seen',seen);e.querySelector('.seen-dot')?.toggleAttribute('hidden',!seen);});
 }
 function showFlower(index){
  currentFlower=(index+flowers.length)%flowers.length;const f=flowers[currentFlower],source=LOVE_FLOWER_SOURCES[f.source];
  $('flowerIndex').textContent='BÁCH HOA / '+String(currentFlower+1).padStart(2,'0');
  $('flowerName').textContent=f.name;$('flowerLatin').textContent=f.latin;$('flowerKicker').textContent=f.word.toLocaleUpperCase('vi')+' · MỘT LỜI THƯƠNG';
  $('flowerMeaning').textContent=f.meaning;$('flowerTitle').textContent=f.title;$('flowerMessage').textContent=f.message;
  $('meaningContext').textContent=f.note||'Ý nghĩa được chọn theo nguồn bên dưới; cách hiểu có thể thay đổi theo màu sắc, thời đại và văn hóa.';
  $('meaningSource').href=source.url;$('meaningSource').textContent=source.name+' ↗';$('flowerPage').textContent=String(currentFlower+1).padStart(2,'0')+' / '+flowers.length;
  Botanica.draw($('noteFlower'),f.id);read.add(currentFlower);updateRead();$('flowerDialog').scrollTop=0;
 }
 function chooseFlower(index){showFlower(index);openDialog('flowerDialog');}
 function renderBed(){
  const n=mobile.matches?6:8,total=Math.ceil(flowers.length/n);bed=bed%total;
  const spots=mobile.matches?[[17,52],[50,60],[83,51],[18,77],[51,83],[83,76]]:[[14,57],[32,64],[48,54],[65,63],[83,55],[22,82],[53,84],[84,81]];
  $('flowerHotspots').replaceChildren();
  flowers.slice(bed*n,bed*n+n).forEach((f,j)=>{const index=bed*n+j,e=document.createElement('button');e.type='button';e.className='flower-hotspot';e.dataset.flowerIndex=index;e.style.setProperty('--x',spots[j][0]+'%');e.style.setProperty('--y',spots[j][1]+'%');e.setAttribute('aria-label',f.name+' — '+f.word+'. Chạm để đọc lời thương.');const cv=document.createElement('canvas');cv.width=240;cv.height=336;cv.setAttribute('aria-hidden','true');const name=document.createElement('span');name.textContent=f.name;const small=document.createElement('small');small.textContent=f.word.toLocaleUpperCase('vi');e.append(cv,name,small);e.addEventListener('click',()=>chooseFlower(index));$('flowerHotspots').appendChild(e);Botanica.draw(cv,f.id);});
  $('nextBed').textContent='Luống '+(bed+1)+' / '+total+' ↻';updateRead();
 }
 flowers.forEach((f,index)=>{const e=document.createElement('button');e.type='button';e.className='catalog-flower';e.dataset.flowerIndex=index;e.dataset.group=f.group;const cv=document.createElement('canvas');cv.width=240;cv.height=320;cv.setAttribute('aria-hidden','true');const h=document.createElement('h3');h.textContent=f.name;const span=document.createElement('span');span.textContent=f.word.toLocaleUpperCase('vi');const mark=document.createElement('i');mark.textContent='♡';mark.setAttribute('aria-hidden','true');const seen=document.createElement('b');seen.className='seen-dot';seen.hidden=true;seen.setAttribute('aria-hidden','true');e.append(cv,h,span,mark,seen);e.addEventListener('click',()=>chooseFlower(index));$('catalogGrid').appendChild(e);Botanica.draw(cv,f.id);});
 $('nextBed').addEventListener('click',()=>{bed++;renderBed();});
 mobile.addEventListener('change',()=>{bed=0;if(currentScreen==='forest')renderBed();});
 $('catalogToggle').addEventListener('click',()=>openDialog('catalogDialog'));
 function filterCatalog(){const term=normalize($('flowerSearch').value.trim());let count=0;document.querySelectorAll('.catalog-flower').forEach(e=>{const f=flowers[Number(e.dataset.flowerIndex)],show=(filter==='all'||f.group===filter)&&normalize(f.name+' '+f.latin+' '+f.word).includes(term);e.hidden=!show;if(show)count++;});$('noFlowers').hidden=count>0;}
 $('flowerSearch').addEventListener('input',filterCatalog);
 document.querySelectorAll('[data-filter]').forEach(e=>e.addEventListener('click',()=>{filter=e.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===e)));filterCatalog();}));
 $('nextFlower').addEventListener('click',()=>showFlower(currentFlower+1));$('prevFlower').addEventListener('click',()=>showFlower(currentFlower-1));
 $('flowerDialog').addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();showFlower(currentFlower+1);}else if(event.key==='ArrowLeft'){event.preventDefault();showFlower(currentFlower-1);}});
 $('backToBook').addEventListener('click',()=>{$('flowerDialog').close();if(!$('catalogDialog').open)openDialog('catalogDialog');});
 $('plantSurface').addEventListener('click',event=>{let x=event.clientX,y=event.clientY;if(!event.detail){const r=$('plantSurface').getBoundingClientRect();x=r.left+r.width*(.25+Math.random()*.5);y=r.top+r.height*.6;}Garden.bloom(x,y);hearts(x,y,4);if(Garden.plantedCount===1)toast('Một bông hoa mới, một chút thương em. ♡');});
 $('rabbitNote').addEventListener('click',event=>{const r=event.currentTarget.getBoundingClientRect();hearts(r.left+r.width/2,r.top,14);toast('Chó Béo vẫn dành chỗ bên cạnh cho Vợ Cún. ♡');});
 $('letterTitle').textContent=content.letterTitle;
 for(const text of content.letter){const p=document.createElement('p');p.textContent=text;$('letterContent').appendChild(p);}
 $('openLetter').addEventListener('click',()=>{if(letterOpening)return;letterOpening=true;$('openLetter').classList.add('opening');const r=$('openLetter').getBoundingClientRect();hearts(r.left+r.width/2,r.top+50,18);clearTimeout(letterTimer);letterTimer=setTimeout(()=>{openDialog('letterDialog');letterOpening=false;},motion?750:0);});
 $('letterDialog').addEventListener('close',()=>$('openLetter').classList.remove('opening'));
 const photos=[...document.querySelectorAll('[data-photo]')];
 function showPhoto(index){currentPhoto=(index+photos.length)%photos.length;const item=photos[currentPhoto],image=item.querySelector('img');$('photoLarge').src=image.src;$('photoLarge').alt=image.alt;$('photoCaption').textContent=item.querySelector('span').textContent;}
 photos.forEach((e,index)=>e.addEventListener('click',()=>{showPhoto(index);openDialog('photoDialog');}));
 $('prevPhoto').addEventListener('click',()=>showPhoto(currentPhoto-1));$('nextPhoto').addEventListener('click',()=>showPhoto(currentPhoto+1));
 $('photoDialog').addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();showPhoto(currentPhoto+1);}else if(event.key==='ArrowLeft'){event.preventDefault();showPhoto(currentPhoto-1);}});
 let touchStart=0;$('photoLarge').addEventListener('touchstart',event=>{touchStart=event.changedTouches[0].clientX;},{passive:true});$('photoLarge').addEventListener('touchend',event=>{const dx=event.changedTouches[0].clientX-touchStart;if(Math.abs(dx)>45)showPhoto(currentPhoto+(dx>0?-1:1));},{passive:true});
 function updateDays(){const [year,month,day]=content.firstMet.split('-').map(Number),first=Date.UTC(year,month-1,day);const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const p=Object.fromEntries(parts.map(x=>[x.type,x.value]));const days=Math.floor((Date.UTC(Number(p.year),Number(p.month)-1,Number(p.day))-first)/86400000);$('firstDate').textContent=String(day).padStart(2,'0')+'.'+String(month).padStart(2,'0')+'.'+year;$('daysTogether').textContent=new Intl.NumberFormat('vi-VN').format(days);$('togetherDate').hidden=days<0;}
 updateDays();setInterval(updateDays,60000);
 const ribbon=document.createElement('span');ribbon.className='anniversary-ribbon';ribbon.textContent='18.10.2025 — từ ngày có em';document.querySelector('.dedication').after(ribbon);
 $('openWish').addEventListener('click',()=>openDialog('wishDialog'));
 $('wishForm').addEventListener('submit',event=>{event.preventDefault();const wish=$('wishInput').value.trim();if(!wish){$('wishInput').setCustomValidity('Em viết một điều ước nhỏ nhé.');$('wishInput').reportValidity();return;}$('wishInput').setCustomValidity('');$('wishDialog').close();for(let i=0;i<(motion?9:3);i++){const e=document.createElement('span');e.className='sky-lantern';e.style.setProperty('--x',10+Math.random()*80+'%');e.style.setProperty('--drift',(Math.random()-.5)*180+'px');e.style.animationDelay=i*.55+'s';$('lanternSky').appendChild(e);setTimeout(()=>e.remove(),16000);}toast('Một điều ước của em, một bầu trời giữ hộ. ♡');$('wishInput').value='';});
 $('wishInput').addEventListener('input',()=>$('wishInput').setCustomValidity(''));
 function closePlayer(){player?.remove();player=null;$('soundToggle').setAttribute('aria-pressed','false');$('soundToggle').querySelector('span').textContent='Bật nhạc';}
 $('soundToggle').addEventListener('click',()=>{
  if(player){closePlayer();return;}const song=content.song;
  player=document.createElement('aside');player.className='music-player';player.setAttribute('aria-label','Trình phát Phép Màu');
  const header=document.createElement('header'),title=document.createElement('span'),small=document.createElement('small'),close=document.createElement('button');title.textContent=song.title;small.textContent=song.artist;title.appendChild(small);close.textContent='×';close.type='button';close.setAttribute('aria-label','Tắt nhạc và đóng trình phát');close.addEventListener('click',closePlayer);header.append(title,close);player.appendChild(header);
  const frame=document.createElement('iframe');frame.title=song.title+' — '+song.artist;frame.src='https://www.youtube-nocookie.com/embed/'+encodeURIComponent(song.youtubeId)+'?autoplay=1&playsinline=1&rel=0';frame.allow='autoplay; encrypted-media; picture-in-picture';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';player.appendChild(frame);
  const help=document.createElement('p');help.className='player-help';help.textContent='Nếu nhạc chưa phát, em chạm ▶ trong khung nhé.';player.appendChild(help);const link=document.createElement('a');link.href='https://www.youtube.com/watch?v='+encodeURIComponent(song.youtubeId);link.target='_blank';link.rel='noopener noreferrer';link.textContent='Nghe bản chính thức trên YouTube ↗';player.appendChild(link);document.body.appendChild(player);$('soundToggle').setAttribute('aria-pressed','true');$('soundToggle').querySelector('span').textContent='Phép Màu';
 });
 window.Journey={go,setTime,toast,get motion(){return motion;},get screen(){return currentScreen;},get readCount(){return read.size;}};
 document.querySelectorAll('.reveal').forEach(e=>e.classList.add('shown'));
 go('intro','none');
})();
