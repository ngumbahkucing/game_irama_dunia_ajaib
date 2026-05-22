// Interactive Web Audio Sound Synthesizer for Irama Dunia Ajaib (Magic Rhythm Stage)

class SoundManager {
  private ctx: AudioContext | null = null;
  private loopIntervalId: any = null;
  private holdOscillator: OscillatorNode | null = null;
  private holdGain: GainNode | null = null;
  public masterVolume: number = 0.5;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Visual/tap chimes
  public playTap() {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      // Pleasant bright bell-like frequency
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.15);
      
      gain.gain.setValueAtTime(this.masterVolume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {
      console.warn('Audio play failed:', e);
    }
  }

  public playFlick() {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      // Sweeping wind / swoosh sound using an oscillator sweep and white-noise approximation
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1500, now + 0.18);

      gain.gain.setValueAtTime(this.masterVolume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      console.warn('Audio play failed:', e);
    }
  }

  public startHoldSound() {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;

      if (this.holdOscillator) {
        this.stopHoldSound();
      }

      this.holdOscillator = ctx.createOscillator();
      this.holdGain = ctx.createGain();

      this.holdOscillator.type = 'sawtooth';
      this.holdOscillator.frequency.value = 330; // Pleasant steady E note

      // Low pass filter to make sawdust warmth
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 700;

      this.holdGain.gain.setValueAtTime(this.masterVolume * 0.15, now);

      this.holdOscillator.connect(filter);
      filter.connect(this.holdGain);
      this.holdGain.connect(ctx.destination);

      this.holdOscillator.start(now);
    } catch (e) {
      console.warn('Audio hold start failed:', e);
    }
  }

  public stopHoldSound() {
    try {
      if (this.holdOscillator && this.holdGain && this.ctx) {
        const now = this.ctx.currentTime;
        this.holdGain.gain.cancelScheduledValues(now);
        this.holdGain.gain.setValueAtTime(this.holdGain.gain.value, now);
        this.holdGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        
        const tempOsc = this.holdOscillator;
        setTimeout(() => {
          try {
            tempOsc.stop();
          } catch(e) {}
        }, 100);

        this.holdOscillator = null;
        this.holdGain = null;
      }
    } catch (e) {
      console.warn('Audio hold stop failed:', e);
    }
  }

  public playChopClick() {
    try {
      const ctx = this.initCtx();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523, now); // C5
      gain.gain.setValueAtTime(this.masterVolume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch(e) {}
  }

  public playSuccessCelebration() {
    try {
      const ctx = this.initCtx();
      let now = ctx.currentTime;
      const tones = [523.25, 659.25, 783.99, 1046.50]; // Beautiful C-Major Arpeggio (C5 -> E5 -> G5 -> C6)
      
      tones.forEach((freq, idx) => {
        const time = now + idx * 0.1;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(this.masterVolume * 0.25, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(time);
        osc.stop(time + 0.42);
      });
    } catch(e) {}
  }

  public playGachaReveal() {
    try {
      const ctx = this.initCtx();
      let now = ctx.currentTime;
      const tones = [440, 554, 659, 880, 1109, 1318]; // A major magic scale
      
      tones.forEach((freq, idx) => {
        const time = now + idx * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        
        filter.type = 'peaking';
        filter.Q.value = 8;
        filter.frequency.setValueAtTime(freq, time);
        
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(this.masterVolume * 0.2, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(time);
        osc.stop(time + 0.4);
      });
    } catch(e) {}
  }

  // Synthesized live beat sequencer loop
  // Plays a dynamic backing track corresponding to the selected song
  public startBackgroundMusicLoop(bpm: number, primaryToneHz: number, onBeat: (beatIndex: number) => void) {
    try {
      const ctx = this.initCtx();
      this.stopBackgroundMusicLoop();
      
      const intervalMs = (60 / bpm) * 1000 / 2; // Eighth notes (8 beats per bar)
      let beatCount = 0;
      
      // Cheerful cord progression generator for backing harmonies:
      // Chord progressions on typical scales (I - V - vi - IV)
      // Base root: primaryToneHz (e.g. 261.63 Hz = Middle C)
      const chordRoots = [1.0, 1.5, 1.66, 1.33]; // C, G, Am, F factor scale

      const playDrumBeat = (time: number, isQuarter: boolean, isFirstOfBar: boolean) => {
        // Kick drum synthesis
        const kickOsc = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(120, time);
        kickOsc.frequency.exponentialRampToValueAtTime(0.01, time + 0.15);
        
        kickGain.gain.setValueAtTime(isFirstOfBar ? this.masterVolume * 0.35 : (isQuarter ? this.masterVolume * 0.25 : 0), time);
        kickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
        
        kickOsc.connect(kickGain);
        kickGain.connect(ctx.destination);
        kickOsc.start(time);
        kickOsc.stop(time + 0.16);

        // Hi-Hat noise simulation
        if (!isFirstOfBar && !isQuarter) {
          const hatOsc = ctx.createOscillator();
          const hatGain = ctx.createGain();
          hatOsc.type = 'triangle'; // pseudo high frequency chirp as simple hi-hat
          hatOsc.frequency.setValueAtTime(9000, time);
          
          hatGain.gain.setValueAtTime(this.masterVolume * 0.08, time);
          hatGain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
          
          hatOsc.connect(hatGain);
          hatGain.connect(ctx.destination);
          hatOsc.start(time);
          hatOsc.stop(time + 0.05);
        }
      };

      const playSynthAccompaniment = (time: number, beatIndex: number) => {
        // Chord progression switches every 8 beats (1 bar)
        const chordIndex = Math.floor((beatIndex / 8) % 4);
        const factor = chordRoots[chordIndex];
        const baseFreq = primaryToneHz * factor;

        // Create a bouncy arpeggio
        // Beats 0, 2, 4, 6: root
        // Beats 1, 3, 5, 7: 3rd or 5th note in the scale
        let scaleNote = baseFreq;
        const subBeat = beatIndex % 8;
        if (subBeat === 1 || subBeat === 5) scaleNote = baseFreq * 1.2; // Minor or major third approximately
        else if (subBeat === 3 || subBeat === 7) scaleNote = baseFreq * 1.5; // Perfect 5th
        else if (subBeat === 4) scaleNote = baseFreq * 2.0; // Octave

        const noteOsc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        
        // Triangle is cute, soft, and suitable for nursery/kid's vibe!
        noteOsc.type = 'triangle';
        noteOsc.frequency.setValueAtTime(scaleNote, time);
        
        // Small glide/vibrato
        noteOsc.frequency.linearRampToValueAtTime(scaleNote * 1.005, time + 0.1);

        noteGain.gain.setValueAtTime(this.masterVolume * 0.12, time);
        noteGain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
        
        noteOsc.connect(noteGain);
        noteGain.connect(ctx.destination);
        noteOsc.start(time);
        noteOsc.stop(time + 0.25);
      };

      const tick = () => {
        const now = ctx.currentTime;
        const isFirstOfBar = (beatCount % 8 === 0);
        const isQuarter = (beatCount % 2 === 0);

        playDrumBeat(now, isQuarter, isFirstOfBar);
        playSynthAccompaniment(now, beatCount);

        // Notify UI to flash lines/notes
        onBeat(beatCount);
        
        beatCount++;
      };

      // Play immediate first beat
      tick();
      this.loopIntervalId = setInterval(tick, intervalMs);
    } catch(e) {
      console.error('Song loop failed to start:', e);
    }
  }

  public stopBackgroundMusicLoop() {
    if (this.loopIntervalId) {
      clearInterval(this.loopIntervalId);
      this.loopIntervalId = null;
    }
    this.stopHoldSound();
  }
}

export const audio = new SoundManager();
