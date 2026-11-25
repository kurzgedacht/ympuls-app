/** Tiny synthesized UI sounds via Web Audio – no audio files. */
let ctx: AudioContext | null = null;
let enabled = true;
export const setSoundEnabled = (v: boolean) => (enabled = v);

function audio() {
  if (ctx) return ctx;
  const nav = navigator as Navigator & { audioSession?: { type: string } };
  if (nav.audioSession) nav.audioSession.type = "ambient"; // respects the iPhone mute switch
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = AC ? new AC() : null;
  return ctx;
}

function tone(freq: number, at: number, dur: number, type: OscillatorType = "sine", vol = 0.12) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + at;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

const sounds = {
  tap: () => tone(660, 0, 0.05, "sine", 0.05),
  pling: () => { tone(988, 0, 0.18); tone(1319, 0.08, 0.28); },
  soft: () => { tone(330, 0, 0.16, "triangle", 0.08); tone(262, 0.1, 0.22, "triangle", 0.07); },
  save: () => { tone(784, 0, 0.1); tone(1175, 0.07, 0.16); },
  reward: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.07, 0.25, "triangle", 0.1)),
  levelup: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.09, 0.4, "triangle", 0.12)),
  beat: () => { tone(90, 0, 0.12, "sine", 0.25); tone(80, 0.16, 0.14, "sine", 0.2); },
};
export type SoundKind = keyof typeof sounds;

export function play(kind: SoundKind) {
  if (!enabled) return;
  try {
    const a = audio();
    if (a?.state === "suspended") void a.resume();
    sounds[kind]();
  } catch {
    /* sound is best effort */
  }
}
