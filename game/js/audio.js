// RUNEFORGE — synthesized sound. WebAudio oscillators only, no audio files.
// Every effect is a short envelope over one or two oscillators.
let ctx = null;
let muted = false;

export function setMuted(m) { muted = m; }
export function isMuted() { return muted; }

function tone(freq, dur, type, vol, when = 0, slideTo = null) {
  if (muted) return;
  try {
    ctx ??= new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') void ctx.resume();
    const t0 = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  } catch { /* audio is decoration; never break the game */ }
}

export const sfx = {
  click() { tone(660, 0.07, 'sine', 0.12); },
  draw() { tone(520, 0.09, 'triangle', 0.12, 0, 780); },
  play() { tone(440, 0.12, 'triangle', 0.16, 0, 660); },
  forge() { tone(392, 0.1, 'square', 0.1); tone(523, 0.1, 'square', 0.1, 0.09); tone(784, 0.18, 'square', 0.12, 0.18); },
  hit() { tone(180, 0.22, 'sawtooth', 0.2, 0, 70); },
  block() { tone(240, 0.12, 'sine', 0.14, 0, 180); },
  win() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, 'triangle', 0.16, i * 0.12)); },
  lose() { [392, 330, 262, 196].forEach((f, i) => tone(f, 0.26, 'sine', 0.14, i * 0.14)); },
};
