<script setup>
import { ref, computed, onMounted } from 'vue';
import GameCanvas from './GameCanvas.vue';
import { soundManager } from '../utils/SoundManager';

const props = defineProps({
  isBacklit: { type: Boolean, default: true }
});

const emit = defineEmits(['toggle-backlight', 'vibrate']);

const STATES = {
  MAIN_MENU: 'main_menu',
  GAMEPLAY: 'gameplay',
  PAUSE_MENU: 'pause_menu',
  SETTINGS: 'settings',
  HIGH_SCORES: 'high_scores',
  HELP: 'help',
  GAME_OVER: 'game_over'
};

const activeState = ref(STATES.MAIN_MENU);
const menuSelectedIndex = ref(0);
const gameScore = ref(0);
const isPaused = ref(false);
const speedLevel = ref(5);
const hasSolidWalls = ref(true);
const gameCanvasRef = ref(null);
const highScores = ref([]);

const mainMenuOptions = [
  { name: '1. Play', action: () => startGame() },
  { name: '2. Settings', action: () => openSettings() },
  { name: '3. High Scores', action: () => openHighScores() },
  { name: '4. Instructions', action: () => openHelp() },
  { name: '5. Play Tone', action: () => playNokiaTune() }
];

const pauseMenuOptions = [
  { name: '1. Resume', action: () => resumeGame() },
  { name: '2. Restart', action: () => restartGame() },
  { name: '3. Exit Game', action: () => exitGame() }
];

const settingsOptions = computed(() => [
  { name: 'Speed', value: `${speedLevel.value} (1-9)` },
  { name: 'Walls', value: hasSolidWalls.value ? 'SOLID' : 'WRAP' },
  { name: 'Backlight', value: props.isBacklit ? 'ON' : 'OFF' },
  { name: 'Back to Menu', value: '' }
]);

const gameOverOptions = [
  { name: '1. Try Again', action: () => startGame() },
  { name: '2. Main Menu', action: () => goToMainMenu() }
];

onMounted(() => {
  const savedScores = localStorage.getItem('nokia_snake_high_scores');
  if (savedScores) {
    highScores.value = JSON.parse(savedScores);
  } else {
    highScores.value = [250, 180, 120, 80, 40];
    localStorage.setItem('nokia_snake_high_scores', JSON.stringify(highScores.value));
  }

  const savedSpeed = localStorage.getItem('nokia_snake_speed');
  if (savedSpeed) speedLevel.value = parseInt(savedSpeed, 10);

  const savedWalls = localStorage.getItem('nokia_snake_walls');
  if (savedWalls) hasSolidWalls.value = savedWalls === 'true';
});

const playNokiaTune = () => soundManager.playNokiaTune();
const playBeep = () => soundManager.playBeep();

const startGame = () => {
  playBeep();
  activeState.value = STATES.GAMEPLAY;
  isPaused.value = false;
  gameScore.value = 0;
};

const openSettings = () => {
  playBeep();
  activeState.value = STATES.SETTINGS;
  menuSelectedIndex.value = 0;
};

const openHighScores = () => {
  playBeep();
  activeState.value = STATES.HIGH_SCORES;
  menuSelectedIndex.value = 0;
};

const openHelp = () => {
  playBeep();
  activeState.value = STATES.HELP;
};

const goToMainMenu = () => {
  playBeep();
  activeState.value = STATES.MAIN_MENU;
  menuSelectedIndex.value = 0;
};

const resumeGame = () => {
  playBeep();
  isPaused.value = false;
  activeState.value = STATES.GAMEPLAY;
};

const restartGame = () => {
  playBeep();
  activeState.value = STATES.GAMEPLAY;
  isPaused.value = false;
  gameScore.value = 0;
  setTimeout(() => {
    if (gameCanvasRef.value) gameCanvasRef.value.initGame();
  }, 10);
};

const exitGame = () => {
  playBeep();
  activeState.value = STATES.MAIN_MENU;
  isPaused.value = false;
  menuSelectedIndex.value = 0;
};

const changeSetting = (dir) => {
  const currentOption = menuSelectedIndex.value;
  if (currentOption === 0) {
    let newSpeed = speedLevel.value + (dir === 'RIGHT' || dir === 'UP' ? 1 : -1);
    if (newSpeed < 1) newSpeed = 9;
    if (newSpeed > 9) newSpeed = 1;
    speedLevel.value = newSpeed;
    localStorage.setItem('nokia_snake_speed', newSpeed);
    soundManager.playBeep();
  } else if (currentOption === 1) {
    hasSolidWalls.value = !hasSolidWalls.value;
    localStorage.setItem('nokia_snake_walls', hasSolidWalls.value);
    soundManager.playBeep();
  } else if (currentOption === 2) {
    emit('toggle-backlight');
    soundManager.playBeep();
  }
};

