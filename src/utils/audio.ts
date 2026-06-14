export class AudioManager {
  private static ctx: AudioContext | null = null;
  private static isMuted = false;
  private static masterVolume = 0.5;

  private static getContext(): AudioContext {
    if (!this.ctx) {
      // Handle browser autoplay policies safely
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public static setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public static getMuted(): boolean {
    return this.isMuted;
  }

  public static setVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
  }

  public static getVolume(): number {
    return this.masterVolume;
  }

  public static playClick() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(this.masterVolume * 0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.warn('Audio click failed', e);
    }
  }

  public static playWhistle() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2200, ctx.currentTime);
      // Whistle vibrato
      osc.frequency.linearRampToValueAtTime(2500, ctx.currentTime + 0.15);
      osc.frequency.linearRampToValueAtTime(2100, ctx.currentTime + 0.35);
      osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.6);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(2250, ctx.currentTime);
      osc2.frequency.linearRampToValueAtTime(2450, ctx.currentTime + 0.15);
      osc2.frequency.linearRampToValueAtTime(2050, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(this.masterVolume * 0.3, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(this.masterVolume * 0.25, ctx.currentTime + 0.1);
      // Whistle short pulses
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.61);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc2.start();
      osc.stop(ctx.currentTime + 0.61);
      osc2.stop(ctx.currentTime + 0.61);
    } catch (e) {
      console.warn('Audio whistle failed', e);
    }
  }

  public static playClaps() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const duration = 2.0;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Populate white noise
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      // Filter and envelope to represent clapping crowd stadium cheering
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + duration);
      filter.Q.value = 1.8;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(this.masterVolume * 0.45, ctx.currentTime + 0.15); // Cheer swelling
      gain.gain.exponentialRampToValueAtTime(this.masterVolume * 0.1, ctx.currentTime + 1.0);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio claps failed', e);
    }
  }

  public static playOhhh() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      const duration = 1.8;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Low frequency crowd groan filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(200, ctx.currentTime + duration);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(this.masterVolume * 0.35, ctx.currentTime + 0.1);
      gain.gain.linearRampToValueAtTime(this.masterVolume * 0.25, ctx.currentTime + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      noise.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio ohhh failed', e);
    }
  }
}
export default AudioManager;
