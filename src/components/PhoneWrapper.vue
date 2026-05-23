<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Screen from './Screen.vue';
import Keypad from './Keypad.vue';
import { soundManager } from '../utils/SoundManager';

const screenRef = ref(null);
const pressedKeys = ref({});
const isBacklit = ref(true);
const isMuted = ref(soundManager.isMuted());

const toggleMute = () => {
  isMuted.value = soundManager.toggleMute();
  soundManager.playBeep();
};

const toggleBacklight = () => {
  isBacklit.value = !isBacklit.value;
};

const vibrating = ref(false);
let vibrationTimeout = null;

const handleVibrate = (ms) => {
  if (vibrationTimeout) clearTimeout(vibrationTimeout);
  vibrating.value = true;
  vibrationTimeout = setTimeout(() => {
    vibrating.value = false;
  }, ms);
};

const keyMap = {
  'ArrowUp': { action: 'UP', key: 'UP' },
  'w': { action: 'UP', key: 'UP' },
  'W': { action: 'UP', key: 'UP' },
  '2': { action: 'UP', key: '2' },
  'Numpad2': { action: 'UP', key: '2' },

  'ArrowLeft': { action: 'LEFT', key: 'LEFT' },
  'a': { action: 'LEFT', key: 'LEFT' },
  'A': { action: 'LEFT', key: 'LEFT' },
  '4': { action: 'LEFT', key: '4' },
  'Numpad4': { action: 'LEFT', key: '4' },

  'ArrowRight': { action: 'RIGHT', key: 'RIGHT' },
  'd': { action: 'RIGHT', key: 'RIGHT' },
  'D': { action: 'RIGHT', key: 'RIGHT' },
  '6': { action: 'RIGHT', key: '6' },
  'Numpad6': { action: 'RIGHT', key: '6' },

  'ArrowDown': { action: 'DOWN', key: 'DOWN' },
  's': { action: 'DOWN', key: 'DOWN' },
  'S': { action: 'DOWN', key: 'DOWN' },
  '8': { action: 'DOWN', key: '8' },
  'Numpad8': { action: 'DOWN', key: '8' },

  'Enter': { action: 'SELECT', key: 'SELECT' },
  ' ': { action: 'SELECT', key: 'SELECT' },
  '5': { action: 'SELECT', key: '5' },
  'Numpad5': { action: 'SELECT', key: '5' },

  'Escape': { action: 'BACK', key: 'BACK' },
  'Backspace': { action: 'BACK', key: 'BACK' },
  'c': { action: 'BACK', key: 'BACK' },
  'C': { action: 'BACK', key: 'BACK' },

  'm': { action: 'MUTE', key: 'MUTE' },
  'M': { action: 'MUTE', key: 'MUTE' }
};

const handleKeyDown = (event) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
    event.preventDefault();
  }

  const mapping = keyMap[event.key] || keyMap[event.code];
  if (mapping) {
    pressedKeys.value[mapping.key] = true;
    if (mapping.action === 'MUTE') {
      toggleMute();
    } else if (screenRef.value) {
      screenRef.value.handleAction(mapping.action);
    }
  }
};

const handleKeyUp = (event) => {
  const mapping = keyMap[event.key] || keyMap[event.code];
  if (mapping) {
    pressedKeys.value[mapping.key] = false;
  }
};

const handleButtonPress = (action) => {
  if (action === 'MUTE') {
    toggleMute();
    return;
  }
  if (screenRef.value) {
    screenRef.value.handleAction(action);
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
});
</script>

<template>
  <div class="nokia-phone" :class="{ vibrate: vibrating, 'backlit-active': isBacklit }" id="nokia-3310-chassis">
    <div class="speaker-grill"></div>

    <div class="nokia-bezel">
      <div class="nokia-logo">NOKIA</div>
      <div class="nokia-screen-outer">
        <Screen
          ref="screenRef"
          :isBacklit="isBacklit"
          @toggle-backlight="toggleBacklight"
          @vibrate="handleVibrate"
        />
      </div>
    </div>

    <Keypad
      :pressedKeys="pressedKeys"
      @button-press="handleButtonPress"
    />
  </div>
</template>
