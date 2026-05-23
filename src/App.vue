<script setup>
import { ref } from 'vue';
import PhoneWrapper from './components/PhoneWrapper.vue';
import { soundManager } from './utils/SoundManager';

const isMuted = ref(soundManager.isMuted());

const toggleGlobalMute = () => {
  isMuted.value = soundManager.toggleMute();
  soundManager.playBeep();
};
</script>

<template>
  <header>
    <h1 id="main-title">Nokia 3310 Snake</h1>
    <p class="subtitle">Play the authentic retro Snake II experience in Vue 3</p>
  </header>

  <main class="game-container" id="app-main-layout">
    <!-- Left panel: Info & Retro Nostalgia -->
    <section class="side-panel" aria-labelledby="retro-info-title">
      <h2 id="retro-info-title">Nostalgia Specs</h2>
      <p>
        The <strong>Nokia 3310</strong> is one of the most successful phones in history, selling over 126 million units worldwide after its release in <strong>September 2000</strong>.
      </p>
      <p>
        <strong>Snake II</strong> introduced mazes, wrap-around walls, insect bonuses, and multiplayer mode, making it an instant global phenomenon.
      </p>
      
      <div style="margin-top: 24px;">
        <h2 id="settings-info-title">Audio & Backlight</h2>
        <p>This clone synthesizes authentic monophonic ringtones and sound effects using the modern browser Web Audio API.</p>
        <button 
          @click="toggleGlobalMute" 
          class="mute-button"
          :aria-label="isMuted ? 'Unmute Sound' : 'Mute Sound'"
          id="btn-global-mute"
        >
          <span>{{ isMuted ? '🔇 Sound is Muted' : '🔊 Sound is Enabled' }}</span>
        </button>
      </div>
    </section>

    <!-- Center: Physical Nokia 3310 Phone -->
    <section aria-label="Nokia 3310 Gameplay Screen">
      <PhoneWrapper />
    </section>

    <!-- Right panel: Keyboard Instructions -->
    <section class="side-panel" aria-labelledby="controls-info-title">
      <h2 id="controls-info-title">Keyboard Bindings</h2>
      <p>Play using either the screen clicks or map directly from your computer keyboard:</p>
      <div class="controls-list">
        <div>
          <span>Up Arrow / W / 2</span>
          <span class="kbd-shortcut">▲ Move Up</span>
        </div>
        <div>
          <span>Down Arrow / S / 8</span>
          <span class="kbd-shortcut">▼ Move Down</span>
        </div>
        <div>
          <span>Left Arrow / A / 4</span>
          <span class="kbd-shortcut">◀ Move Left</span>
        </div>
        <div>
          <span>Right Arrow / D / 6</span>
          <span class="kbd-shortcut">▶ Move Right</span>
        </div>
        <div>
          <span>Enter / Space / 5</span>
          <span class="kbd-shortcut">↵ Action / Select</span>
        </div>
        <div>
          <span>Backspace / Esc / C</span>
          <span class="kbd-shortcut">⌫ Pause / Back</span>
        </div>
        <div>
          <span>M Key</span>
          <span class="kbd-shortcut">M Mute / Unmute</span>
        </div>
      </div>
      
      <div style="margin-top: 24px; font-size: 0.8rem; color: #9ca3af; text-align: center;">
        <p>💡 Tip: Use settings to toggle walls or increase speed from levels 1 to 9!</p>
      </div>
    </section>
  </main>

  <footer class="footer-info">
    <p>Zak Tsienyane  &copy; 2026. Built with Vue 3 & Vite.</p>
  </footer>
</template>

<style scoped>
/* Scoped app styling if any */
header {
  width: 100%;
}
</style>
