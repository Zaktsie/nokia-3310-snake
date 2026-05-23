<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { soundManager } from '../utils/SoundManager';

const props = defineProps({
  speedLevel: { type: Number, default: 5 },
  hasSolidWalls: { type: Boolean, default: true },
  isPaused: { type: Boolean, default: false }
});

const emit = defineEmits(['gameover', 'scorechange', 'back-to-menu', 'vibrate']);

const canvasRef = ref(null);
let ctx = null;

const GRID_COLS = 28;
const GRID_ROWS = 16;
const CELL_SIZE = 10;

const snake = ref([]);
const food = ref({ x: 0, y: 0 });
const direction = ref({ x: 1, y: 0 });
const nextDirection = ref({ x: 1, y: 0 });
const score = ref(0);
const isRunning = ref(false);
let gameLoopId = null;
let lastFrameTime = 0;

const SPEED_INTERVALS = {
  1: 280, 2: 240, 3: 200, 4: 160, 5: 130,
  6: 100, 7: 80, 8: 60, 9: 45
};

const initGame = () => {
  const startY = Math.floor(GRID_ROWS / 2);
  snake.value = [
    { x: 6, y: startY },
    { x: 5, y: startY },
    { x: 4, y: startY },
    { x: 3, y: startY }
  ];
  direction.value = { x: 1, y: 0 };
  nextDirection.value = { x: 1, y: 0 };
  score.value = 0;
  emit('scorechange', 0);
  spawnFood();
  isRunning.value = true;
  lastFrameTime = performance.now();
  requestAnimationFrame(gameLoop);
};

const spawnFood = () => {
  let newFood;
  let onSnake = true;
  while (onSnake) {
    newFood = {
      x: Math.floor(Math.random() * GRID_COLS),
      y: Math.floor(Math.random() * GRID_ROWS)
    };
    onSnake = snake.value.some(s => s.x === newFood.x && s.y === newFood.y);
  }
  food.value = newFood;
};

const gameLoop = (currentTime) => {
  if (!isRunning.value || props.isPaused) {
    if (isRunning.value) requestAnimationFrame(gameLoop);
    return;
  }

  const speedMs = SPEED_INTERVALS[props.speedLevel] || 130;
  const elapsed = currentTime - lastFrameTime;

  if (elapsed >= speedMs) {
    updateGame();
    lastFrameTime = currentTime - (elapsed % speedMs);
  }

  drawGame();
  requestAnimationFrame(gameLoop);
};

const updateGame = () => {
  direction.value = nextDirection.value;

  const head = snake.value[0];
  const newHead = {
    x: head.x + direction.value.x,
    y: head.y + direction.value.y
  };

  if (props.hasSolidWalls) {
    if (newHead.x < 0 || newHead.x >= GRID_COLS || newHead.y < 0 || newHead.y >= GRID_ROWS) {
      gameOver();
      return;
    }
  } else {
    newHead.x = (newHead.x + GRID_COLS) % GRID_COLS;
    newHead.y = (newHead.y + GRID_ROWS) % GRID_ROWS;
  }

  if (snake.value.some(s => s.x === newHead.x && s.y === newHead.y)) {
    gameOver();
    return;
  }

  snake.value.unshift(newHead);

  if (newHead.x === food.value.x && newHead.y === food.value.y) {
    score.value += 10;
    emit('scorechange', score.value);
    soundManager.playEat();
    emit('vibrate', 80);
    spawnFood();
  } else {
    snake.value.pop();
  }
};

const drawGame = () => {
  if (!ctx || !canvasRef.value) return;

  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);

  if (props.hasSolidWalls) {
    ctx.strokeStyle = '#162411';
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, canvasRef.value.width - 1, canvasRef.value.height - 1);
  } else {
    ctx.strokeStyle = '#162411';
    ctx.lineWidth = 0.5;
    ctx.setLineDash([2, 4]);
    ctx.strokeRect(0.5, 0.5, canvasRef.value.width - 1, canvasRef.value.height - 1);
    ctx.setLineDash([]);
  }

  const foodX = food.value.x * CELL_SIZE;
  const foodY = food.value.y * CELL_SIZE;
  ctx.fillStyle = '#162411';
  ctx.fillRect(foodX + 2, foodY + 2, CELL_SIZE - 4, CELL_SIZE - 4);
  ctx.clearRect(foodX + 4, foodY + 4, CELL_SIZE - 8, CELL_SIZE - 8);

  snake.value.forEach((segment, index) => {
    const segX = segment.x * CELL_SIZE;
    const segY = segment.y * CELL_SIZE;
    ctx.fillStyle = '#162411';

    if (index === 0) {
      ctx.fillRect(segX + 1, segY + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      ctx.fillStyle = '#8ba37d';
      if (direction.value.x !== 0) {
        ctx.fillRect(segX + (direction.value.x > 0 ? 6 : 2), segY + 2, 2, 2);
        ctx.fillRect(segX + (direction.value.x > 0 ? 6 : 2), segY + 6, 2, 2);
      } else {
        ctx.fillRect(segX + 2, segY + (direction.value.y > 0 ? 6 : 2), 2, 2);
        ctx.fillRect(segX + 6, segY + (direction.value.y > 0 ? 6 : 2), 2, 2);
      }
    } else {
      ctx.fillRect(segX + 1, segY + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      ctx.fillStyle = '#8ba37d';
      ctx.fillRect(segX + 3, segY + 3, CELL_SIZE - 6, CELL_SIZE - 6);
    }
  });
};

const gameOver = () => {
  isRunning.value = false;
  soundManager.playGameOver();
  emit('vibrate', 450);
  emit('gameover', score.value);
};

const handleDirectionChange = (dir) => {
  if (dir === 'UP' && direction.value.y !== 1) {
    nextDirection.value = { x: 0, y: -1 };
  } else if (dir === 'DOWN' && direction.value.y !== -1) {
    nextDirection.value = { x: 0, y: 1 };
  } else if (dir === 'LEFT' && direction.value.x !== 1) {
    nextDirection.value = { x: -1, y: 0 };
  } else if (dir === 'RIGHT' && direction.value.x !== -1) {
    nextDirection.value = { x: 1, y: 0 };
  }
};

defineExpose({ initGame, handleDirectionChange });

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d');
    canvasRef.value.width = GRID_COLS * CELL_SIZE;
    canvasRef.value.height = GRID_ROWS * CELL_SIZE;
    ctx.imageSmoothingEnabled = false;
    initGame();
  }
});

onUnmounted(() => {
  isRunning.value = false;
  if (gameLoopId) cancelAnimationFrame(gameLoopId);
});
</script>

<template>
  <div class="screen-canvas-container" id="game-canvas-area">
    <canvas ref="canvasRef" style="display: block; max-width: 100%; max-height: 100%; aspect-ratio: 28 / 16; box-sizing: border-box;"></canvas>
  </div>
</template>