const checkHighScore = (score) => {
  gameScore.value = score;
  const isNewHigh = score > 0 && (highScores.value.length < 5 || score > highScores.value[highScores.value.length - 1]);

  if (isNewHigh) {
    highScores.value.push(score);
    highScores.value.sort((a, b) => b - a);
    if (highScores.value.length > 5) highScores.value.pop();
    localStorage.setItem('nokia_snake_high_scores', JSON.stringify(highScores.value));
  }

  activeState.value = STATES.GAME_OVER;
  menuSelectedIndex.value = 0;
};

const handleAction = (action) => {
  if (activeState.value === STATES.GAMEPLAY) {
    if (['UP', 'DOWN', 'LEFT', 'RIGHT'].includes(action)) {
      if (gameCanvasRef.value) gameCanvasRef.value.handleDirectionChange(action);
    } else if (action === 'BACK' || action === 'CLEAR') {
      playBeep();
      isPaused.value = true;
      activeState.value = STATES.PAUSE_MENU;
      menuSelectedIndex.value = 0;
    }
    return;
  }

  switch (activeState.value) {
    case STATES.MAIN_MENU:
      if (action === 'UP') {
        playBeep();
        menuSelectedIndex.value = (menuSelectedIndex.value - 1 + mainMenuOptions.length) % mainMenuOptions.length;
      } else if (action === 'DOWN') {
        playBeep();
        menuSelectedIndex.value = (menuSelectedIndex.value + 1) % mainMenuOptions.length;
      } else if (action === 'SELECT' || action === 'RIGHT') {
        mainMenuOptions[menuSelectedIndex.value].action();
      }
      break;

    case STATES.PAUSE_MENU:
      if (action === 'UP') {
        playBeep();
        menuSelectedIndex.value = (menuSelectedIndex.value - 1 + pauseMenuOptions.length) % pauseMenuOptions.length;
      } else if (action === 'DOWN') {
        playBeep();
        menuSelectedIndex.value = (menuSelectedIndex.value + 1) % pauseMenuOptions.length;
      } else if (action === 'SELECT') {
        pauseMenuOptions[menuSelectedIndex.value].action();
      } else if (action === 'BACK' || action === 'CLEAR') {
        resumeGame();
      }
      break;

    case STATES.SETTINGS:
      if (action === 'UP') {
        playBeep();
        menuSelectedIndex.value = (menuSelectedIndex.value - 1 + settingsOptions.value.length) % settingsOptions.value.length;
      } else if (action === 'DOWN') {
        playBeep();
        menuSelectedIndex.value = (menuSelectedIndex.value + 1) % settingsOptions.value.length;
      } else if (action === 'LEFT' || action === 'RIGHT') {
        changeSetting(action);
      } else if (action === 'SELECT') {
        if (menuSelectedIndex.value === 3) {
          goToMainMenu();
        } else {
          changeSetting('RIGHT');
        }
      } else if (action === 'BACK' || action === 'CLEAR') {
        goToMainMenu();
      }
      break;

    case STATES.HIGH_SCORES:
    case STATES.HELP:
      if (action === 'BACK' || action === 'CLEAR' || action === 'SELECT') {
        goToMainMenu();
      }
      break;

    case STATES.GAME_OVER:
      if (action === 'UP') {
        playBeep();
        menuSelectedIndex.value = (menuSelectedIndex.value - 1 + gameOverOptions.length) % gameOverOptions.length;
      } else if (action === 'DOWN') {
        playBeep();
        menuSelectedIndex.value = (menuSelectedIndex.value + 1) % gameOverOptions.length;
      } else if (action === 'SELECT') {
        gameOverOptions[menuSelectedIndex.value].action();
      } else if (action === 'BACK' || action === 'CLEAR') {
        goToMainMenu();
      }
      break;
  }
};

defineExpose({ handleAction });

const scrollThumbStyle = computed(() => {
  if (activeState.value === STATES.MAIN_MENU) {
    const height = 100 / mainMenuOptions.length;
    const top = menuSelectedIndex.value * height;
    return { height: `${height}%`, top: `${top}%` };
  } else if (activeState.value === STATES.SETTINGS) {
    const height = 100 / settingsOptions.value.length;
    const top = menuSelectedIndex.value * height;
    return { height: `${height}%`, top: `${top}%` };
  }
  return { height: '100%', top: '0%' };
});
</script>

