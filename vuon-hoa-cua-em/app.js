(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const content=window.GARDEN_CONTENT;
  const $=id=>document.getElementById(id);
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let motion=!reduce.matches,manualMotion=false,currentFlower=0,currentPhoto=0,petalTimer,toastTimer;
  let letterTimer=null,letterOpening=false,player=null,playerOpen=false,lastFocus=null;
  const flowerTypes=['rose','tulip','daisy','lavender','cosmos'];

  const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('shown');reveal.unobserve(entry.target);}}),{threshold:.08});
  document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.transitionDelay=(el.closest('.flower-collection,.polaroids')?i%5*65:0)+'ms';reveal.observe(el);});

  function toast(text){clearTimeout(toastTimer);$('toast').textContent=text;$('toast').classList.add('visible');toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),3800);}
  function hearts(x,y,count=8){if(!motion)return;for(let i=0;i<count;i++){const el=document.createElement('span');el.className='spark-heart';el.textContent=i%3?'♡':'✧';el.style.left=x+(Math.random()-.5)*80+'px';el.style.top=y+(Math.random()-.5)*25+'px';el.style.setProperty('--drift',(Math.random()-.5)*110+'px');el.style.fontSize=11+Math.random()*17+'px';el.style.animationDelay=i*.035+'s';document.body.appendChild(el);setTimeout(()=>el.remove(),2400);}}
  function petal(){if(!motion||document.hidden)return;const el=document.createElement('span');el.className='petal';el.style.setProperty('--left',Math.random()*100+'%');el.style.setProperty('--drift',(Math.random()-.5)*220+'px');el.style.setProperty('--angle',Math.random()*360+'deg');el.style.setProperty('--duration',12+Math.random()*8+'s');el.style.width=5+Math.random()*5+'px';el.style.height=8+Math.random()*7+'px';$('petalLayer').appendChild(el);setTimeout(()=>el.remove(),21000);}
  function setMotion(value){motion=value;document.documentElement.classList.toggle('motion-paused',!motion);$('motionToggle').setAttribute('aria-pressed',String(motion));$('motionToggle').querySelector('span').textContent=motion?'Hiệu ứng bật':'Hiệu ứng tắt';window.Garden.setMotion(motion);clearInterval(petalTimer);if(motion){petalTimer=setInterval(petal,1800);petal();}else{$('petalLayer').replaceChildren();document.querySelectorAll('.spark-heart').forEach(el=>el.remove());}}
  $('motionToggle').addEventListener('click',()=>{manualMotion=true;setMotion(!motion);});
  reduce.addEventListener('change',()=>{if(!manualMotion)setMotion(!reduce.matches);});setMotion(motion);
  document.querySelectorAll('.time-switch button').forEach(button=>button.addEventListener('click',()=>{const time=button.dataset.time;document.documentElement.dataset.time=time;window.Garden.setTime(time);document.querySelectorAll('.time-switch button').forEach(el=>el.setAttribute('aria-pressed',String(el===button)));toast(time==='night'?'Ánh trăng cũng dịu dàng hơn khi có em. ☾':'Một buổi chiều, một khu vườn, và em. ♡');}));

  $('plantSurface').addEventListener('click',event=>{let x=event.clientX,y=event.clientY;if(event.detail===0){const r=$('plantSurface').getBoundingClientRect();x=r.left+r.width*(.2+Math.random()*.6);y=r.top+r.height*.65;}window.Garden.bloom(x,y);hearts(x,y,3);if(window.Garden.plantedCount===1)toast('Thêm một bông hoa, thêm một chút thương em. ♡');else if(window.Garden.plantedCount%5===0)toast('Vườn càng nhiều hoa, anh càng thương Cún. ♡');});
  $('rabbitNote').addEventListener('click',event=>{const r=event.currentTarget.getBoundingClientRect();hearts(r.left+r.width/2,r.top,14);toast('Chó Béo dành chỗ bên cạnh mình cho Vợ Cún rồi. ♡');});

  // Native modal dialogs provide focus trapping and Escape support.
  function openDialog(id){lastFocus=document.activeElement;$(id).showModal();$(id).scrollTop=0;document.body.classList.add('modal-open');}
  document.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',()=>$(el.dataset.close).close()));
  document.querySelectorAll('dialog').forEach(dialog=>{
    dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
    dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]'))document.body.classList.remove('modal-open');if(lastFocus&&lastFocus.isConnected)lastFocus.focus({preventScroll:true});});
  });
  function showFlower(index){currentFlower=(index+content.flowerNotes.length)%content.flowerNotes.length;const note=content.flowerNotes[currentFlower];$('flowerKicker').textContent=note.kicker;$('flowerTitle').textContent=note.title;$('flowerMessage').textContent=note.message;window.Garden.drawSpecimen($('noteFlower'),flowerTypes[currentFlower],currentFlower===1?1:0);}
  document.querySelectorAll('[data-flower]').forEach(el=>el.addEventListener('click',()=>{showFlower(Number(el.dataset.flower));openDialog('flowerDialog');}));
  $('nextFlower').addEventListener('click',()=>{showFlower(currentFlower+1);});

  for(const paragraph of content.letter){const p=document.createElement('p');p.textContent=paragraph;$('letterContent').appendChild(p);}
  $('openLetter').addEventListener('click',()=>{if(letterOpening)return;letterOpening=true;$('openLetter').classList.add('opening');const r=$('openLetter').getBoundingClientRect();hearts(r.left+r.width/2,r.top+60,19);clearTimeout(letterTimer);letterTimer=setTimeout(()=>{openDialog('letterDialog');letterOpening=false;},motion?750:0);});
  $('letterDialog').addEventListener('close',()=>{$('openLetter').classList.remove('opening');});

  const photos=[...document.querySelectorAll('[data-photo]')];
  function showPhoto(index){currentPhoto=(index+photos.length)%photos.length;const item=photos[currentPhoto],image=item.querySelector('img');$('photoLarge').src=image.src;$('photoLarge').alt=image.alt;$('photoCaption').textContent=item.querySelector('span').textContent;}
  photos.forEach((el,index)=>el.addEventListener('click',()=>{showPhoto(index);openDialog('photoDialog');}));
  $('prevPhoto').addEventListener('click',()=>showPhoto(currentPhoto-1));$('nextPhoto').addEventListener('click',()=>showPhoto(currentPhoto+1));
  $('photoDialog').addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();showPhoto(currentPhoto+1);}else if(event.key==='ArrowLeft'){event.preventDefault();showPhoto(currentPhoto-1);}});
  let touchStart; $('photoLarge').addEventListener('touchstart',event=>{touchStart=event.changedTouches[0].clientX;},{passive:true});$('photoLarge').addEventListener('touchend',event=>{const dx=event.changedTouches[0].clientX-touchStart;if(Math.abs(dx)>45)showPhoto(currentPhoto+(dx>0?-1:1));},{passive:true});

  // Calendar days are calculated in Vietnam, independently of the visitor's timezone.
  function updateDays(){if(!/^\d{4}-\d{2}-\d{2}$/.test(content.firstMet))return;const [year,month,day]=content.firstMet.split('-').map(Number);const first=Date.UTC(year,month-1,day);const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const values=Object.fromEntries(today.map(item=>[item.type,item.value]));const now=Date.UTC(Number(values.year),Number(values.month)-1,Number(values.day));const days=Math.floor((now-first)/86400000);if(days<0)return;$('firstDate').textContent=`${String(day).padStart(2,'0')}.${String(month).padStart(2,'0')}.${year}`;$('daysTogether').textContent=new Intl.NumberFormat('vi-VN').format(days);$('togetherDate').hidden=false;}
  updateDays();setInterval(updateDays,60000);
  $('openWish').addEventListener('click',()=>openDialog('wishDialog'));
  $('wishForm').addEventListener('submit',event=>{event.preventDefault();const wish=$('wishInput').value.trim();if(!wish){$('wishInput').setCustomValidity('Em viết một điều ước nhỏ nhé.');$('wishInput').reportValidity();return;}$('wishInput').setCustomValidity('');$('wishDialog').close();const count=motion?7:3;for(let i=0;i<count;i++){const el=document.createElement('span');el.className='sky-lantern';el.style.setProperty('--x',15+Math.random()*70+'%');el.style.setProperty('--drift',(Math.random()-.5)*180+'px');el.style.animationDelay=i*.5+'s';$('lanternSky').appendChild(el);setTimeout(()=>el.remove(),15000);}toast('Một điều ước của em, một bầu trời giữ hộ. ♡');$('wishInput').value='';});
  $('wishInput').addEventListener('input',()=>$('wishInput').setCustomValidity(''));

  // Official music player. Loaded only after the visitor requests music.
  function closePlayer(){if(player){player.remove();player=null;}playerOpen=false;$('soundToggle').setAttribute('aria-pressed','false');$('soundToggle').querySelector('span').textContent='Bật nhạc';}
  $('soundToggle').addEventListener('click',()=>{
    if(playerOpen){closePlayer();return;}
    const song=content.song;if(!song||!song.youtubeId)return;
    player=document.createElement('aside');player.className='music-player';player.setAttribute('aria-label','Trình phát Phép Màu');
    const header=document.createElement('header'),title=document.createElement('span'),small=document.createElement('small'),close=document.createElement('button');title.textContent=song.title;small.textContent=song.artist;title.appendChild(small);close.textContent='×';close.type='button';close.setAttribute('aria-label','Tắt nhạc và đóng trình phát');close.addEventListener('click',closePlayer);header.append(title,close);player.appendChild(header);
    const frame=document.createElement('iframe');frame.title=`${song.title} — ${song.artist}`;frame.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(song.youtubeId)}?autoplay=1&playsinline=1&rel=0`;frame.allow='autoplay; encrypted-media; picture-in-picture';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';player.appendChild(frame);
    const help=document.createElement('p');help.className='player-help';help.textContent='Nếu nhạc chưa phát, em chạm nút ▶ trong khung nhé.';player.appendChild(help);
    const link=document.createElement('a');link.href=`https://www.youtube.com/watch?v=${encodeURIComponent(song.youtubeId)}`;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Nghe bản chính thức trên YouTube ↗';player.appendChild(link);document.body.appendChild(player);playerOpen=true;$('soundToggle').setAttribute('aria-pressed','true');$('soundToggle').querySelector('span').textContent='Phép Màu';
  });

  // A small anniversary keepsake, always rendered from the real date.
  const ribbon=document.createElement('span');ribbon.className='anniversary-ribbon';ribbon.textContent='18.10.2025 — từ ngày có em';document.querySelector('.dedication').after(ribbon);
})();
