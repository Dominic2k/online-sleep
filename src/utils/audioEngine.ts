import { SoundTrackId } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMasterMuted: boolean = false;
  private masterGain: GainNode | null = null;

  // Track gain nodes
  private trackGains: Partial<Record<SoundTrackId, GainNode>> = {};
  private activeIntervals: number[] = [];
  private isRunning: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public startEngine(volumes: Record<SoundTrackId, number>) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.isRunning) {
      this.updateVolumes(volumes);
      return;
    }

    this.isRunning = true;

    // 1. Rain Synthesizer
    this.initRainTrack(volumes.rain || 0);

    // 2. Waves Synthesizer
    this.initWavesTrack(volumes.waves || 0);

    // 3. Campfire Synthesizer
    this.initCampfireTrack(volumes.campfire || 0);

    // 4. Forest / Crickets Synthesizer
    this.initForestTrack(volumes.forest || 0);

    // 5. Clock Ticking Synthesizer
    this.initClockTrack(volumes.clock || 0);

    // 6. Thunder Synthesizer
    this.initThunderTrack(volumes.thunder || 0);

    // 7. Lo-Fi Chords Synthesizer
    this.initLofiTrack(volumes.lofi || 0);

    // 8. White Noise / Deep Hum
    this.initWhiteNoiseTrack(volumes.whitenoise || 0);
  }

  public updateVolumes(volumes: Record<SoundTrackId, number>) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    Object.entries(volumes).forEach(([track, vol]) => {
      const gainNode = this.trackGains[track as SoundTrackId];
      if (gainNode) {
        const targetGain = (vol / 100) * 0.4;
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setTargetAtTime(targetGain, now, 0.1);
      }
    });
  }

  public stopEngine() {
    this.activeIntervals.forEach(id => window.clearInterval(id));
    this.activeIntervals = [];

    if (this.ctx) {
      try {
        this.ctx.close();
      } catch {
        // ignore
      }
      this.ctx = null;
      this.masterGain = null;
      this.trackGains = {};
      this.isRunning = false;
    }
  }

  // --- Track Synthesizers ---

  private createNoiseBuffer(duration = 5): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    // Pink-ish noise algorithm
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // gain boost
    }
    return buffer;
  }

  private initRainTrack(initialVol: number) {
    if (!this.ctx || !this.masterGain) return;
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = (initialVol / 100) * 0.4;
    gainNode.connect(this.masterGain);
    this.trackGains.rain = gainNode;

    const noiseBuffer = this.createNoiseBuffer(5);
    if (!noiseBuffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Lowpass filter for cozy gentle rain
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1100;

    source.connect(filter);
    filter.connect(gainNode);
    source.start();
  }

  private initWavesTrack(initialVol: number) {
    if (!this.ctx || !this.masterGain) return;
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = (initialVol / 100) * 0.4;
    gainNode.connect(this.masterGain);
    this.trackGains.waves = gainNode;

    const noiseBuffer = this.createNoiseBuffer(6);
    if (!noiseBuffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 450;

    // Wave swell gain
    const swellGain = this.ctx.createGain();
    swellGain.gain.value = 0.3;

    source.connect(filter);
    filter.connect(swellGain);
    swellGain.connect(gainNode);
    source.start();

    // Modulate wave surge every 7 seconds
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.14; // ~7 second wave cycle
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.35;
    lfo.connect(lfoGain);
    lfoGain.connect(swellGain.gain);
    lfo.start();
  }

  private initCampfireTrack(initialVol: number) {
    if (!this.ctx || !this.masterGain) return;
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = (initialVol / 100) * 0.4;
    gainNode.connect(this.masterGain);
    this.trackGains.campfire = gainNode;

    // Low rumble of fire
    const noiseBuffer = this.createNoiseBuffer(3);
    if (noiseBuffer) {
      const source = this.ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;
      const lowFilter = this.ctx.createBiquadFilter();
      lowFilter.type = 'lowpass';
      lowFilter.frequency.value = 220;
      source.connect(lowFilter);
      lowFilter.connect(gainNode);
      source.start();
    }

    // Occasional crackle / pops
    const interval = window.setInterval(() => {
      if (!this.ctx || !this.trackGains.campfire) return;
      if (Math.random() > 0.4) {
        this.playPop(gainNode);
      }
    }, 280);
    this.activeIntervals.push(interval);
  }

  private playPop(targetNode: GainNode) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600 + Math.random() * 800, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

    gain.gain.setValueAtTime(0.08 * (Math.random() + 0.5), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(targetNode);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  private initForestTrack(initialVol: number) {
    if (!this.ctx || !this.masterGain) return;
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = (initialVol / 100) * 0.4;
    gainNode.connect(this.masterGain);
    this.trackGains.forest = gainNode;

    // Periodic gentle cricket chirps
    const interval = window.setInterval(() => {
      if (!this.ctx || !this.trackGains.forest) return;
      if (Math.random() > 0.3) {
        this.playCricketChirp(gainNode);
      }
    }, 1800);
    this.activeIntervals.push(interval);
  }

  private playCricketChirp(targetNode: GainNode) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(4600, now);

    // 3 rapid micro pulses
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.03, now + 0.02);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.04);
    gain.gain.linearRampToValueAtTime(0.03, now + 0.06);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(targetNode);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  private initClockTrack(initialVol: number) {
    if (!this.ctx || !this.masterGain) return;
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = (initialVol / 100) * 0.4;
    gainNode.connect(this.masterGain);
    this.trackGains.clock = gainNode;

    let tick = true;
    const interval = window.setInterval(() => {
      if (!this.ctx || !this.trackGains.clock) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(tick ? 800 : 640, now);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(gain);
      gain.connect(gainNode);
      osc.start(now);
      osc.stop(now + 0.04);
      tick = !tick;
    }, 1000);
    this.activeIntervals.push(interval);
  }

  private initThunderTrack(initialVol: number) {
    if (!this.ctx || !this.masterGain) return;
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = (initialVol / 100) * 0.4;
    gainNode.connect(this.masterGain);
    this.trackGains.thunder = gainNode;

    // Distant thunder every ~18 seconds randomly
    const interval = window.setInterval(() => {
      if (!this.ctx || !this.trackGains.thunder) return;
      if (Math.random() > 0.5) {
        this.playDistantThunder(gainNode);
      }
    }, 16000);
    this.activeIntervals.push(interval);
  }

  private playDistantThunder(targetNode: GainNode) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const noiseBuffer = this.createNoiseBuffer(4);
    if (!noiseBuffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(110, now);
    filter.frequency.exponentialRampToValueAtTime(45, now + 3.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.6);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(targetNode);
    source.start(now);
    source.stop(now + 4);
  }

  private initLofiTrack(initialVol: number) {
    if (!this.ctx || !this.masterGain) return;
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = (initialVol / 100) * 0.4;
    gainNode.connect(this.masterGain);
    this.trackGains.lofi = gainNode;

    // Dreamy Lo-Fi 7th Chords sequence
    // Cmaj7 (C4, E4, G4, B4) -> Am7 (A3, C4, E4, G4) -> Fmaj7 (F3, A3, C4, E4) -> G7sus4
    const chordList = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 261.63, 293.66, 349.23], // G7sus4
    ];
    let chordIdx = 0;

    const playNextChord = () => {
      if (!this.ctx || !this.trackGains.lofi) return;
      const freqs = chordList[chordIdx % chordList.length];
      chordIdx++;
      const now = this.ctx.currentTime;
      const duration = 4.2;

      freqs.forEach(freq => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        // Soft slow attack and dreamy decay
        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.linearRampToValueAtTime(0.035, now + 1.2);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(noteGain);
        noteGain.connect(gainNode);
        osc.start(now);
        osc.stop(now + duration + 0.1);
      });
    };

    playNextChord();
    const interval = window.setInterval(playNextChord, 4500);
    this.activeIntervals.push(interval);
  }

  private initWhiteNoiseTrack(initialVol: number) {
    if (!this.ctx || !this.masterGain) return;
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = (initialVol / 100) * 0.4;
    gainNode.connect(this.masterGain);
    this.trackGains.whitenoise = gainNode;

    const noiseBuffer = this.createNoiseBuffer(5);
    if (!noiseBuffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 350;
    filter.Q.value = 0.8;

    source.connect(filter);
    filter.connect(gainNode);
    source.start();
  }

  public toggleMute(): boolean {
    if (!this.masterGain || !this.ctx) return false;
    this.isMasterMuted = !this.isMasterMuted;
    this.masterGain.gain.setValueAtTime(this.isMasterMuted ? 0 : 0.85, this.ctx.currentTime);
    return this.isMasterMuted;
  }
}

export const audioEngine = new SoundEngine();

