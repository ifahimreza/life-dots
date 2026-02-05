let audioContext: AudioContext | null = null;
let isUnlocked = false;
let lastPlayTime = 0;

function getAudioContext() {
  if (audioContext) return audioContext;
  const AudioCtx = window.AudioContext || (window as typeof window & {webkitAudioContext?: typeof AudioContext}).webkitAudioContext;
  audioContext = AudioCtx ? new AudioCtx() : null;
  return audioContext;
}

export function unlockAudio() {
  if (typeof window === "undefined") return;
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  isUnlocked = true;
}

export function playHoverSound() {
  if (typeof window === "undefined") return;
  const ctx = getAudioContext();
  if (!ctx || !isUnlocked) return;

  const now = ctx.currentTime;
  if (now - lastPlayTime < 0.06) return;
  lastPlayTime = now;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(720, now);
  osc.frequency.exponentialRampToValueAtTime(980, now + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.12);

  osc.onended = () => {
    osc.disconnect();
    gain.disconnect();
  };
}
