(() => {
 'use strict';
 const $=id=>document.getElementById(id),intro=$('intro'),cv=$('introLights'),ctx=cv.getContext('2d');
 const lines=[
  'Có những cuộc gặp,\nnhẹ nhàng mà đổi thay cả một đời.',
  '18 tháng 10 năm 2025.\nMột buổi chiều ở Phúc Long,\nvà một người anh muốn nghe mãi.',
  'Từ ngày ấy,\nnhững điều bình thường trong anh\nbỗng biết nở hoa.',
  'Vợ Cún yêu,\nđây là khu rừng anh dành riêng cho em.'
 ];
 let generation=0,raf=0,start=0,playing=false,finishing=false,width=0,height=0,lights=[];
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
 function resize(){width=innerWidth;height=innerHeight;const d=Math.min(devicePixelRatio||1,1.5);cv.width=width*d;cv.height=height*d;ctx.setTransform(d,0,0,d,0,0);lights=Array.from({length:width<700?65:115},(_,i)=>({x:Math.random()*width,y:height*(.15+Math.random()*.77),phase:Math.random()*Math.PI*2,delay:Math.random()*2.6,r:.7+Math.random()*1.6,angle:i/115*Math.PI*2}));}
 function frame(now){if(!playing)return;const t=(now-start)/1000;ctx.clearRect(0,0,width,height);
  const heart=clamp((t-3.2)/2.3)*(1-clamp((t-6.3)/2));
  for(let i=0;i<lights.length;i++){
   const p=lights[i],a=clamp((t-1.3-p.delay)/2.3),theta=i/lights.length*Math.PI*2;
   const hx=width*.5+Math.pow(Math.sin(theta),3)*Math.min(width*.21,160),hy=height*.43-(13*Math.cos(theta)-5*Math.cos(2*theta)-2*Math.cos(3*theta)-Math.cos(4*theta))*Math.min(width*.014,10);
   const x=(p.x+Math.sin(t*.4+p.phase)*22)*(1-heart)+hx*heart,y=(p.y+Math.cos(t*.3+p.phase)*15)*(1-heart)+hy*heart;
   const alpha=a*(.3+(Math.sin(t*1.6+p.phase)+1)*.28);ctx.globalAlpha=alpha;
   const g=ctx.createRadialGradient(x,y,0,x,y,13);g.addColorStop(0,'#f7dda64d');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,13,0,Math.PI*2);ctx.fill();ctx.fillStyle=i%6===0?'#f3c2c6':'#fff0c3';ctx.beginPath();ctx.arc(x,y,p.r,0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=1;if(t>=4.2)Garden.setAwakening(clamp((t-4.2)/6));raf=requestAnimationFrame(frame);
 }
 function segments(text){return typeof Intl.Segmenter==='function'?[...new Intl.Segmenter('vi',{granularity:'grapheme'}).segment(text)].map(x=>x.segment):Array.from(text);}
 async function typeLine(text,token){const words=$('introWords');words.classList.remove('vanishing');words.textContent='';words.classList.add('typing');for(const ch of segments(text)){if(token!==generation||!playing)return false;words.textContent+=ch;await wait(ch==='\n'?230:ch===','||ch==='.'?120:35);}words.classList.remove('typing');$('introAccessible').textContent=text;return token===generation&&playing;}
 async function story(token){await wait(7900);if(token!==generation||!playing)return;intro.classList.add('intro-words-on');for(let i=0;i<lines.length;i++){if(!await typeLine(lines[i],token))return;if(i<lines.length-1){await wait(1700);if(token!==generation||!playing)return;$('introWords').classList.add('vanishing');await wait(950);}}if(token!==generation||!playing)return;$('introEnter').hidden=false;intro.dataset.phase='ready';}
 function play(){generation++;const token=generation;playing=true;finishing=false;cancelAnimationFrame(raf);intro.hidden=false;intro.className='cinematic-intro';intro.dataset.phase='dark';$('introWords').textContent='';$('introWords').className='';$('introEnter').hidden=true;$('introAccessible').textContent='Một khu rừng đang được thắp sáng, dành riêng cho Minh Hân.';Journey.setTime('night');Garden.setAwakening(0);resize();start=performance.now();
  if(!Journey.motion){intro.classList.add('intro-garden','intro-lights','intro-words-on');Garden.setAwakening(1);$('introWords').textContent=lines[3];$('introAccessible').textContent=lines.join(' ');$('introEnter').hidden=false;intro.dataset.phase='ready';return;}
  raf=requestAnimationFrame(frame);wait(1300).then(()=>{if(token===generation&&playing){intro.classList.add('intro-lights');intro.dataset.phase='lights';}});wait(4200).then(()=>{if(token===generation&&playing){intro.classList.add('intro-garden');intro.dataset.phase='garden';}});story(token);
 }
 async function finish(){if(finishing)return;finishing=true;playing=false;generation++;cancelAnimationFrame(raf);Garden.setAwakening(1);intro.classList.add('leaving');await wait(Journey.motion?900:0);Journey.go('home','replace');intro.hidden=true;intro.classList.remove('leaving');}
 $('introSkip').addEventListener('click',finish);$('introEnter').addEventListener('click',finish);
 addEventListener('resize',()=>{if(Journey.screen==='intro')resize();},{passive:true});
 window.Intro={play,finish};play();
})();
