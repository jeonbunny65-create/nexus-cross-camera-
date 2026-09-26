// Web Audio API Enterprise Sound Synthesizer (Gentle, Non-intrusive Acoustic Feedback)
class SoundController {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
    this.preset = 'standard'; // 'standard' | 'critical' | 'silence'
    this.volume = 0.3;
  }

  initContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (!muted) {
      this.playChirp(520, 680, 0.06);
    }
  }

  setPreset(preset) {
    this.preset = preset;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  playChirp(startFreq, endFreq, duration = 0.08) {
    if (this.isMuted || this.preset === 'silence') return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, this.audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(this.volume * 0.15, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  playScanPing() {
    if (this.isMuted || this.preset === 'silence' || this.preset === 'critical') return;
    this.playChirp(700, 880, 0.05);
  }

  playThreatAlert() {
    if (this.isMuted || this.preset === 'silence') return;
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(660, this.audioCtx.currentTime);
      osc.frequency.setValueAtTime(880, this.audioCtx.currentTime + 0.1);

      gain.gain.setValueAtTime(this.volume * 0.25, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.25);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  playClick() {
    this.playChirp(800, 950, 0.03);
  }
}

export const soundManager = new SoundController();