<template>
  <div class="nokia-screen-inner" :class="{ backlit: isBacklit }" id="screen-inner-display">
    <div class="screen-mesh"></div>
    <div class="screen-glare"></div>

    <div class="lcd-status-bar" v-if="activeState !== STATES.GAMEPLAY">
      <div class="signal-indicator" title="Network Signal strength">
        <div class="sig-bar"></div>
        <div class="sig-bar"></div>
        <div class="sig-bar"></div>
        <div class="sig-bar"></div>
        <div class="sig-bar"></div>
      </div>
      <div style="font-size: 0.9rem; font-weight: bold; flex-grow: 1; text-align: center; text-transform: uppercase; letter-spacing: 0.5px;">
        Nokia II
      </div>
      <div class="battery-indicator" title="Battery Level">
        <div class="bat-level"></div>
      </div>
    </div>

    <div v-if="activeState === STATES.MAIN_MENU" style="width: 100%; height: 100%; display: flex; flex-direction: column;">
      <div class="screen-menu-title">Snake II</div>
      <div class="menu-items-list">
        <div
          v-for="(opt, idx) in mainMenuOptions"
          :key="idx"
          class="menu-item"
          :class="{ active: idx === menuSelectedIndex }"
        >
          <span>{{ opt.name }}</span>
          <span v-if="idx === menuSelectedIndex" class="menu-selector">◄</span>
        </div>
      </div>
      <div class="scroll-indicator">
        <div class="scroll-thumb" :style="scrollThumbStyle"></div>
      </div>
    </div>

    <div v-else-if="activeState === STATES.GAMEPLAY" style="width: 100%; height: 100%; display: flex; flex-direction: column;">
      <div class="screen-game-header">
        <span>L{{ speedLevel }}</span>
        <span>Score: {{ gameScore }}</span>
      </div>
      <GameCanvas
        ref="gameCanvasRef"
        :speedLevel="speedLevel"
        :hasSolidWalls="hasSolidWalls"
        :isPaused="isPaused"
        @gameover="checkHighScore"
        @scorechange="(s) => gameScore = s"
        @vibrate="(ms) => emit('vibrate', ms)"
      />
    </div>

    <div v-else-if="activeState === STATES.PAUSE_MENU" style="width: 100%; height: 100%; display: flex; flex-direction: column;">
      <div class="screen-menu-title">Paused</div>
      <div class="menu-items-list" style="margin-top: 10px;">
        <div
          v-for="(opt, idx) in pauseMenuOptions"
          :key="idx"
          class="menu-item"
          :class="{ active: idx === menuSelectedIndex }"
        >
          <span>{{ opt.name }}</span>
          <span v-if="idx === menuSelectedIndex" class="menu-selector">◄</span>
        </div>
      </div>
    </div>

    <div v-else-if="activeState === STATES.SETTINGS" style="width: 100%; height: 100%; display: flex; flex-direction: column;">
      <div class="screen-menu-title">Settings</div>
      <div class="menu-items-list">
        <div
          v-for="(opt, idx) in settingsOptions"
          :key="idx"
          class="menu-item"
          :class="{ active: idx === menuSelectedIndex }"
        >
          <div class="option-row">
            <span>{{ opt.name }}</span>
            <span style="font-weight: bold;">{{ opt.value }}</span>
          </div>
        </div>
      </div>
      <div class="scroll-indicator">
        <div class="scroll-thumb" :style="scrollThumbStyle"></div>
      </div>
    </div>

    <div v-else-if="activeState === STATES.HIGH_SCORES" style="width: 100%; height: 100%; display: flex; flex-direction: column;">
      <div class="screen-menu-title">High Scores</div>
      <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 2px; margin-top: 2px;">
        <div
          v-for="(score, idx) in highScores"
          :key="idx"
          class="score-row"
          :class="{ active: idx === 0 }"
        >
          <span>{{ idx + 1 }}. Rank</span>
          <span>{{ score }} pts</span>
        </div>
      </div>
      <div style="text-align: center; font-size: 0.8rem; border-top: 1px solid var(--lcd-pixel); padding-top: 2px;">
        Press Back to exit
      </div>
    </div>

    <div v-else-if="activeState === STATES.HELP" style="width: 100%; height: 100%; display: flex; flex-direction: column;">
      <div class="screen-menu-title">Controls</div>
      <div class="help-container" style="flex-grow: 1; padding: 2px 4px; overflow: hidden;">
        Use keys:
        2 - UP    | 4 - LEFT
        6 - RIGHT | 8 - DOWN

        Or use arrow keys.
        Press BACK (C) to pause.
      </div>
      <div style="text-align: center; font-size: 0.8rem; border-top: 1px solid var(--lcd-pixel); padding-top: 2px;">
        Press OK to exit
      </div>
    </div>

    <div v-else-if="activeState === STATES.GAME_OVER" style="width: 100%; height: 100%; display: flex; flex-direction: column;">
      <div class="screen-menu-title">Game Over</div>
      <div style="flex-grow: 1; text-align: center; padding-top: 5px;">
        <div style="font-size: 1.3rem; font-weight: bold; margin-bottom: 2px;">Score: {{ gameScore }}</div>
        <div class="menu-items-list" style="margin-top: 6px;">
          <div
            v-for="(opt, idx) in gameOverOptions"
            :key="idx"
            class="menu-item"
            :class="{ active: idx === menuSelectedIndex }"
          >
            <span>{{ opt.name }}</span>
            <span v-if="idx === menuSelectedIndex" class="menu-selector">◄</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
