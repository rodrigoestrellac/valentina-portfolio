(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ---- top bar ---- */
  const bar = document.getElementById('bar');
  const onScroll = () => bar.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();

  /* ---- scroll progress ---- */
  const prog = document.getElementById('progress');
  function setProgress(){
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = 'scaleX(' + (h>0 ? Math.min(scrollY/h,1) : 0) + ')';
  }
  setProgress();

  /* ---- reveals ---- */
  const io = new IntersectionObserver((es)=>{
    es.forEach((e)=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(el=>{ if(!el.closest('.hero')) io.observe(el); });

  /* ---- play-in for mock UIs ---- */
  const playObs = new IntersectionObserver((es)=>{
    es.forEach((e)=>{ if(e.isIntersecting){ e.target.classList.add('go'); playObs.unobserve(e.target);} });
  }, {threshold:0.3});
  document.querySelectorAll('.frame.play').forEach(el=>playObs.observe(el));

  /* ---- process line ---- */
  const method = document.querySelector('.method');
  if(method){
    const mObs = new IntersectionObserver((es)=>{
      es.forEach((e)=>{ if(e.isIntersecting){ e.target.classList.add('go'); mObs.unobserve(e.target);} });
    }, {threshold:0.35});
    mObs.observe(method);
  }

  /* ---- count up ---- */
  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
  function countUp(el){
    const target = parseInt(el.dataset.count, 10);
    const pad = parseInt(el.dataset.pad, 10) || 0;
    if (reduce){ el.textContent = String(target).padStart(pad, '0'); return; }
    const dur = 1500, start = performance.now();
    function tick(now){
      const p = Math.min((now - start) / dur, 1);
      el.textContent = String(Math.round(easeOutCubic(p) * target)).padStart(pad, '0');
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const statGrid = document.querySelector('.stats__grid');
  if (statGrid){
    const cObs = new IntersectionObserver((es)=>{
      es.forEach((e)=>{ if(e.isIntersecting){ e.target.querySelectorAll('.count').forEach(countUp); cObs.unobserve(e.target);} });
    }, {threshold:0.45});
    cObs.observe(statGrid);
  }

  /* ---- active nav section ---- */
  const navLinks = [...document.querySelectorAll('.bar__nav a')];
  const sectionMap = {trabajo:'#trabajo', sobre:'#sobre', capacidades:'#capacidades', contacto:'#contacto'};
  const secObs = new IntersectionObserver((es)=>{
    es.forEach((e)=>{
      if(e.isIntersecting){
        const id = '#' + e.target.id;
        navLinks.forEach(a=>a.classList.toggle('is-current', a.getAttribute('href') === id));
      }
    });
  }, {threshold:0.5});
  ['trabajo','sobre','capacidades','contacto'].forEach(id=>{ const s=document.getElementById(id); if(s) secObs.observe(s); });

  /* ---- combined scroll listener ---- */
  let lastY = scrollY, vel = 0;
  addEventListener('scroll', ()=>{
    onScroll(); setProgress();
    vel = scrollY - lastY; lastY = scrollY;
  }, {passive:true});

  /* ---- marquee (auto + scroll velocity) ---- */
  const track = document.getElementById('marquee');
  if(track){
    let mx = 0, half = 0;
    const measure = ()=>{ half = track.scrollWidth/2; };
    measure(); addEventListener('resize', measure);
    function loopM(){
      const base = reduce ? 0 : 0.55;
      mx -= base + Math.min(Math.abs(vel)*0.06, 6);
      if(half && Math.abs(mx) >= half) mx += half;
      track.style.transform = 'translateX(' + mx + 'px)';
      vel *= 0.9;
      requestAnimationFrame(loopM);
    }
    if(!reduce) requestAnimationFrame(loopM);
  }

  /* ---- preloader ---- */
  const loader = document.getElementById('loader');
  const heroReveals = [...document.querySelectorAll('.hero .reveal')];
  function startHero(){
    document.body.classList.remove('loading');
    heroReveals.forEach((el,i)=> setTimeout(()=>el.classList.add('in'), 80 + i*150));
  }
  if (!loader){ startHero(); }
  else if (reduce){ loader.remove(); startHero(); }
  else {
    const pctEl = document.getElementById('pct');
    const barI = loader.querySelector('.loader__bar i');
    let p = 0;
    const iv = setInterval(()=>{
      p = Math.min(100, p + Math.random()*16 + 7);
      pctEl.textContent = Math.round(p);
      barI.style.width = p + '%';
      if (p >= 100){
        clearInterval(iv);
        setTimeout(()=>{
          loader.classList.add('done');
          startHero();
          setTimeout(()=>loader.remove(), 1000);
        }, 240);
      }
    }, 95);
  }

  /* ---- custom cursor ---- */
  const cursor = document.getElementById('cursor');
  if (fine){
    document.documentElement.classList.add('cursor-custom');
    let cx=innerWidth/2, cy=innerHeight/2, tx=cx, ty=cy;
    addEventListener('mousemove', e=>{ tx=e.clientX; ty=e.clientY; });
    (function loop(){ cx+=(tx-cx)*0.2; cy+=(ty-cy)*0.2; cursor.style.transform='translate('+cx+'px,'+cy+'px) translate(-50%,-50%)'; requestAnimationFrame(loop); })();
    document.querySelectorAll('[data-link]').forEach(el=>{
      el.addEventListener('mouseenter',()=>cursor.classList.add('is-link'));
      el.addEventListener('mouseleave',()=>cursor.classList.remove('is-link'));
    });
    document.querySelectorAll('[data-view]').forEach(el=>{
      el.addEventListener('mouseenter',()=>cursor.classList.add('is-view'));
      el.addEventListener('mouseleave',()=>cursor.classList.remove('is-view'));
    });
  }

  /* ---- magnetic ---- */
  if (fine && !reduce){
    document.querySelectorAll('.magnetic').forEach(el=>{
      el.addEventListener('mousemove', e=>{
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width/2, y = e.clientY - r.top - r.height/2;
        el.style.transform = 'translate(' + x*0.3 + 'px,' + y*0.4 + 'px)';
      });
      el.addEventListener('mouseleave', ()=>{ el.style.transform=''; });
    });
  }

  /* ---- 3D tilt on project frames ---- */
  if (fine && !reduce){
    document.querySelectorAll('.project').forEach(card=>{
      const frame = card.querySelector('.frame');
      card.addEventListener('mousemove', e=>{
        const r = frame.getBoundingClientRect();
        const px = (e.clientX - r.left)/r.width - 0.5;
        const py = (e.clientY - r.top)/r.height - 0.5;
        frame.style.setProperty('--ry', (px*6).toFixed(2) + 'deg');
        frame.style.setProperty('--rx', (-py*6).toFixed(2) + 'deg');
      });
      card.addEventListener('mouseleave', ()=>{
        frame.style.setProperty('--rx','0deg'); frame.style.setProperty('--ry','0deg');
      });
    });
  }

  /* ---- hero engineering grid canvas ---- */
  (function(){
    const canvas = document.getElementById('grid');
    const hero = document.querySelector('.hero');
    if(!canvas || !hero) return;
    const ctx = canvas.getContext('2d');
    let w=0,h=0,dpr=1,pts=[],pairs=[],raf=null,last=0;
    const mouse = {x:-9999,y:-9999};
    const SP = 52, R = 175, FRAME_MS = 1000/30;
    function build(){
      const r = hero.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio||1, 1.5);
      w = r.width; h = r.height;
      canvas.width = Math.round(w*dpr); canvas.height = Math.round(h*dpr);
      canvas.style.width = w+'px'; canvas.style.height = h+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
      pts = [];
      for(let y=SP*0.6; y<h; y+=SP) for(let x=SP*0.6; x<w; x+=SP) pts.push({bx:x,by:y,x,y,ph:Math.random()*6.28});
      pairs = [];
      const maxd = SP*1.6;
      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const a=pts[i], b=pts[j];
        if(Math.abs(a.bx-b.bx)<=maxd && Math.abs(a.by-b.by)<=maxd && Math.hypot(a.bx-b.bx,a.by-b.by)<=maxd) pairs.push([i,j]);
      }
    }
    function render(t){
      ctx.clearRect(0,0,w,h);
      for(const p of pts){
        p.x = p.bx + Math.sin(t/2400 + p.ph)*1.5;
        p.y = p.by + Math.cos(t/2800 + p.ph)*1.5;
        const d = Math.hypot(p.x-mouse.x, p.y-mouse.y);
        const f = d<R ? 1-d/R : 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.1 + f*2.4, 0, 6.2832);
        ctx.fillStyle = f>0 ? 'rgba(216,69,28,'+(0.22+f*0.6)+')' : 'rgba(27,24,19,0.16)';
        ctx.fill();
      }
      if(mouse.x > -9000){
        ctx.lineWidth = 1;
        for(const pr of pairs){
          const a=pts[pr[0]], b=pts[pr[1]];
          const da=Math.hypot(a.x-mouse.x,a.y-mouse.y); if(da>R) continue;
          const db=Math.hypot(b.x-mouse.x,b.y-mouse.y); if(db>R) continue;
          ctx.strokeStyle = 'rgba(216,69,28,' + ((1-da/R)*(1-db/R)*0.5).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    function loop(t){ raf = requestAnimationFrame(loop); if(t - last < FRAME_MS) return; last = t; render(t); }
    function staticDraw(){
      ctx.clearRect(0,0,w,h); ctx.fillStyle='rgba(27,24,19,0.14)';
      for(const p of pts){ ctx.beginPath(); ctx.arc(p.x,p.y,1.1,0,6.2832); ctx.fill(); }
    }
    function start(){ if(!raf && !reduce){ last=0; raf=requestAnimationFrame(loop); } }
    function stop(){ if(raf){ cancelAnimationFrame(raf); raf=null; } }
    build();
    if(reduce){ staticDraw(); }
    else {
      start();
      addEventListener('mousemove', e=>{ const r=hero.getBoundingClientRect(); mouse.x=e.clientX-r.left; mouse.y=e.clientY-r.top; });
      addEventListener('mouseout', ()=>{ mouse.x=-9999; mouse.y=-9999; });
      new IntersectionObserver(es=>{ es.forEach(en=> en.isIntersecting ? start() : stop()); }, {threshold:0}).observe(hero);
      document.addEventListener('visibilitychange', ()=>{ document.hidden ? stop() : start(); });
    }
    let rt; addEventListener('resize', ()=>{ clearTimeout(rt); rt=setTimeout(()=>{ build(); if(reduce) staticDraw(); }, 180); });
    addEventListener('load', ()=>{ build(); if(reduce) staticDraw(); });
  })();
})();
