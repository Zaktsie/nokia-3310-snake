<script setup>
const props = defineProps({
  pressedKeys: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['button-press']);

const onButtonPress = (action) => {
  emit('button-press', action);
};

const isKeyPressed = (keyName) => {
  return !!props.pressedKeys[keyName];
};
</script>

<template>
  <div class="nokia-keypad" id="nokia-keypad-buttons">
    <div class="nokia-softkeys">
      <button
        class="softkey"
        :class="{ pressed: isKeyPressed('BACK') || isKeyPressed('Backspace') || isKeyPressed('Escape') }"
        @mousedown="onButtonPress('BACK')"
        id="btn-back"
      >
        <span class="softkey-icon">C</span>
        <span class="softkey-label">Back</span>
      </button>

      <button
        class="softkey center-button"
        :class="{ pressed: isKeyPressed('SELECT') || isKeyPressed('Enter') || isKeyPressed(' ') }"
        @mousedown="onButtonPress('SELECT')"
        id="btn-select"
      >
        <span class="softkey-icon">━</span>
        <span class="softkey-label">OK</span>
      </button>

      <button
        class="softkey"
        :class="{ pressed: isKeyPressed('MUTE') || isKeyPressed('m') }"
        @mousedown="onButtonPress('MUTE')"
        id="btn-mute"
      >
        <span class="softkey-icon">♫</span>
        <span class="softkey-label">Mute</span>
      </button>
    </div>

    <div class="nokia-numpad">
      <button class="numpad-btn" :class="{ pressed: isKeyPressed('1') }" @mousedown="onButtonPress('1')">
        <span class="num-val">1</span>
        <span class="letter-val">o_o</span>
      </button>

      <button class="numpad-btn" :class="{ pressed: isKeyPressed('2') || isKeyPressed('UP') || isKeyPressed('ArrowUp') || isKeyPressed('w') }" @mousedown="onButtonPress('UP')" id="btn-key-up">
        <span class="num-val">2</span>
        <span class="letter-val">▲ abc</span>
      </button>

      <button class="numpad-btn" :class="{ pressed: isKeyPressed('3') }" @mousedown="onButtonPress('3')">
        <span class="num-val">3</span>
        <span class="letter-val">def</span>
      </button>

      <button class="numpad-btn" :class="{ pressed: isKeyPressed('4') || isKeyPressed('LEFT') || isKeyPressed('ArrowLeft') || isKeyPressed('a') }" @mousedown="onButtonPress('LEFT')" id="btn-key-left">
        <span class="num-val">4</span>
        <span class="letter-val">◀ ghi</span>
      </button>

      <button class="numpad-btn" :class="{ pressed: isKeyPressed('5') }" @mousedown="onButtonPress('SELECT')" id="btn-key-ok">
        <span class="num-val">5</span>
        <span class="letter-val">jkl ☼</span>
      </button>

      <button class="numpad-btn" :class="{ pressed: isKeyPressed('6') || isKeyPressed('RIGHT') || isKeyPressed('ArrowRight') || isKeyPressed('d') }" @mousedown="onButtonPress('RIGHT')" id="btn-key-right">
        <span class="num-val">6</span>
        <span class="letter-val">mno ▶</span>
      </button>

      <button class="numpad-btn" :class="{ pressed: isKeyPressed('7') }" @mousedown="onButtonPress('7')">
        <span class="num-val">7</span>
        <span class="letter-val">pqrs</span>
      </button>

      <button class="numpad-btn" :class="{ pressed: isKeyPressed('8') || isKeyPressed('DOWN') || isKeyPressed('ArrowDown') || isKeyPressed('s') }" @mousedown="onButtonPress('DOWN')" id="btn-key-down">
        <span class="num-val">8</span>
        <span class="letter-val">tuv ▼</span>
      </button>

      <button class="numpad-btn" :class="{ pressed: isKeyPressed('9') }" @mousedown="onButtonPress('9')">
        <span class="num-val">9</span>
        <span class="letter-val">wxyz</span>
      </button>

      <button class="numpad-btn" :class="{ pressed: isKeyPressed('*') }" @mousedown="onButtonPress('*')">
        <span class="num-val">*</span>
        <span class="letter-val">a/A</span>
      </button>

      <button class="numpad-btn" :class="{ pressed: isKeyPressed('0') }" @mousedown="onButtonPress('0')">
        <span class="num-val">0</span>
        <span class="letter-val">_</span>
      </button>

      <button class="numpad-btn" :class="{ pressed: isKeyPressed('#') }" @mousedown="onButtonPress('#')">
        <span class="num-val">#</span>
        <span class="letter-val">⇧</span>
      </button>
    </div>
  </div>
</template>
