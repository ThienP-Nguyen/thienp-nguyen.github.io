/* Original hand-shaped botanical drawings, cached as transparent 2D sprites. */
(() => {
 'use strict';
 const PI=Math.PI,TAU=PI*2,cache=new Map();
 const data=()=>window.LOVE_FLOWERS||[];
 const get=id=>data().find(f=>f.id===id)||{id,color:'#bc8eaf',light:'#f1d1e3'};
 const ell=(c,x,y,rx,ry,fill,rot=0)=>{c.fillStyle=fill;c.beginPath();c.ellipse(x,y,rx,ry,rot,0,TAU);c.fill();};
 function line(c,fn,color,width=1){c.beginPath();fn(c);c.strokeStyle=color;c.lineWidth=width;c.stroke();}
 function shape(c,fn,fill,stroke){c.beginPath();fn(c);c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=.5;c.stroke();}}
 function leaf(c,x,y,s,a,light=false){c.save();c.translate(x,y);c.rotate(a);const g=c.createLinearGradient(0,0,s,-s);g.addColorStop(0,'#49745c');g.addColorStop(1,light?'#9cb787':'#7b9f75');shape(c,p=>{p.moveTo(0,0);p.bezierCurveTo(-s*.2,-s*.6,s*.6,-s*1.1,s,-s);p.bezierCurveTo(s*.9,-s*.2,s*.4,s*.1,0,0)},g);line(c,p=>{p.moveTo(0,0);p.lineTo(s*.84,-s*.84)},'#bfd0a260',.65);for(let k=1;k<4;k++)line(c,p=>{p.moveTo(s*k/5,-s*k/5);p.lineTo(s*(k+.8)/5,-s*(k+1.8)/5)},'#bacd9a25',.4);c.restore();}
 function petal(c,a,r,w,f,point=false){c.save();c.rotate(a);const g=c.createLinearGradient(-w*.3,0,w*.4,-r);g.addColorStop(0,f.color);g.addColorStop(1,f.light);shape(c,p=>{p.moveTo(-1,2);p.bezierCurveTo(-w,-r*.27,-w*.9,-r*.85,point?0:-w*.25,-r);p.bezierCurveTo(w*.55,-r*1.06,w,-r*.62,1,2)},g,f.color+'65');line(c,p=>{p.moveTo(0,-r*.25);p.quadraticCurveTo(-1,-r*.57,0,-r*.87)},'#fff4e933',.5);c.restore();}
 function center(c,r,color='#d6ac5d'){ell(c,0,0,r,r*.85,color);for(let i=0;i<16;i++){let a=i*2.4,rr=Math.sqrt(i/16)*r*.8;ell(c,Math.cos(a)*rr,Math.sin(a)*rr,.6,.6,i%3?'#f5da93':'#9b7d45');}}
 function radial(c,f,n,r,w,inner=4,point=false){for(let i=0;i<n;i++)petal(c,i*TAU/n+.1*Math.sin(i*8),r+(Math.sin(i*4)*1.8),w,f,point);center(c,inner);}
 function rosette(c,f,layers=4,point=false){for(let j=0;j<layers;j++){let r=31-j*5,n=10+j*2;c.save();c.rotate(j*.29);for(let i=0;i<n;i++)petal(c,i*TAU/n,r,point?r*.24:r*.65,f,point);c.restore();}ell(c,0,0,3,2.5,f.color);line(c,p=>{p.arc(0,0,5,.1,PI*1.7)},'#89566b66',1);}
 function bell(c,x,y,r,f){c.save();c.translate(x,y);shape(c,p=>{p.moveTo(-r,-r*.8);p.bezierCurveTo(-r*1.3,r*.3,-r*.5,r*1.1,0,r*.8);p.quadraticCurveTo(r*.4,r*1.1,r*.6,r*.55);p.quadraticCurveTo(r*1.1,r*.8,r,r*.2);p.bezierCurveTo(r,-r*.4,r*.7,-r*.8,-r,-r*.8)},f.light,f.color);line(c,p=>{p.moveTo(-r*.7,r*.45);p.quadraticCurveTo(0,r*.1,r*.7,r*.45)},f.color+'99',.6);c.restore();}
 function head(c,id,s=1){const f=get(id);c.save();c.scale(s,s);
  if(['rose','ranunculus','peony','camellia','dahlia','lisianthus','carnation'].includes(id)){
   rosette(c,f,id==='dahlia'?6:id==='peony'?5:id==='camellia'?3:4,id==='dahlia');
   if(id==='camellia')center(c,5,'#d7b769');
   if(id==='peony'||id==='carnation'){for(let i=0;i<17;i++){const a=i*TAU/17,r=24+Math.sin(i*2)*3;line(c,p=>{p.arc(Math.cos(a)*r,Math.sin(a)*r,4,a,a+PI)},'#fff3e766',.6);}}
  }else if(id==='tulip'){
   const g=c.createLinearGradient(-24,0,24,0);g.addColorStop(0,f.color);g.addColorStop(.5,f.light);g.addColorStop(1,f.color);shape(c,p=>{p.moveTo(-25,-22);p.bezierCurveTo(-29,15,-17,27,0,27);p.bezierCurveTo(22,24,29,8,24,-25);p.quadraticCurveTo(13,-20,0,-32);p.quadraticCurveTo(-11,-20,-25,-22)},g);line(c,p=>{p.moveTo(-25,-22);p.quadraticCurveTo(-6,-16,0,26);p.moveTo(24,-25);p.quadraticCurveTo(6,-15,0,26)},f.color,1);line(c,p=>{p.moveTo(-11,-15);p.quadraticCurveTo(-12,5,-4,15)},'#fff0de80',1);
  }else if(['daisy','aster','sunflower','cosmos'].includes(id)){
   const n=id==='aster'?24:id==='sunflower'?18:id==='cosmos'?8:14;radial(c,f,n,id==='sunflower'?33:28,id==='cosmos'?13:id==='aster'?4:6,id==='sunflower'?13:6,id==='sunflower');
   if(id==='sunflower'){center(c,13,'#8b6e48');for(let i=0;i<50;i++){let a=i*2.399,r=Math.sqrt(i/50)*11;ell(c,Math.cos(a)*r,Math.sin(a)*r,.65,.65,i%2?'#c4a66c':'#6c5940');}}
  }else if(id==='orchid'){
   for(const p of [[-.95,26,18],[.95,26,18],[0,24,10],[2.25,21,10],[-2.25,21,10]])petal(c,p[0],p[1],p[2],f);
   const lip={color:'#ba779f',light:'#f4bfda'};petal(c,PI,17,14,lip);ell(c,0,1,5,5,'#edd7b8');ell(c,0,3,2.5,3,'#c39370');
  }else if(id==='violet'){
   for(let i=0;i<5;i++)petal(c,i*TAU/5,i===2?23:19,13,f);center(c,3,'#edcf89');for(let i=0;i<4;i++)line(c,p=>{p.moveTo(0,2);p.lineTo(-9+i*6,13)},'#66578266',.65);
  }else if(['hydrangea','heliotrope','lilac','hyacinth','stock'].includes(id)){
   const cone=['lilac','hyacinth','stock'].includes(id);const count=id==='hydrangea'?29:id==='heliotrope'?26:22;
   for(let i=0;i<count;i++){let a=i*2.399,r=Math.sqrt(i/count)*(cone?20:28),x=Math.cos(a)*r*(cone?.7:1),y=cone?-42+i*2.9+Math.sin(a)*3:Math.sin(a)*r*.85;c.save();c.translate(x,y);radial(c,{...f,light:i%3===0?f.light:f.color},4,id==='hydrangea'?6.8:5.2,4,1.2);c.restore();}
  }else if(id==='lavender'){
   line(c,p=>{p.moveTo(0,12);p.lineTo(0,-45)},'#63836f',1.2);for(let i=0;i<9;i++){let y=-i*5.5,k=1-i*.055;ell(c,-4*k,y,4.5*k,3.5*k,i%2?f.light:f.color,-.6);ell(c,4*k,y-2,4.5*k,3.5*k,i%2?f.color:f.light,.6);}
  }else if(id==='lilyvalley'){
   line(c,p=>{p.moveTo(-5,22);p.bezierCurveTo(6,0,3,-45,20,-35)},'#659070',1.4);for(let i=0;i<6;i++){let y=-29+i*8,x=5+Math.sin(i)*2;line(c,p=>{p.moveTo(6,y-4);p.quadraticCurveTo(18,y-9,18,y)},'#6c9672',.8);bell(c,18,y+3,5,f);}
  }else if(id==='globeamaranth'){
   for(let i=0;i<90;i++){let a=i*2.399,r=Math.sqrt(i/90)*20,x=Math.cos(a)*r,y=Math.sin(a)*r;ell(c,x,y,3,2.3,i%4===0?f.light:f.color,a);ell(c,x-.4,y-.8,.5,.5,'#f8d5e5');}
  }else if(id==='honeysuckle'){
   for(let i=0;i<7;i++){c.save();c.rotate((i-3)*.28);shape(c,p=>{p.moveTo(0,12);p.bezierCurveTo(-2,-5,-17,-8,-18,-23);p.quadraticCurveTo(-7,-28,1,-16);p.bezierCurveTo(7,-10,4,1,0,12)},i%2?f.color:f.light);line(c,p=>{p.moveTo(-13,-21);p.quadraticCurveTo(-16,-30,-24,-32)},'#dcc58f',.65);ell(c,-24,-32,1.2,1.2,'#bc9e67');c.restore();}
  }else if(id==='freesia'){
   line(c,p=>{p.moveTo(-18,14);p.quadraticCurveTo(0,-23,30,-18)},'#70916b',1.5);for(let i=0;i<5;i++){c.save();c.translate(-14+i*10,-2-i*5);c.rotate(.4);radial(c,f,6,9-i*.7,5,2);c.restore();}
  }else if(id==='babysbreath'||id==='forgetmenot'){
   for(let j=0;j<7;j++){let a=j*2.4,r=12+Math.sqrt(j)*8,x=Math.cos(a)*r,y=Math.sin(a)*r*.65;line(c,p=>{p.moveTo(0,20);p.quadraticCurveTo(x*.8,7,x,y)},'#79946e',.7);for(let k=0;k<3;k++){c.save();c.translate(x+Math.sin(k*3)*6,y+k*4);radial(c,f,5,id==='babysbreath'?3.1:6,3,id==='babysbreath'?.7:1.4);c.restore();}}
  }else if(id==='alstroemeria'){
   radial(c,f,6,25,12,3);for(let i=0;i<3;i++){c.save();c.rotate(i*TAU/3);for(let j=0;j<5;j++)line(c,p=>{p.moveTo(-5+j*2,-13);p.lineTo(-4+j*2,-18-Math.sin(j)*2)},'#9e695477',.7);c.restore();}
  }else{
   radial(c,f,id==='jasmine'?7:5,id==='gardenia'?27:20,id==='gardenia'?18:10,3);
   if(id==='gardenia'){c.rotate(.6);radial(c,f,5,19,14,2);}
   if(id==='myrtle'||id==='orangeblossom'){for(let i=0;i<15;i++){let a=i*TAU/15;line(c,p=>{p.moveTo(0,0);p.lineTo(Math.cos(a)*11,Math.sin(a)*11)},'#d4b767',.45);ell(c,Math.cos(a)*11,Math.sin(a)*11,.8,.8,'#d4b767');}}
  }
  c.restore();
 }
 function sprite(id){if(cache.has(id))return cache.get(id);const cv=document.createElement('canvas');cv.width=300;cv.height=420;const c=cv.getContext('2d');c.scale(2,2);c.translate(75,205);const f=get(id);const lean=id==='tulip'?-5:5;
  line(c,p=>{p.moveTo(0,0);p.bezierCurveTo(-5,-45,lean,-93,lean,-135)},'#557f61',2);
  if(['tulip','lilyvalley','hyacinth'].includes(id)){shape(c,p=>{p.moveTo(0,-3);p.bezierCurveTo(-34,-20,-35,-83,-27,-107);p.bezierCurveTo(-26,-73,-2,-31,0,-3)},'#779b71');shape(c,p=>{p.moveTo(2,-10);p.bezierCurveTo(33,-28,29,-85,34,-109);p.bezierCurveTo(15,-85,12,-43,2,-10)},'#638c65');line(c,p=>{p.moveTo(0,-5);p.quadraticCurveTo(-29,-60,-27,-100)},'#b8c9a244',.8);
  }else{leaf(c,0,-27,33,-1.1,true);leaf(c,0,-55,30,1.8);leaf(c,3,-87,23,-1.1,true);if(['rose','camellia','gardenia'].includes(id)){leaf(c,0,-31,23,2.2);leaf(c,4,-91,19,1.65);}}
  if(['lavender','lilac','stock','forgetmenot','jasmine','orangeblossom','myrtle','alstroemeria','freesia'].includes(id)){
   for(const s of [-1,1]){line(c,p=>{p.moveTo(0,-25);p.quadraticCurveTo(s*24,-65,s*24,-109)},'#6c9171',1.1);c.save();c.translate(s*24,-106);head(c,id,.52);c.restore();}
  }
  c.save();c.translate(lean,-135);head(c,id,id==='lilyvalley'?1.15:1);c.restore();
  // Dew drops catch the light on a leaf and petal.
  ell(c,-17,-45,1.3,1.8,'#d2e2c288');ell(c,-17.3,-45.5,.45,.6,'#fffde9');ell(c,lean-9,-149,1.05,1.4,'#fff5ea7a');
  cache.set(id,cv);return cv;
 }
 window.Botanica={sprite,head,draw(canvas,id){const c=canvas.getContext('2d');c.clearRect(0,0,canvas.width,canvas.height);const cv=sprite(id);const s=Math.min(canvas.width/cv.width,canvas.height/cv.height)*.92;c.drawImage(cv,(canvas.width-cv.width*s)/2,canvas.height-cv.height*s,cv.width*s,cv.height*s);}};
})();
