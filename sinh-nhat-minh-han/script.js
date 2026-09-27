/* Giao diện và hiệu ứng. Nội dung cần thay nằm ở noidung.js. */
(() => {
  'use strict';
  const cfg = window.SINH_NHAT || {};
  const root = document.documentElement;
  const byId = (id) => document.getElementById(id);
  const dateParts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(cfg.ngaySinh || '2005-09-29');
  const [, birthYear, month, day] = dateParts || ['', '2005', '09', '29'];
  const year = Number(cfg.namSinhNhat) || 2026;
  const content = { hoTen:'Đỗ Hoàng Minh Hân',ten:'Minh Hân',bietDanh:'Vợ Cún yêu',bietDanhThuHai:'Cún húi của Chó Béo',nguoiGui:'Chó Béo', ...cfg, tuoi: year - Number(birthYear) };
  document.querySelectorAll('[data-fill]').forEach((el) => { el.textContent = content[el.dataset.fill] ?? ''; });
  document.title = `Gửi ${content.ten} • Chúc mừng sinh nhật ♡`;
  document.querySelector('.photo-under-note').textContent = content.bietDanhThuHai;
  document.querySelector('.letter-intro .eyebrow').textContent = `TỪ ${content.nguoiGui.toLocaleUpperCase('vi')}, VỚI TẤT CẢ YÊU THƯƠNG`;
  document.querySelector('.birth-date').textContent = `${day} tháng ${month}, ${birthYear}`;
  byId('birthdayDate').textContent = `${day}.${month}.${year}`;
  byId('letterDate').textContent = `${day} tháng ${month}, ${year}`;
  byId('dialogTitle').textContent = cfg.loiMoThu || `Gửi ${content.bietDanh},`;
  byId('letterClosing').textContent = cfg.loiKetThu || 'Thương em thật nhiều,';

  // Dùng textContent để lời thư được hiển thị như văn bản, không chạy HTML.
  const letterText = String(cfg.thu || '').trim();
  if (letterText) {
    byId('letterEmpty').hidden = true;
    letterText.split(/\n\s*\n/).forEach((paragraph) => {
      const p = document.createElement('p');
      p.textContent = paragraph;
      byId('letterBody').appendChild(p);
    });
  }

  document.querySelectorAll('[data-photo]').forEach((frame) => {
    const photo = cfg.anh?.[Number(frame.dataset.photo)];
    if (!photo) return;
    if (photo.chuThich) frame.querySelector('figcaption').textContent = photo.chuThich;
    if (!photo.tep?.trim()) return;
    const img = new Image();
    img.alt = photo.moTa || photo.chuThich || 'Kỷ niệm của chúng mình';
    img.loading = frame.dataset.photo === '0' ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.style.objectPosition = photo.viTri || '50% 50%';
    img.addEventListener('load', () => { frame.querySelector('.photo-placeholder').hidden = true; });
    img.addEventListener('error', () => { img.remove(); console.warn('Không tải được ảnh. Kiểm tra đường dẫn trong noidung.js:', photo.tep); });
    img.src = photo.tep;
    frame.querySelector('.photo-slot').appendChild(img);
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let motionEnabled = !reduceMotion.matches;
  let motionOverridden = false;
  const canvas = byId('sparkles');
  const ctx = canvas.getContext('2d');
  let width = innerWidth, height = innerHeight, frameId = 0, lastTime = 0;
  let particles = [], burstParticles = [];
  const random = (a,b) => a + Math.random() * (b-a);
  function resizeCanvas() {
    width = innerWidth; height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * dpr; canvas.height = height * dpr;
    ctx?.setTransform(dpr,0,0,dpr,0,0);
    particles = Array.from({length:width < 700 ? 14 : 25}, () => ({x:random(0,width),y:random(0,height),size:random(1,2.5),speed:random(7,20),phase:random(0,Math.PI*2)}));
  }
  function draw(time) {
    if (!ctx || !motionEnabled || document.hidden) { frameId = 0; return; }
    const dt = lastTime ? Math.min((time-lastTime)/1000,.05) : .016;
    lastTime = time; ctx.clearRect(0,0,width,height);
    particles.forEach(p => {
      p.y -= p.speed*dt; if(p.y < -10){p.y=height+10;p.x=random(0,width);}
      const opacity = .12 + (Math.sin(time/1700+p.phase)+1)*.14;
      ctx.fillStyle=`rgba(180,104,125,${opacity})`;
      ctx.beginPath();ctx.arc(p.x+Math.sin(time/2200+p.phase)*9,p.y,p.size,0,Math.PI*2);ctx.fill();
    });
    burstParticles = burstParticles.filter(p => p.life > 0);
    burstParticles.forEach(p => {
      p.life -= dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=70*dt;
      ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,p.life));ctx.translate(p.x,p.y);ctx.rotate(p.rotate+p.life*.4);ctx.fillStyle=p.color;ctx.font=`${p.size}px Georgia`;ctx.fillText(p.symbol,0,0);ctx.restore();
    });
    frameId = requestAnimationFrame(draw);
  }
  function restartMotion(){ if(!frameId && motionEnabled && !document.hidden){lastTime=0;frameId=requestAnimationFrame(draw);} }
  function updateMotion(){
    root.classList.toggle('no-motion',!motionEnabled);
    root.classList.toggle('js-motion',motionEnabled);
    byId('motionToggle').setAttribute('aria-pressed', String(!motionEnabled));
    byId('motionToggle').setAttribute('aria-label',motionEnabled ? 'Tắt hiệu ứng chuyển động' : 'Bật hiệu ứng chuyển động');
    byId('motionLabel').textContent=motionEnabled ? 'Hiệu ứng: bật' : 'Hiệu ứng: tắt';
    if(motionEnabled) restartMotion();
    else {cancelAnimationFrame(frameId);frameId=0;ctx?.clearRect(0,0,width,height);burstParticles=[];}
  }
  byId('motionToggle').addEventListener('click',()=>{motionOverridden=true;motionEnabled=!motionEnabled;updateMotion();});
  reduceMotion.addEventListener('change',()=>{if(!motionOverridden){motionEnabled=!reduceMotion.matches;updateMotion();}});
  window.addEventListener('resize',resizeCanvas,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frameId);frameId=0;}else restartMotion();});
  resizeCanvas();updateMotion();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}
    }),{threshold:.1});
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
  } else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));

  function celebrate(){
    if(!motionEnabled) return;
    const rect = byId('openLetter').getBoundingClientRect();
    const colors=['#bd6f8b','#ecc5c9','#ffd5ad','#9b4266'];
    burstParticles=Array.from({length:48},()=>({x:rect.x+rect.width/2,y:rect.y+rect.height/2,vx:random(-170,170),vy:random(-230,-65),life:random(1.4,2.6),size:random(10,23),rotate:random(-1,1),color:colors[Math.floor(random(0,colors.length))],symbol:Math.random()>.4?'♥':'✦'}));
  }
  const dialog=byId('letterDialog');
  const openButton=byId('openLetter');
  let opening=false;
  openButton.addEventListener('click',()=>{
    if(opening || dialog.open) return;
    opening=true;openButton.disabled=true;openButton.classList.add('opening');
    byId('envelopeCaption').textContent='Dành cho người anh thương nhất…';
    celebrate();
    setTimeout(()=>{
      document.body.classList.add('modal-open');
      dialog.showModal();dialog.scrollTop=0;
      byId('dialogTitle').focus({preventScroll:true});
      opening=false;openButton.disabled=false;
    },motionEnabled ? 1100 : 0);
  });
  byId('closeLetter').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const r=dialog.getBoundingClientRect();
    if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();
  });
  dialog.addEventListener('close',()=>{
    document.body.classList.remove('modal-open');
    openButton.classList.remove('opening');
    byId('envelopeCaption').textContent='Đọc lại bất cứ khi nào em muốn nhé.';
    openButton.focus({preventScroll:true});
  });
})();
