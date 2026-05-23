// Nokia Monophonic Synthesizer Sound Manager
class SoundManager {
  constructor() {
    this.audioCtx = null;
    this.muted = localStorage.getItem('nokia_snake_muted') === 'true';
  }

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('nokia_snake_muted', this.muted);
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  playNote(freq, durationMs, type = 'square') {
    if (this.muted) return;
    this.init();

    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

    // Give it a clicky/buzzer retro envelope (instant attack, instant decay)
    gainNode.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + (durationMs / 1000));

    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + (durationMs / 1000));
  }

  playBeep() {
    // Menu navigation tick
    this.playNote(2200, 35, 'square');
  }

  playMove() {
    // Subtle movement click
    this.playNote(150, 15, 'triangle');
  }

  playEat() {
    // Two-tone score sound
    this.playNote(1200, 80, 'square');
    setTimeout(() => {
      this.playNote(1800, 100, 'square');
    }, 85);
  }

  playGameOver() {
    // Melancholy slide down
    if (this.muted) return;
    this.init();

    const osc = this.audioCtx.createOscillator();
    const gainNode = this.audioCtx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.audioCtx.currentTime + 0.6);

    gainNode.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.6);

    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.6);
  }

  playNokiaTune() {
    if (this.muted) return;
    this.init();

    // Notes of the iconic Nokia Tune (Gran Vals snippet)
    // format: [frequency, durationMs, delayMs]
    const tempo = 1.3; // Speed multiplier
    const notes = [
      [1318.51, 120 * tempo], // E6
      [1174.66, 120 * tempo], // D6
      [739.99,  240 * tempo], // F#5
      [830.61,  240 * tempo], // G#5
      [1109.73, 120 * tempo], // C#6
      [987.77,  120 * tempo], // B5
      [587.33,  240 * tempo], // D5
      [659.25,  240 * tempo], // E5
      [987.77,  120 * tempo], // B5
      [880.00,  120 * tempo], // A5
      [554.37,  240 * tempo], // C#5
      [659.25,  240 * tempo], // E5
      [880.00,  480 * tempo]  // A5
    ];

    let currentDelay = 0;
    notes.forEach(([freq, duration]) => {
      setTimeout(() => {
        if (!this.muted) {
          this.playNote(freq, duration * 0.95, 'square');
        }
      }, currentDelay);
      currentDelay += duration;
    });
  }
}

export const soundManager = new SoundManager();
