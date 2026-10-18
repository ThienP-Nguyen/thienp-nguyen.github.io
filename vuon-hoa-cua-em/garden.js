/* Original 2D botanical illustration. All artwork is drawn locally; no 3D engine. */
(() => {
  'use strict';
  const TAU=Math.PI*2;
  const back=document.getElementById('landscape'),front=document.getElementById('blooms');
  const b=back.getContext('2d'),c=front.getContext('2d');
  const section=document.getElementById('garden');
  let W=1600,H=1000,dpr=1,scale=1,motion=!matchMedia('(prefers-reduced-motion: reduce)').matches;
  let mode='dusk',raf=0,last=0,visible=true,plants=[],newPlants=[],flies=[],stars=[],puffs=[];
  const species=['rose','tulip','daisy','lavender','cosmos'];
  let seed=78;
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const range=(a,z)=>a+random()*(z-a);
  const ellipse=(ctx,x,y,rx,ry,color,rotation=0)=>{ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,rotation,0,TAU);ctx.fill();};
  const path=(ctx,commands,fill,stroke,width=1)=>{ctx.beginPath();commands(ctx);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}};
  function glow(ctx,x,y,r,color){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');ellipse(ctx,x,y,r,r,g);}
  function leaf(ctx,x,y,size,angle,color){ctx.save();ctx.translate(x,y);ctx.rotate(angle);path(ctx,p=>{p.moveTo(0,0);p.bezierCurveTo(-size*.15,-size*.7,size*.7,-size*1.2,size,-size);p.bezierCurveTo(size*.9,-size*.2,size*.4,size*.1,0,0)},color);path(ctx,p=>{p.moveTo(0,0);p.lineTo(size*.8,-size*.8)},null,'#d6e3b433',.7);ctx.restore();}
  function petal(ctx,angle,length,width,colors){ctx.save();ctx.rotate(angle);const g=ctx.createLinearGradient(0,2,0,-length);g.addColorStop(0,colors[0]);g.addColorStop(1,colors[1]);path(ctx,p=>{p.moveTo(-2,1);p.bezierCurveTo(-width,-length*.35,-width*.85,-length*.88,-width*.3,-length);p.bezierCurveTo(0,-length*1.09,width*.7,-length*1.05,width*.77,-length*.7);p.bezierCurveTo(width*.9,-length*.38,width*.28,-length*.06,2,1)},g);path(ctx,p=>{p.moveTo(0,-length*.2);p.quadraticCurveTo(-2,-length*.6,0,-length*.9)},null,colors[2]||'#ffffff2b',.7);ctx.restore();}
  function flowerHead(ctx,type,size=1,variant=0){
    ctx.save();ctx.scale(size,size);
    if(type==='rose'){
      const colors=variant===1?['#d9958c','#f2c0ac','#e4a39a']:variant===2?['#b36b85','#e5a3ba','#c983a0']:['#c77693','#f0b5c9','#d88ba6'];
      for(let i=0;i<7;i++)petal(ctx,i*TAU/7,25,20,[colors[0],colors[1],'#ffe3df38']);
      ctx.rotate(.4);for(let i=0;i<6;i++)petal(ctx,i*TAU/6,19,16,[colors[0],colors[1]]);
      ctx.rotate(.3);for(let i=0;i<5;i++)petal(ctx,i*TAU/5,12,10,[colors[0],colors[2]]);
      path(ctx,p=>{p.moveTo(-5,3);p.bezierCurveTo(-10,-9,7,-11,7,-3);p.bezierCurveTo(7,4,-5,6,-3,-2);p.bezierCurveTo(-2,-6,3,-5,2,-1)},null,'#9f536e',1.7);
      ellipse(ctx,-9,-15,4,1,'#ffd9dc55',-.5);
    }else if(type==='tulip'){
      const colors=variant===1?['#cb977c','#ffd0aa']:variant===2?['#a4779f','#d7abc7']:['#d08e9e','#f6bbca'];
      const g=ctx.createLinearGradient(-20,-15,20,12);g.addColorStop(0,colors[0]);g.addColorStop(.55,colors[1]);g.addColorStop(1,colors[0]);
      path(ctx,p=>{p.moveTo(-22,-20);p.quadraticCurveTo(-29,18,0,23);p.quadraticCurveTo(28,16,22,-23);p.quadraticCurveTo(11,-19,0,-30);p.quadraticCurveTo(-10,-20,-22,-20)},g);
      path(ctx,p=>{p.moveTo(-21,-20);p.quadraticCurveTo(-6,-15,-1,21);p.moveTo(22,-23);p.quadraticCurveTo(6,-15,0,21)},null,colors[0],1);
      path(ctx,p=>{p.moveTo(-10,-15);p.quadraticCurveTo(-11,2,-3,12)},null,'#ffe6da6b',1.2);
    }else if(type==='daisy'){
      for(let i=0;i<13;i++)petal(ctx,i*TAU/13,26,8,['#d9d6b9','#fff8dc']);
      ellipse(ctx,0,0,9,8,'#ba853e');ellipse(ctx,-1,-2,8,6,'#ecc369');
      for(let i=0;i<15;i++){let a=i*2.4,r=Math.sqrt(i/15)*6;ellipse(ctx,Math.cos(a)*r,Math.sin(a)*r-2,.7,.7,'#b98f47');}
    }else if(type==='cosmos'){
      let co=variant===1?['#d597a0','#f8c9c8']:['#b77f9e','#e9afcb'];
      for(let i=0;i<8;i++)petal(ctx,i*TAU/8,30,14,co);
      ellipse(ctx,0,0,6,5,'#deb867');for(let i=0;i<9;i++)ellipse(ctx,Math.cos(i)*4,Math.sin(i)*3,1,1,'#f6d891');
    }else{
      ctx.strokeStyle='#6b9277';ctx.lineWidth=1.7;ctx.beginPath();ctx.moveTo(0,15);ctx.lineTo(0,-38);ctx.stroke();
      for(let j=0;j<8;j++){const y=-j*6;let f=1-j*.065;ellipse(ctx,-4*f,y,5*f,3.5*f,j%2?'#a991c1':'#bdacd8',-.55);ellipse(ctx,4*f,y-2,5*f,3.5*f,j%2?'#c2afd9':'#9d85b6',.55);}
    }
    ctx.restore();
  }
  const sprites=new Map();
  function plantSprite(type,variant=0){
    const key=type+variant;if(sprites.has(key))return sprites.get(key);
    const cv=document.createElement('canvas');cv.width=240;cv.height=350;const x=cv.getContext('2d');
    x.scale(2,2);x.translate(60,170);
    const height=type==='lavender'?112:type==='tulip'?102:106;
    const bend=type==='cosmos'?10:type==='tulip'?-5:4;
    path(x,p=>{p.moveTo(0,0);p.bezierCurveTo(-5,-height*.25,bend,-height*.7,bend,-height)},null,'#58836a',2);
    if(type==='tulip'){
      path(x,p=>{p.moveTo(-1,-3);p.bezierCurveTo(-30,-15,-30,-66,-19,-86);p.bezierCurveTo(-18,-54,-4,-35,-1,-3)},'#7e9d71');
      path(x,p=>{p.moveTo(2,-14);p.bezierCurveTo(32,-24,29,-74,31,-83);p.bezierCurveTo(16,-66,14,-39,2,-14)},'#6b946c');
      path(x,p=>{p.moveTo(-1,-6);p.quadraticCurveTo(-23,-43,-20,-76)},null,'#b9cb994d',.8);
    }else if(type==='lavender'){
      for(let i=0;i<4;i++){leaf(x,0,-10-i*17,22,-.8,'#759c86');leaf(x,0,-15-i*17,21,2.1,'#6c927c');}
      for(const d of [-1,1]){path(x,p=>{p.moveTo(0,-3);p.quadraticCurveTo(d*18,-35,d*16,-83)},null,'#6b967d',1.2);x.save();x.translate(d*16,-83);flowerHead(x,type,.65);x.restore();}
    }else{
      leaf(x,-1,-30,28,-1.1,'#759a6e');leaf(x,0,-48,29,1.9,'#608e6a');leaf(x,2,-72,19,-1.05,'#8ba67b');
      if(type==='rose'){leaf(x,-2,-24,21,2.35,'#567f60');leaf(x,2,-70,20,1.4,'#6d956a');}
      if(type==='cosmos'){for(let i=0;i<5;i++){leaf(x,0,-20-i*9,17,-.4,'#6f9b78');leaf(x,0,-26-i*8,16,2.6,'#6f9b78');}}
    }
    x.save();x.translate(bend,-height);flowerHead(x,type,.85,variant);x.restore();sprites.set(key,cv);return cv;
  }
  function drawSpecimen(canvas,type,variant=0){const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);const sprite=plantSprite(type,variant);const s=Math.min(canvas.width/240,canvas.height/350)*.9;ctx.drawImage(sprite,(canvas.width-240*s)/2,canvas.height-350*s-4,240*s,350*s);}
  function landscape(){
    seed=1227;b.clearRect(0,0,W,H);
    const night=mode==='night';
    const sky=b.createLinearGradient(0,0,0,H*.8);sky.addColorStop(0,night?'#172d3e':'#3b3d54');sky.addColorStop(.5,night?'#344d66':'#987586');sky.addColorStop(1,night?'#73828a':'#e9b8a0');b.fillStyle=sky;b.fillRect(0,0,W,H);
    glow(b,W*.5,H*.48,W*.53,night?'#bac7be0c':'#e8b49e24');
    // The moon and a little halo.
    const mx=W*(W<700?.83:.82),my=H*(W<700?.15:.23),mr=W<700?24:34;
    glow(b,mx,my,mr*3,night?'#f8e8bb2b':'#f5d5bf1e');ellipse(b,mx,my,mr,mr,night?'#f5e7c3':'#f7dcca');
    ellipse(b,mx+10,my-7,mr*.88,mr*.88,night?'#243d51':'#695b72');
    // Airy cloud veils.
    for(let i=0;i<13;i++){let x=range(-W*.1,W*1.1),y=range(H*.12,H*.48);b.save();b.globalAlpha=night?.022:.04;ellipse(b,x,y,range(70,190),range(7,16),'#ffe6d3');b.restore();}
    // Layers of blue-green hills.
    path(b,p=>{p.moveTo(0,H*.66);p.bezierCurveTo(W*.15,H*.50,W*.23,H*.72,W*.41,H*.62);p.bezierCurveTo(W*.6,H*.53,W*.73,H*.57,W,H*.64);p.lineTo(W,H);p.lineTo(0,H)},night?'#34595c':'#68837b');
    path(b,p=>{p.moveTo(0,H*.72);p.bezierCurveTo(W*.2,H*.58,W*.37,H*.79,W*.58,H*.64);p.bezierCurveTo(W*.8,H*.53,W*.9,H*.64,W,H*.62);p.lineTo(W,H);p.lineTo(0,H)},night?'#2e5550':'#527a67');
    // Faraway little cypress trees.
    for(let i=0;i<27;i++){let x=i*W/26,y=H*.665+Math.sin(i*1.8)*H*.027;let h=range(14,47);ellipse(b,x,y-h*.5,h*.19,h*.65,night?'#264a48':'#48745f');}
    // A small cottage with a lit window.
    let hx=W*.76,hy=H*.663,hs=W<700?.57:.85;b.save();b.translate(hx,hy);b.scale(hs,hs);path(b,p=>{p.moveTo(-35,3);p.lineTo(-35,-45);p.lineTo(34,-45);p.lineTo(34,3)},night?'#627c70':'#aaa68c');path(b,p=>{p.moveTo(-46,-42);p.lineTo(-4,-82);p.lineTo(44,-42)},'#514f58');b.fillStyle='#807d77';b.fillRect(17,-80,9,25);b.fillStyle='#d9bb87';b.fillRect(-14,-25,15,22);b.strokeStyle='#8f9274';b.lineWidth=2;b.strokeRect(-14,-25,15,22);b.beginPath();b.moveTo(-7,-25);b.lineTo(-7,-3);b.moveTo(-14,-15);b.lineTo(1,-15);b.stroke();glow(b,-6,-14,30,'#f9ce7d22');b.restore();
    // Meadow ground, a meandering path and stepping stones.
    const ground=b.createLinearGradient(0,H*.66,0,H);ground.addColorStop(0,night?'#375e49':'#6c8a63');ground.addColorStop(1,night?'#173e34':'#264e3c');path(b,p=>{p.moveTo(0,H*.75);p.bezierCurveTo(W*.18,H*.65,W*.35,H*.73,W*.5,H*.69);p.bezierCurveTo(W*.7,H*.64,W*.9,H*.7,W,H*.73);p.lineTo(W,H);p.lineTo(0,H)},ground);
    path(b,p=>{p.moveTo(W*.49,H*.69);p.bezierCurveTo(W*.44,H*.73,W*.6,H*.77,W*.51,H*.81);p.bezierCurveTo(W*.43,H*.86,W*.5,H*.9,W*.62,H);p.lineTo(W*.3,H);p.bezierCurveTo(W*.37,H*.9,W*.4,H*.84,W*.46,H*.8);p.bezierCurveTo(W*.54,H*.76,W*.4,H*.73,W*.49,H*.69)},night?'#8d907348':'#d2c49a75');
    for(let i=0;i<7;i++){let y=H*.84+i*17,x=W*(.46+Math.sin(i*.9)*.035);ellipse(b,x,y,16+i*3,3+i*.4,night?'#a8ac8b35':'#e1d4ae65',i%2?.1:-.1);}
    // Small garden fence.
    b.save();b.globalAlpha=.38;b.strokeStyle=night?'#aab09a':'#c5c8a5';b.lineWidth=3;
    for(const side of [[W*.11,W*.39],[W*.61,W*.91]]){const y=H*.716;b.beginPath();b.moveTo(side[0],y);b.lineTo(side[1],y);b.moveTo(side[0],y+19);b.lineTo(side[1],y+19);b.stroke();for(let x=side[0];x<side[1];x+=18){b.beginPath();b.moveTo(x,y-8);b.lineTo(x,y+35);b.stroke();}}
    b.restore();
    // Woodland framing: softly curving trunks and hundreds of individual leaves.
    for(let side=0;side<2;side++){
      b.save();if(side){b.translate(W,0);b.scale(-1,1);}const twig=night?'#1d423a':'#254b3d';
      path(b,p=>{p.moveTo(-20,H*.91);p.bezierCurveTo(W*.025,H*.65,W*.005,H*.26,-25,-50);p.lineTo(-90,-50);p.lineTo(-90,H)},'#29473c');
      path(b,p=>{p.moveTo(-2,H*.35);p.bezierCurveTo(W*.08,H*.22,W*.14,H*.24,W*.22,H*.13);p.moveTo(0,H*.2);p.bezierCurveTo(W*.09,H*.1,W*.1,H*.01,W*.2,-5);p.moveTo(0,H*.46);p.bezierCurveTo(W*.06,H*.39,W*.13,H*.43,W*.15,H*.31)},null,twig,9);
      for(let i=0;i<135;i++){
        let x=range(-W*.04,W*.23),y=range(-35,H*.47);
        const boundary=W*(.24-y/H*.36);if(x>boundary+range(-22,30))continue;
        const colors=night?['#315947','#294f40','#38624c','#416c51']:['#436d50','#345e48','#608461','#426e50','#76936b'];
        let sz=range(12,30);ellipse(b,x,y,sz,sz*.52,colors[i%colors.length],range(-1,1));
        if(i%4===0)path(b,p=>{p.moveTo(x-sz*.7,y);p.lineTo(x+sz*.7,y)},null,'#b2c39718',.6);
      }
      // Wild climbing roses tucked into the canopy.
      for(let i=0;i<18;i++){let x=range(0,W*.12),y=range(H*.11,H*.52);b.save();b.translate(x,y);flowerHead(b,'rose',range(.22,.43),i%3);b.restore();}
      b.restore();
    }
    // Fairy lights follow a loose catenary across the upper canopy.
    b.strokeStyle='#e4cd9a45';b.lineWidth=.9;b.beginPath();b.moveTo(-20,70);b.bezierCurveTo(W*.2,153,W*.27,168,W*.5,106);b.bezierCurveTo(W*.72,172,W*.83,142,W+20,65);b.stroke();
    for(let i=0;i<19;i++){let t=i/18,x=t*W;let y=71+Math.sin(t*Math.PI)*64+Math.sin(t*TAU)*13;let tail=10+i%3*5;b.strokeStyle='#dec99445';b.beginPath();b.moveTo(x,y);b.lineTo(x,y+tail);b.stroke();glow(b,x,y+tail+3,19,'#fce19b28');ellipse(b,x,y+tail+3,2.3,3.5,'#ffdf9d');}
    // Moss, fallen petals, little stones, and tall grass.
    for(let i=0;i<260;i++){let x=range(0,W),y=range(H*.75,H);b.save();b.globalAlpha=range(.2,.55);ellipse(b,x,y,range(.8,3),range(.6,2),i%5===0?'#e4b0ba':i%4===0?'#d6c08d':'#a2b784',range(-1,1));b.restore();}
    for(let i=0;i<180;i++){let x=range(0,W),y=range(H*.8,H*1.08),hh=range(12,50);b.strokeStyle=i%2?'#81986d4d':'#94aa7c30';b.lineWidth=range(.6,1.4);b.beginPath();b.moveTo(x,y);b.quadraticCurveTo(x+range(-7,7),y-hh*.6,x+range(-16,16),y-hh);b.stroke();}
    // A few glowing mushrooms and a tiny vintage sign.
    for(const loc of [[.18,.84,1],[.82,.83,.7],[.85,.88,1]]){b.save();b.translate(W*loc[0],H*loc[1]);b.scale(loc[2],loc[2]);b.fillStyle='#d9c7a3';b.fillRect(-3,-15,6,20);path(b,p=>{p.moveTo(-17,-13);p.bezierCurveTo(-15,-40,15,-40,17,-13);p.closePath()},'#b98182');ellipse(b,-5,-24,3,2,'#f9dfba');ellipse(b,7,-18,2,1.7,'#f9dfba');glow(b,0,-8,35,'#eacc7d0a');b.restore();}
    const signx=W*.69,signy=H*.798;b.save();b.translate(signx,signy);b.rotate(-.09);b.fillStyle='#7b8060';b.fillRect(-2,0,4,42);b.fillStyle='#c9b28a';b.fillRect(-29,-12,58,24);b.strokeStyle='#a3916f';b.strokeRect(-29,-12,58,24);b.fillStyle='#6b7657';b.font='italic 9px Georgia';b.textAlign='center';b.fillText('our little garden',0,3);b.restore();
    drawDogs(b,W*.5,H*.795,W<700?.75:1);
    // Foreground bushes anchor the edges.
    for(let side=0;side<2;side++){for(let i=0;i<17;i++){let x=side?W-range(-20,W*.13):range(-20,W*.13);let y=range(H*.89,H*1.03);ellipse(b,x,y,range(25,55),range(20,45),night?'#204b3b':'#2e5b40',range(-1,1));}}
    // Delicate film grain from reproducible sparse points.
    b.save();b.globalAlpha=.04;for(let i=0;i<1800;i++){b.fillStyle=i%2?'#fff4cc':'#142b32';b.fillRect(range(0,W),range(0,H),.7,.7);}b.restore();
  }
  function drawDogs(ctx,x,y,s){
    ctx.save();ctx.translate(x,y);ctx.scale(s,s);
    ellipse(ctx,0,19,80,12,'#173d3538');
    // Chó Béo: round warm brown dog, floppy ears and tiny paws.
    ctx.save();ctx.translate(25,0);ellipse(ctx,0,-1,29,29,'#c9996f');ellipse(ctx,1,4,21,23,'#ead0a3');ellipse(ctx,0,-32,25,23,'#dbaf7e');ellipse(ctx,-24,-35,9,20,'#9e7658',-.3);ellipse(ctx,23,-35,9,20,'#9e7658',.3);ellipse(ctx,-9,-32,2,2.6,'#544a3d');ellipse(ctx,9,-32,2,2.6,'#544a3d');ellipse(ctx,0,-24,11,8,'#f0d4ae');ellipse(ctx,0,-27,3.4,2.6,'#705549');path(ctx,p=>{p.moveTo(0,-24);p.quadraticCurveTo(-2,-20,-5,-22);p.moveTo(0,-24);p.quadraticCurveTo(2,-20,5,-22)},null,'#856550',1);ellipse(ctx,-14,-26,4,2.5,'#ce8e80');ellipse(ctx,14,-26,4,2.5,'#ce8e80');ellipse(ctx,-15,21,11,7,'#d6aa7e');ellipse(ctx,15,21,11,7,'#d6aa7e');ctx.strokeStyle='#b68a65';ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(23,6);ctx.quadraticCurveTo(43,-7,35,-15);ctx.stroke();ctx.restore();
    // Vợ Cún: cream-colored dog with a pink bow and heart tag.
    ctx.save();ctx.translate(-23,-1);ellipse(ctx,0,2,22,25,'#efe2c2');ellipse(ctx,0,-28,22,21,'#f7eacb');ellipse(ctx,-21,-31,8,17,'#cfb899',-.35);ellipse(ctx,20,-31,8,17,'#cfb899',.35);ellipse(ctx,-8,-28,1.9,2.5,'#5a5146');ellipse(ctx,8,-28,1.9,2.5,'#5a5146');ellipse(ctx,0,-20,10,7,'#fff1d5');ellipse(ctx,0,-23,3,2.5,'#86635b');path(ctx,p=>{p.moveTo(-4,-18);p.quadraticCurveTo(0,-14,4,-18)},null,'#9a7b67',1);ellipse(ctx,-12,-22,4,2,'#e5aba5');ellipse(ctx,12,-22,4,2,'#e5aba5');ellipse(ctx,-10,22,9,6,'#f0dfbf');ellipse(ctx,12,22,9,6,'#f0dfbf');path(ctx,p=>{p.moveTo(-9,-7);p.quadraticCurveTo(0,-3,10,-7)},null,'#c78797',3);ctx.fillStyle='#bf7f91';ctx.font='12px Georgia';ctx.textAlign='center';ctx.fillText('♥',1,5);path(ctx,p=>{p.moveTo(-14,-44);p.bezierCurveTo(-32,-57,-30,-35,-14,-44);p.bezierCurveTo(0,-59,3,-36,-14,-44)},'#d390a4');ellipse(ctx,-14,-44,3.2,3,'#eab0be');ctx.restore();
    // Small heart between the two.
    ctx.fillStyle='#e1a7b2';ctx.font='14px Georgia';ctx.textAlign='center';ctx.fillText('♡',3,-67);ctx.restore();
  }
  function setupPlants(){
    seed=667;plants=[];const count=W<700?65:135;
    for(let i=0;i<count;i++){
      const xn=random(),center=Math.abs(xn-.5)*2;
      let y=H*(.94+random()*.19),height=range(135,265)*(0.7+center*.45);
      if(xn>.35&&xn<.65){height*=.65;y+=30;}
      if(i<20){y=H*range(.8,.92);height=range(50,100);}
      if(xn>.37&&xn<.63){y=Math.max(y,H*1.01);height=Math.min(height,H*.15);}
      plants.push({x:xn*W,y,height,type:species[i%5],variant:i%3,phase:range(0,TAU),depth:y});
    }
    plants.sort((a,z)=>a.depth-z.depth);
    flies=Array.from({length:W<700?22:44},()=>({x:range(0,W),y:range(H*.57,H*.95),r:range(.7,1.8),phase:range(0,TAU),speed:range(.2,.9)}));
    stars=Array.from({length:W<700?30:70},()=>({x:range(0,W),y:range(20,H*.56),r:range(.45,1.3),phase:range(0,TAU)}));
    puffs=Array.from({length:W<700?6:13},()=>({x:range(0,W),y:range(130,H*.75),phase:range(0,TAU),speed:range(.3,1),r:range(1.5,3)}));
  }
  function render(t=0){
    c.clearRect(0,0,W,H);let tt=motion?t/1000:1;
    // Far flowers in the meadow.
    c.save();c.globalAlpha=.65;
    for(let i=0;i<30;i++){const xx=(i/30)*W,y=H*.75+Math.sin(i*2.3)*20;c.save();c.translate(xx,y);flowerHead(c,species[i%5],.1,i%3);c.restore();}c.restore();
    // The main flowers sway from their roots; their detailed petals are cached sprites.
    for(const p of plants){c.save();c.translate(p.x,p.y);c.rotate(Math.sin(tt*.65+p.phase)*.022*(motion?1:0));let h=p.height,s=h/350;c.globalAlpha=mode==='night'?.87:.99;c.drawImage(plantSprite(p.type,p.variant),-120*s,-h,240*s,h);c.restore();}
    const now=performance.now();
    for(const p of newPlants){let progress=motion?Math.min(1,(now-p.birth)/900):1;let e=1-Math.pow(1-progress,3);c.save();c.translate(p.x,p.y);c.scale(e,e);c.rotate(Math.sin(tt+p.phase)*.025*(motion?1:0));c.drawImage(plantSprite(p.type,p.variant),-p.height*120/350,-p.height,p.height*240/350,p.height);c.restore();}
    // Fireflies, floating pollen and twinkling stars.
    c.globalAlpha=1;
    for(const f of flies){const x=f.x+Math.sin(tt*f.speed+f.phase)*18,y=f.y+Math.cos(tt*.5+f.phase)*14,a=.25+(Math.sin(tt*1.5+f.phase)+1)*.27;c.save();c.globalAlpha=a;glow(c,x,y,11,'#f4e39b3d');ellipse(c,x,y,f.r,f.r,'#ffedb2');c.restore();}
    for(const s of stars){let a=(.15+(Math.sin(tt*.7+s.phase)+1)*.2)*(mode==='night'?1:.6);c.save();c.globalAlpha=a;ellipse(c,s.x,s.y,s.r,s.r,'#ffefcf');if(s.r>1.15){c.strokeStyle='#fff2cd';c.lineWidth=.5;c.beginPath();c.moveTo(s.x-3,s.y);c.lineTo(s.x+3,s.y);c.moveTo(s.x,s.y-3);c.lineTo(s.x,s.y+3);c.stroke();}c.restore();}
    for(const p of puffs){const y=(p.y+H-tt*7*p.speed)%H,x=p.x+Math.sin(tt*.3+p.phase)*30;c.save();c.globalAlpha=.25;ellipse(c,x,y,p.r,p.r*.45,'#f9dcd4',tt*.3);c.restore();}
    // Two little butterflies meander above the flower beds.
    for(let i=0;i<2;i++){
      let x=W*(i?.78:.22)+Math.sin(tt*.19+i*3)*W*.06,y=H*.68+Math.sin(tt*.32+i*2)*20;
      c.save();c.translate(x,y);c.rotate(Math.sin(tt*.3+i)*.2);const flap=.25+Math.abs(Math.sin(tt*4+i))* .75;c.scale(flap,1);
      ellipse(c,-6,-4,7,9,i?'#edc6cc':'#e7cb92',-.6);ellipse(c,6,-4,7,9,i?'#edc6cc':'#e7cb92',.6);ellipse(c,-5,5,5,5,i?'#d99eaf':'#cdb981',.5);ellipse(c,5,5,5,5,i?'#d99eaf':'#cdb981',-.5);c.restore();
      c.save();c.translate(x,y);ellipse(c,0,0,1,7,'#6d7059');c.strokeStyle='#96997a';c.lineWidth=.6;c.beginPath();c.moveTo(0,-5);c.lineTo(-3,-11);c.moveTo(0,-5);c.lineTo(3,-11);c.stroke();c.restore();
    }
    c.globalAlpha=1;
  }
  function loop(t){raf=0;if(!visible||!motion||document.hidden)return;if(t-last>32){render(t);last=t;}raf=requestAnimationFrame(loop);}
  function start(){if(motion&&visible&&!document.hidden&&!raf)raf=requestAnimationFrame(loop);}
  function stop(){cancelAnimationFrame(raf);raf=0;}
  function resize(){const rect=section.getBoundingClientRect();H=1000;W=H*rect.width/rect.height;dpr=Math.min(devicePixelRatio||1,1.75);scale=rect.height/H;
    for(const cv of [back,front]){cv.width=Math.round(rect.width*dpr);cv.height=Math.round(rect.height*dpr);cv.getContext('2d').setTransform(scale*dpr,0,0,scale*dpr,0,0);}
    newPlants=[];setupPlants();landscape();render(performance.now());start();
  }
  let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(resize,180);},{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else stop();},{rootMargin:'100px'}).observe(section);
  window.Garden={
    setTime(value){mode=value;landscape();render(performance.now());},
    setMotion(value){motion=value;if(value)start();else{stop();render();}},
    bloom(clientX,clientY){const r=section.getBoundingClientRect();let x=(clientX-r.left)/scale,y=(clientY-r.top)/scale;if(!Number.isFinite(x)||!Number.isFinite(y)){x=W*.3;y=H*.9;}y=Math.max(H*.77,Math.min(H*.98,y+65));newPlants.push({x,y,type:species[Math.floor(Math.random()*5)],variant:Math.floor(Math.random()*3),height:145+Math.random()*55,phase:Math.random()*TAU,birth:performance.now()});if(newPlants.length>35)newPlants.shift();render(performance.now());start();},
    drawSpecimen,
    get plantedCount(){return newPlants.length;},
    get running(){return !!raf;}
  };
  resize();
  document.querySelectorAll('canvas[data-species]').forEach(cv=>drawSpecimen(cv,cv.dataset.species,cv.dataset.species==='tulip'?1:0));
})();
