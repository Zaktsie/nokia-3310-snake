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
    gainNode.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + (durationMs / 1000));

    osc.connect(gainNode);
    gainNode.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + (durationMs / 1000));
  }

  playBeep() {
    this.playNote(2200, 35, 'square');
  }

  playMove() {
    this.playNote(150, 15, 'triangle');
  }

  playEat() {
    this.playNote(1200, 80, 'square');
    setTimeout(() => {
      this.playNote(1800, 100, 'square');
    }, 85);
  }

  playGameOver() {
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

    const tempo = 1.3;
    const notes = [
      [1318.51, 120 * tempo],
      [1174.66, 120 * tempo],
      [739.99,  240 * tempo],
      [830.61,  240 * tempo],
      [1109.73, 120 * tempo],
      [987.77,  120 * tempo],
      [587.33,  240 * tempo],
      [659.25,  240 * tempo],
      [987.77,  120 * tempo],
      [880.00,  120 * tempo],
      [554.37,  240 * tempo],
      [659.25,  240 * tempo],
      [880.00,  480 * tempo]
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
