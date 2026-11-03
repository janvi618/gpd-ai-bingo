// Cereal Kingdom: music and sound effects, made live with the Web Audio API (no audio files).
let ac = null, master, music, sfx, noiseBuf, enabled = true;
let track = null, pending = null, step = 0, nextTime = 0, timer = 0;
const N = m => 440 * Math.pow(2, (m - 69) / 12);

export function initAudio(){
  if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
  try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch { ac = null; return; }
  master = ac.createGain(); master.gain.value = enabled ? 1 : 0; master.connect(ac.destination);
  const comp = ac.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 4; comp.connect(master);
  music = ac.createGain(); music.gain.value = 0.15; music.connect(comp);
  sfx = ac.createGain(); sfx.gain.value = 0.34; sfx.connect(comp);
  noiseBuf = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
  const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  timer = setInterval(schedule, 25);
}
export function setSound(on){ enabled = on; if (ac) master.gain.setTargetAtTime(on ? 1 : 0, ac.currentTime, 0.05); }
export function soundOn(){ return enabled; }
export function suspendAudio(on){ if (!ac) return; if (on) ac.suspend(); else ac.resume(); }

function tone(type, freq, t, dur, vol, dest = sfx, slide, attack = 0.006){
  const o = ac.createOscillator(), gn = ac.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
  gn.gain.setValueAtTime(0.0001, t); gn.gain.exponentialRampToValueAtTime(vol, t + attack); gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(gn).connect(dest); o.start(t); o.stop(t + dur + 0.05);
}
function hiss(t, dur, vol, dest = sfx, type = 'highpass', f0 = 1200, f1){
  const s = ac.createBufferSource(); s.buffer = noiseBuf;
  const f = ac.createBiquadFilter(); f.type = type; f.frequency.setValueAtTime(f0, t); if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + dur);
  const gn = ac.createGain(); gn.gain.setValueAtTime(vol, t); gn.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f).connect(gn).connect(dest); s.start(t, Math.random() * 0.5); s.stop(t + dur + 0.05);
}

/* ---------- music ---------- */
const TRACKS = {
  adventure: { bpm: 116, bars: [
    { ch: [60, 64, 67], b: 48, m: [72, 0, 76, 74, 72, 0, 67, 0] },
    { ch: [57, 60, 64], b: 45, m: [69, 0, 72, 71, 69, 0, 64, 0] },
    { ch: [53, 57, 60], b: 41, m: [65, 69, 72, 0, 74, 72, 69, 0] },
    { ch: [55, 59, 62], b: 43, m: [71, 0, 74, 0, 79, 77, 74, 71] },
    { ch: [60, 64, 67], b: 48, m: [76, 0, 79, 77, 76, 74, 72, 0] },
    { ch: [57, 60, 64], b: 45, m: [72, 0, 76, 74, 72, 71, 69, 0] },
    { ch: [53, 57, 60], b: 41, m: [69, 72, 77, 76, 74, 72, 69, 0] },
    { ch: [55, 59, 62], b: 43, m: [71, 74, 77, 74, 79, 0, 0, 0] }
  ] },
  boss: { bpm: 140, drive: true, bars: [
    { ch: [57, 60, 64], b: 45, m: [69, 72, 76, 72, 69, 72, 77, 76] },
    { ch: [53, 57, 60], b: 41, m: [65, 69, 72, 69, 65, 69, 74, 72] },
    { ch: [55, 59, 62], b: 43, m: [67, 71, 74, 71, 67, 71, 76, 74] },
    { ch: [52, 56, 59], b: 40, m: [64, 68, 71, 68, 76, 0, 75, 0] }
  ] },
  calm: { bpm: 92, bars: [
    { ch: [60, 64, 67], b: 48, m: [72, 0, 0, 76, 0, 0, 79, 0] },
    { ch: [53, 57, 60], b: 41, m: [77, 0, 0, 76, 0, 0, 72, 0] },
    { ch: [57, 60, 64], b: 45, m: [76, 0, 0, 74, 0, 0, 72, 0] },
    { ch: [55, 59, 62], b: 43, m: [74, 0, 0, 71, 0, 0, 67, 0] }
  ] }
};
export function playTrack(name){ if (!ac) return; if (!track) { track = TRACKS[name]; step = 0; nextTime = ac.currentTime + 0.1; } else pending = TRACKS[name]; }
export function stopMusic(){ track = null; pending = null; }
function schedule(){
  if (!ac || !track) return;
  while (nextTime < ac.currentTime + 0.12) {
    const spb = 60 / track.bpm / 2; // eighth notes
    const bar = track.bars[Math.floor(step / 8) % track.bars.length], s = step % 8, t = nextTime;
    const mel = bar.m[s];
    if (mel) tone('square', N(mel), t, spb * 1.6, 0.06, music, null, 0.01);
    tone('triangle', N(bar.ch[s % 3] + 12), t, spb * 0.9, 0.05, music);
    if (track.drive || s % 4 === 0) tone('triangle', N(bar.b), t, spb * (track.drive ? 0.9 : 1.8), 0.16, music);
    if (s % 4 === 0) tone('sine', 120, t, 0.16, 0.3, music, 45);
    if (s % 2 === 1 || track.drive) hiss(t, 0.04, track.drive ? 0.05 : 0.035, music, 'highpass', 7000);
    if (s === 4 && track.drive) hiss(t, 0.12, 0.08, music, 'bandpass', 1800);
    nextTime += spb; step++;
    if (pending && step % 8 === 0) { track = pending; pending = null; step = 0; }
  }
}

