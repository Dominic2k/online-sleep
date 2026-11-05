import { SoundTrackId } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMasterMuted: boolean = false;
  private masterGain: GainNode | null = null;

  // Track gain nodes
  private trackGains: Partial<Record<SoundTrackId, GainNode>> = {};
  private activeIntervals: number[] = [];
  private isRunning: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlock = () => {
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      };
      window.addEventListener('touchstart', unlock, { passive: true });
      window.addEventListener('click', unlock, { passive: true });
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      // Increased master headroom from 0.85 to 0.95
      this.masterGain.gain.setValueAtTime(0.95, this.ctx.currentTime);
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

    // 4. Forest / Crickets & Night Wind Synthesizer
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
        // Boosted track headroom from 0.4 to 0.85 for rich, audible ambiance
        const targetGain = (vol / 100) * 0.85;
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setTargetAtTime(targetGain, now, 0.08);
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

    // Pink-ish noise algorithm with improved low-mid density
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 4.0; // boosted noise gain
    }
    return buffer;
  }

  private initRainTrack(initialVol: number) {
    if (!this.ctx || !this.masterGain) return;
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = (initialVol / 100) * 0.85;
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
    filter.frequency.value = 1300;

    source.connect(filter);
    filter.connect(gainNode);
    source.start();
  }

  private initWavesTrack(initialVol: number) {
    if (!this.ctx || !this.masterGain) return;
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = (initialVol / 100) * 0.85;
    gainNode.connect(this.masterGain);
    this.trackGains.waves = gainNode;

    const noiseBuffer = this.createNoiseBuffer(6);
    if (!noiseBuffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 520;

    // Wave swell gain
    const swellGain = this.ctx.createGain();
    swellGain.gain.value = 0.45;

    source.connect(filter);
    filter.connect(swellGain);
    swellGain.connect(gainNode);
    source.start();

    // Modulate wave surge every 6.5 seconds
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.15;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.4;
    lfo.connect(lfoGain);
    lfoGain.connect(swellGain.gain);
    lfo.start();
  }

  private initCampfireTrack(initialVol: number) {
    if (!this.ctx || !this.masterGain) return;
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = (initialVol / 100) * 0.85;
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
      lowFilter.frequency.value = 260;
      source.connect(lowFilter);
      lowFilter.connect(gainNode);
      source.start();
    }

    // Occasional crackle / pops
    const interval = window.setInterval(() => {
      if (!this.ctx || !this.trackGains.campfire) return;
      if (Math.random() > 0.35) {
        this.playPop(gainNode);
      }
    }, 240);
    this.activeIntervals.push(interval);
  }

  private playPop(targetNode: GainNode) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(650 + Math.random() * 900, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

    gain.gain.setValueAtTime(0.12 * (Math.random() + 0.6), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(targetNode);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // --- 4. FOREST: CRICKETS + NIGHT WIND RUSTLE ---
  private initForestTrack(initialVol: number) {
    if (!this.ctx || !this.masterGain) return;
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = (initialVol / 100) * 0.85;
    gainNode.connect(this.masterGain);
    this.trackGains.forest = gainNode;

    // A. Soothing Night Wind (Gió đêm xào xạc dịu êm qua tán lá)
    const windBuffer = this.createNoiseBuffer(5);
    if (windBuffer) {
      const windSource = this.ctx.createBufferSource();
      windSource.buffer = windBuffer;
      windSource.loop = true;

      const windFilter = this.ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.value = 380;
      windFilter.Q.value = 1.2;

      const windSwell = this.ctx.createGain();
      windSwell.gain.value = 0.22;

      // LFO for breathing wind swells
      const windLfo = this.ctx.createOscillator();
      windLfo.type = 'sine';
      windLfo.frequency.value = 0.09; // slow ~11 second breeze cycle
      const windLfoGain = this.ctx.createGain();
      windLfoGain.gain.value = 0.16;
      windLfo.connect(windLfoGain);
      windLfoGain.connect(windSwell.gain);
      windLfo.start();

      windSource.connect(windFilter);
      windFilter.connect(windSwell);
      windSwell.connect(gainNode);
      windSource.start();
    }

    // B. Periodic Lively Cricket Chirps (Dế đêm rả rích)
    const interval = window.setInterval(() => {
      if (!this.ctx || !this.trackGains.forest) return;
      if (Math.random() > 0.2) {
        this.playCricketChirp(gainNode);
      }
    }, 1200);
    this.activeIntervals.push(interval);
  }

  private playCricketChirp(targetNode: GainNode) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Natural cricket fundamental freq with subtle variation
    const baseFreq = 4400 + Math.random() * 600;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);

    // 3 distinct crisp micro-chirps (trill pattern)
    // Boosted volume from 0.03 to 0.09
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.02);
    gain.gain.linearRampToValueAtTime(0.002, now + 0.04);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.06);
    gain.gain.linearRampToValueAtTime(0.002, now + 0.08);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.10);
    gain.gain.linearRampToValueAtTime(0.0001, now + 0.13);

    osc.connect(gain);
    gain.connect(targetNode);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  // --- 5. CLOCK: CRISP MECHANICAL TICK-TOCK ---
  private initClockTrack(initialVol: number) {
    if (!this.ctx || !this.masterGain) return;
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = (initialVol / 100) * 0.85;
    gainNode.connect(this.masterGain);
    this.trackGains.clock = gainNode;

    let tick = true;
    const interval = window.setInterval(() => {
      if (!this.ctx || !this.trackGains.clock) return;
      const now = this.ctx.currentTime;

      // 1. Resonant wood/metal pendulum body (tick vs tock)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(tick ? 780 : 620, now);

      // Boosted gain from 0.04 to 0.16 for satisfying, soothing clock rhythm
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      osc.connect(gain);
      gain.connect(gainNode);
      osc.start(now);
      osc.stop(now + 0.05);

      // 2. High-frequency escapement micro-click (adds realism)
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(1900, now);
      clickGain.gain.setValueAtTime(0.05, now);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);
      clickOsc.connect(clickGain);
      clickGain.connect(gainNode);
      clickOsc.start(now);
      clickOsc.stop(now + 0.02);

      tick = !tick;
    }, 1000);
    this.activeIntervals.push(interval);
  }

  // --- 6. DISTANT THUNDER: DEEP SUB-RUMBLE & ROLLING BOOM ---
  private initThunderTrack(initialVol: number) {
    if (!this.ctx || !this.masterGain) return;
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = (initialVol / 100) * 0.85;
    gainNode.connect(this.masterGain);
    this.trackGains.thunder = gainNode;

    // Distant thunder every ~11 seconds with 0.45 chance
    const interval = window.setInterval(() => {
      if (!this.ctx || !this.trackGains.thunder) return;
      if (Math.random() > 0.3) {
        this.playDistantThunder(gainNode);
      }
    }, 11000);
    this.activeIntervals.push(interval);
  }

  private playDistantThunder(targetNode: GainNode) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const noiseBuffer = this.createNoiseBuffer(5);
    if (!noiseBuffer) return;

    // 1. Noise boom source
    const source = this.ctx.createBufferSource();
    source.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(160, now);
    filter.frequency.exponentialRampToValueAtTime(50, now + 4.0);

    const gain = this.ctx.createGain();
    // Substantially boosted thunder volume from 0.18 to 0.52
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.52, now + 0.7);
    gain.gain.linearRampToValueAtTime(0.35, now + 1.8);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 4.5);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(targetNode);
    source.start(now);
    source.stop(now + 4.6);

    // 2. Ultra-low frequency sub oscillator (rumble you can feel in your chest)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(55, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 3.8);

    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.35, now + 0.8);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.9);

    subOsc.connect(subGain);
    subGain.connect(targetNode);
    subOsc.start(now);
    subOsc.stop(now + 4.0);
  }

  // --- 7. LO-FI CHORDS: WARM VINTAGE RHODES 7TH HARMONIES ---
  private initLofiTrack(initialVol: number) {
    if (!this.ctx || !this.masterGain) return;
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = (initialVol / 100) * 0.85;
    gainNode.connect(this.masterGain);
    this.trackGains.lofi = gainNode;

    // Dreamy Lo-Fi 7th & 9th Chords sequence
    // Cmaj9 -> Am9 -> Fmaj7 -> G13
    const chordList = [
      [130.81, 261.63, 329.63, 392.00, 493.88], // Cmaj9
      [110.00, 220.00, 261.63, 329.63, 392.00], // Am9
      [87.31, 174.61, 220.00, 261.63, 329.63],  // Fmaj7
      [98.00, 196.00, 261.63, 293.66, 349.23],  // G7sus4 / G13
    ];
    let chordIdx = 0;

    const playNextChord = () => {
      if (!this.ctx || !this.trackGains.lofi) return;
      const freqs = chordList[chordIdx % chordList.length];
      chordIdx++;
      const now = this.ctx.currentTime;
      const duration = 4.2;

      freqs.forEach((freq, i) => {
        if (!this.ctx) return;
        // Dual oscillator per note for warm vintage Rhodes detune
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(freq, now);

        osc2.type = 'sine';
        // Subtle 1.2Hz warm chorus detune
        osc2.frequency.setValueAtTime(freq + 0.6, now);

        // Warm lowpass filter to emulate analog cassette tape / lo-fi vinyl
        const tapeFilter = this.ctx.createBiquadFilter();
        tapeFilter.type = 'lowpass';
        tapeFilter.frequency.value = 1600;

        // Boosted chord gain from 0.035 to 0.12 (with slight velocity curve per note)
        const notePeak = 0.11 / Math.sqrt(freqs.length);
        noteGain.gain.setValueAtTime(0.0001, now);
        // Slight arpeggiation delay per note (15ms)
        const noteStart = now + i * 0.015;
        noteGain.gain.linearRampToValueAtTime(notePeak, noteStart + 0.35);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + duration);

        osc1.connect(tapeFilter);
        osc2.connect(tapeFilter);
        tapeFilter.connect(noteGain);
        noteGain.connect(gainNode);

        osc1.start(noteStart);
        osc2.start(noteStart);
        osc1.stop(noteStart + duration + 0.1);
        osc2.stop(noteStart + duration + 0.1);
      });
    };

    playNextChord();
    const interval = window.setInterval(playNextChord, 4400);
    this.activeIntervals.push(interval);
  }

  // --- 8. WHITE NOISE / DEEP CALM HUM ---
  private initWhiteNoiseTrack(initialVol: number) {
    if (!this.ctx || !this.masterGain) return;
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = (initialVol / 100) * 0.85;
    gainNode.connect(this.masterGain);
    this.trackGains.whitenoise = gainNode;

    const noiseBuffer = this.createNoiseBuffer(5);
    if (!noiseBuffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 380;
    filter.Q.value = 0.85;

    source.connect(filter);
    filter.connect(gainNode);
    source.start();
  }

  public toggleMute(): boolean {
    if (!this.masterGain || !this.ctx) return false;
    this.isMasterMuted = !this.isMasterMuted;
    this.masterGain.gain.setValueAtTime(this.isMasterMuted ? 0 : 0.95, this.ctx.currentTime);
    return this.isMasterMuted;
  }
}

export const audioEngine = new SoundEngine();
