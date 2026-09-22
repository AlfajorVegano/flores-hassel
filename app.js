(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const scenes = [
    ['warm', 'Gracias por estar<br><em>todos estos días,</em>', 6500],
    ['rain', 'a pesar de<br><em>la lluvia,</em>', 5500],
    ['snow', '<em>nieve,</em>', 5000],
    ['sand', 'tormentas<br><em>de arenas.</em>', 6000],
    ['love', 'TE AMO', Infinity]
  ];
  const motionQuery = new URLSearchParams(location.search).get('motion');
  let reduced = motionQuery === 'off' || (motionQuery !== 'full' && matchMedia('(prefers-reduced-motion: reduce)').matches);
  function syncMotion() {
    document.documentElement.dataset.motion = reduced ? 'off' : 'full';
    $('motion').setAttribute('aria-pressed', String(!reduced));
    $('motion').textContent = reduced ? 'Movimiento suave' : 'Full motion';
  }
  syncMotion();
  $('motion').addEventListener('click', () => { reduced = !reduced; syncMotion(); });
  let current = -1, elapsed = 0, paused = false, last = 0, audio = null, sound = false, nextNote = 0;
  function show(index) {
    current = index; elapsed = 0;
    document.body.dataset.scene = scenes[index][0];
    $('line').innerHTML = scenes[index][1];
    const copy = document.querySelector('.copy');
    copy.classList.remove('enter'); void copy.offsetWidth; copy.classList.add('enter');
    document.querySelectorAll('.progress i').forEach((dot, i) => dot.classList.toggle('active', i <= index));
    $('next').hidden = index === 4;
    if (index === 0) { const bouquet = document.querySelector('.bouquet'); bouquet.classList.remove('grow-again'); void bouquet.offsetWidth; bouquet.classList.add('grow-again'); }
    if (index === 4) petals.forEach((p, i) => { p.x = .2 + Math.random()*.6; p.y = -.2 - i*.022; });
    $('replay').hidden = index !== 4;
    $('chapter').textContent = index === 4 ? 'HASSEL ALEJANDRA' : 'PARA HASSEL';
  }
  $('open').addEventListener('click', () => {
    $('welcome').hidden = true; $('story').hidden = false; show(0);
    $('pause').focus();
  });
  $('next').addEventListener('click', () => { if (current < 4) { show(current + 1); if(current === 4) $('replay').focus(); } });
  $('pause').addEventListener('click', () => {
    paused = !paused; document.body.classList.toggle('is-paused', paused); $('pause').textContent = paused ? '▷' : 'Ⅱ';
    $('pause').setAttribute('aria-label', paused ? 'Continuar dedicatoria' : 'Pausar dedicatoria');
  });
  $('replay').addEventListener('click', () => {
    paused = false; document.body.classList.remove('is-paused'); $('pause').textContent = 'Ⅱ'; $('pause').setAttribute('aria-label', 'Pausar dedicatoria'); show(0); $('pause').focus();
  });
  $('sound').addEventListener('click', async () => {
    try {
      if (!audio) { const Ctx = window.AudioContext || window.webkitAudioContext; if (!Ctx) return; audio = new Ctx(); }
      sound = !sound;
      if (sound) { await audio.resume(); nextNote = 0; } else await audio.suspend();
      $('sound').setAttribute('aria-pressed', String(sound));
      $('sound').setAttribute('aria-label', sound ? 'Desactivar sonido' : 'Activar sonido');
    } catch { sound = false; $('sound').setAttribute('aria-pressed','false'); $('sound').setAttribute('aria-label','Activar sonido'); }
  });
  let note = 0;
  function music(time) {
    if (!sound || !audio || time < nextNote) return;
    nextNote = time + 850;
    const melody = [261.63,329.63,392,493.88,440,392,329.63,293.66];
    const osc = audio.createOscillator(), gain = audio.createGain();
    const t = audio.currentTime; osc.frequency.value = melody[note++ % melody.length];
    gain.gain.setValueAtTime(0,t); gain.gain.linearRampToValueAtTime(.045,t+.035); gain.gain.exponentialRampToValueAtTime(.0001,t+2.5);
    osc.connect(gain); gain.connect(audio.destination); osc.start(t); osc.stop(t+2.6);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); };
  }
  const canvas = $('weather'), ctx = canvas.getContext('2d');
  let w = 0, h = 0, motionTime = 0;
  const petals = Array.from({length:26}, () => ({x:Math.random(),y:Math.random(),z:.45+Math.random()*.55,phase:Math.random()*Math.PI*2}));
  const particles = Array.from({length:135}, () => ({x:Math.random(), y:Math.random(), z:.3+Math.random()*.7, phase:Math.random()*6.28}));
  function resize() { w = innerWidth; h = innerHeight; const dpr = Math.min(devicePixelRatio || 1,2); canvas.width = w*dpr; canvas.height = h*dpr; ctx?.setTransform(dpr,0,0,dpr,0,0); }
  addEventListener('resize',resize); resize();
  function draw(dt,time) {
    if (!ctx) return;
    ctx.clearRect(0,0,w,h);
    const mode = document.body.dataset.scene;
    if (!reduced && !paused) motionTime += dt;
    time = motionTime;
    for (const p of particles) {
      const step = reduced || paused ? 0 : dt/1000;
      let vx = .008, vy = -.014;
      if(mode==='rain'){vx=-.12;vy=.65;} else if(mode==='snow'){vx=.018+Math.sin(time/2000+p.phase)*.025;vy=.065*p.z;} else if(mode==='sand'){vx=.5*p.z;vy=.035*Math.sin(p.phase+time/800);}
      p.x=(p.x+vx*step+1)%1; p.y=(p.y+vy*step+1)%1;
      const x=p.x*w,y=p.y*h;
      ctx.beginPath();
      if(mode==='rain') {ctx.strokeStyle=`rgba(176,206,234,${p.z*.38})`;ctx.lineWidth=p.z;ctx.moveTo(x,y);ctx.lineTo(x-5,y+22*p.z);ctx.stroke();}
      else {ctx.fillStyle=mode==='snow'?`rgba(235,245,255,${p.z*.7})`:mode==='sand'?`rgba(222,177,110,${p.z*.4})`:`rgba(245,209,126,${p.z*.45})`;ctx.ellipse(x,y,mode==='sand'?6*p.z:2*p.z,mode==='sand'?p.z:2*p.z,mode==='sand'?-.1:0,0,Math.PI*2);ctx.fill();}
    }
  }
  function drawPetals(dt) {
    if (!ctx || reduced || current < 0) return;
    const mode = document.body.dataset.scene;
    const step = paused ? 0 : dt/1000;
    for (const p of petals) {
      p.y += step * (.035 + p.z*.035);
      p.x += step * ((mode === 'sand' ? .19 : .012) + Math.sin(motionTime/1900+p.phase)*.028);
      if (p.y > 1.06) { p.y=-.08; p.x=Math.random(); }
      if (p.x > 1.08) p.x=-.08;
      ctx.save(); ctx.translate(p.x*w,p.y*h);
      ctx.rotate(p.phase+motionTime/2200*p.z);
      ctx.scale(p.z*(.45+Math.abs(Math.cos(motionTime/1600+p.phase))*.55),p.z);
      ctx.globalAlpha = mode === 'rain' || mode === 'snow' ? .38 : .72;
      const gradient=ctx.createLinearGradient(-7,-12,7,12);
      gradient.addColorStop(0,'#fff1a5'); gradient.addColorStop(.5,'#eec34f'); gradient.addColorStop(1,'#bd7824');
      ctx.fillStyle=gradient; ctx.shadowColor='#eac35b55'; ctx.shadowBlur=8;
      ctx.beginPath();ctx.moveTo(0,-13);ctx.bezierCurveTo(13,-5,10,10,0,14);ctx.bezierCurveTo(-7,5,-8,-7,0,-13);ctx.fill();
      ctx.restore();
    }
  }
  function frame(time) {
    const dt = last ? Math.min(time-last,100) : 0; last=time;
    if (!document.hidden) {
      if(current>=0 && !paused) {elapsed+=dt;if(elapsed>=scenes[current][2] && current<4) show(current+1);}
      draw(dt,time);drawPetals(dt);music(time);
    }
    requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange', () => { last=0; if(audio) {if(document.hidden) audio.suspend().catch(()=>{});else if(sound) audio.resume().catch(()=>{});} });
  requestAnimationFrame(frame);
})();