/* ---------- effects ---------- */
export function sfxPlay(name){
  if (!ac || !enabled) return;
  const t = ac.currentTime;
  switch (name) {
    case 'swing': hiss(t, 0.14, 0.25, sfx, 'bandpass', 900, 3200); break;
    case 'spin': hiss(t, 0.3, 0.3, sfx, 'bandpass', 600, 4000); tone('triangle', 500, t, 0.25, 0.08, sfx, 900); break;
    case 'hit': tone('square', 220, t, 0.08, 0.16, sfx, 90); hiss(t, 0.08, 0.3, sfx, 'lowpass', 2500); break;
    case 'pop': tone('sine', 700, t, 0.18, 0.3, sfx, 160); hiss(t, 0.12, 0.2, sfx, 'highpass', 2000); break;
    case 'coin': tone('square', N(88), t, 0.07, 0.07); tone('square', N(93), t + 0.06, 0.12, 0.07); break;
    case 'berry': [76, 79, 84].forEach((m, i) => tone('triangle', N(m), t + i * 0.05, 0.12, 0.12)); break;
    case 'level': [72, 76, 79, 84, 88].forEach((m, i) => tone('square', N(m), t + i * 0.07, 0.18, 0.08)); tone('triangle', N(60), t, 0.6, 0.12); break;
    case 'ring': [79, 83, 86, 91].forEach((m, i) => tone('triangle', N(m), t + i * 0.08, 0.5, 0.14)); hiss(t, 0.6, 0.05, sfx, 'highpass', 6000); break;
    case 'dash': hiss(t, 0.18, 0.22, sfx, 'bandpass', 2500, 600); break;
    case 'hurt': tone('sawtooth', 300, t, 0.2, 0.12, sfx, 110); break;
    case 'slam': tone('sine', 90, t, 0.5, 0.5, sfx, 30); hiss(t, 0.4, 0.35, sfx, 'lowpass', 800, 120); break;
    case 'burst': tone('sine', 180, t, 0.5, 0.4, sfx, 40); hiss(t, 0.5, 0.35, sfx, 'bandpass', 400, 5000); [72, 79, 84].forEach((m, i) => tone('square', N(m), t + i * 0.04, 0.2, 0.05)); break;
    case 'talk': tone('square', N(74 + Math.floor(Math.random() * 5)), t, 0.04, 0.035); break;
    case 'ui': tone('triangle', N(84), t, 0.08, 0.1); break;
    case 'roar': tone('sawtooth', 110, t, 1.1, 0.18, sfx, 55); tone('sawtooth', 82, t + 0.05, 1.1, 0.14, sfx, 40); hiss(t, 1.0, 0.12, sfx, 'lowpass', 600); break;
    case 'win': [72, 76, 79, 84, 79, 84, 88].forEach((m, i) => tone('square', N(m), t + i * 0.12, 0.3, 0.09)); tone('triangle', N(48), t, 1.4, 0.18); break;
    case 'boom': tone('sine', 140, t, 0.6, 0.45, sfx, 35); hiss(t, 0.6, 0.3, sfx, 'lowpass', 1200, 200); break;
  }
}
