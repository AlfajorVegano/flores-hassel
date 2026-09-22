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
  const params = new URLSearchParams(location.search);
  // Los códigos separan recuerdos locales; no son contraseñas.
  const giftId = (params.get('g') || '861405297314').replace(/[^a-zA-Z0-9_-]/g, '').slice(0,80) || '861405297314';
  const storageKey = `hassel:gift:v1:${giftId}`;
  let memory = null;
  try {
    if (params.get('reset') === '1') {
      localStorage.removeItem(storageKey);
      params.delete('reset');
      history.replaceState(null, '', location.pathname + '?' + params.toString());
    }
    const value = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (value && Number.isInteger(value.scene) && value.scene >= 0 && value.scene < scenes.length) memory = value;
  } catch { /* El regalo funciona aunque el navegador no permita guardar datos. */ }
  const motionQuery = params.get('motion');
  let reduced = motionQuery === 'off' || (motionQuery !== 'full' && memory?.reduced === true);
  let current = -1, elapsed = 0, paused = false, last = 0, audio = null, sound = false, nextNote = 0;
  function saveMemory() {
    if (current < 0) return;
    memory = {scene:current, elapsed:Math.min(elapsed,30000), reduced, updatedAt:Date.now()};
    try { localStorage.setItem(storageKey, JSON.stringify(memory)); } catch { /* Sin almacenamiento. */ }
  }
  function syncMotion() {
    document.documentElement.dataset.motion = reduced ? 'off' : 'full';
    $('motion').setAttribute('aria-pressed', String(!reduced));
    $('motion').textContent = reduced ? 'Movimiento suave' : 'Full motion';
  }
  syncMotion();
  $('motion').addEventListener('click', () => { reduced = !reduced; syncMotion(); saveMemory(); });
  if (giftId === 'alexis-test-2026') $('visitNote').textContent = 'Vista de prueba de Alexis';
  if (memory) {
    $('visitNote').textContent = giftId === 'alexis-test-2026' ? 'Tu prueba quedó guardada.' : 'Qué bonito tenerte de vuelta, Hassel.';
    $('open').textContent = memory.scene === 4 ? 'Volver a mis flores ✦' : 'Continuar mi regalo →';
    $('restart').hidden = false;
  }
  function begin(fromStart = false) {
    if (!soundChosen) setSound(true);
    const saved = memory;
    $('welcome').hidden = true; $('story').hidden = false;
    show(!fromStart && saved ? saved.scene : 0);
    if (!fromStart && saved && current < 4) elapsed = Math.max(0, Math.min(Number(saved.elapsed) || 0, scenes[current][2]-1000));
    saveMemory(); $('pause').focus();
  }
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
    saveMemory();
  }
  $('open').addEventListener('click', () => begin());
  $('restart').addEventListener('click', () => begin(true));
  $('next').addEventListener('click', () => { if (current < 4) { show(current + 1); if(current === 4) $('replay').focus(); } });
  $('pause').addEventListener('click', () => {
    paused = !paused; document.body.classList.toggle('is-paused', paused); $('pause').textContent = paused ? '▷ Continuar' : 'Ⅱ Pausar';
    $('pause').setAttribute('aria-label', paused ? 'Continuar dedicatoria' : 'Pausar dedicatoria');
  });
  $('replay').addEventListener('click', () => {
    paused = false; document.body.classList.remove('is-paused'); $('pause').textContent = 'Ⅱ Pausar'; $('pause').setAttribute('aria-label', 'Pausar dedicatoria'); show(0); $('pause').focus();
  });
  let master = null, soundChosen = false, note = 0;
  let volume = .8;
  function syncSound() {
    $('sound').setAttribute('aria-pressed', String(sound));
    $('sound').setAttribute('aria-label', sound ? 'Silenciar música' : 'Activar música');
    $('sound').textContent = sound ? '♫ Música: sí' : '♫ Música: no';
  }
  async function setSound(enabled) {
    sound = enabled;
    syncSound();
    try {
      if (enabled && !audio) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) throw new Error('Audio no disponible');
        audio = new Ctx();
        master = audio.createGain();
        const compressor = audio.createDynamicsCompressor();
        compressor.threshold.value = -16; compressor.knee.value = 18;
        compressor.ratio.value = 4; compressor.attack.value = .005; compressor.release.value = .25;
        master.gain.value = volume;
        master.connect(compressor); compressor.connect(audio.destination);
      }
      if (!audio) return;
      if (enabled) { await audio.resume(); nextNote = audio.currentTime + .04; }
      else await audio.suspend();
    } catch {
      sound = false; syncSound();
      $('sound').textContent = '♫ Reintentar música';
    }
  }
  $('sound').addEventListener('click', () => { soundChosen = true; setSound(!sound); });
  $('volume').addEventListener('input', () => {
    volume = Number($('volume').value) / 100;
    $('volumeValue').textContent = `${Math.round(volume*100)}%`;
    if(master) master.gain.setTargetAtTime(volume, audio.currentTime, .04);
    if(volume > 0 && !sound) { soundChosen = true; setSound(true); }
  });
  syncSound();
  function voice(frequency, at, duration, level, type = 'triangle') {
    const osc = audio.createOscillator(), env = audio.createGain();
    osc.type = type; osc.frequency.value = frequency;
    env.gain.setValueAtTime(0, at);
    env.gain.linearRampToValueAtTime(level, at + .018);
    env.gain.exponentialRampToValueAtTime(.001, at + duration);
    osc.connect(env); env.connect(master);
    osc.start(at); osc.stop(at + duration + .04);
    osc.onended = () => { osc.disconnect(); env.disconnect(); };
  }
  // Composición original en cuatro acordes, con melodía y arpegios.
  const chords = [[261.63,329.63,392],[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66]];
  const melody = [659.25,587.33,523.25,392,523.25,587.33,659.25,783.99,
    659.25,523.25,440,523.25,659.25,587.33,523.25,440,
    523.25,698.46,659.25,523.25,440,523.25,587.33,659.25,
    587.33,493.88,392,493.88,587.33,659.25,587.33,523.25];
  function music() {
    if (!sound || !audio || audio.state !== 'running') return;
    const now = audio.currentTime;
    if (nextNote < now - .5) nextNote = now + .04;
    while (nextNote < now + .15) {
      const chord = chords[Math.floor(note/8)%4];
      voice(melody[note%melody.length], nextNote, 1.15, .24);
      voice(melody[note%melody.length]*2, nextNote, .55, .025, 'sine');
      voice(chord[note%3], nextNote, 1.5, .105);
      if(note%4 === 0) voice(chord[0]/2, nextNote, 2.2, .15, 'sine');
      note++; nextNote += .46;
    }
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
  setInterval(saveMemory, 1000);
  addEventListener('pagehide', saveMemory);
  document.addEventListener('visibilitychange', () => { saveMemory(); last=0; if(audio) {if(document.hidden) audio.suspend().catch(()=>{});else if(sound) audio.resume().catch(()=>{});} });
  requestAnimationFrame(frame);
})();
