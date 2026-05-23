# Nokia 3310 Retro Snake II (Vue 3)

An authentic, pixel-perfect recreation of the classic **Snake II** game from the legendary Nokia 3310 / 3330 phone. Built using **Vue 3**, **Vanilla CSS**, and the browser's **Web Audio API** (no heavy audio or image asset dependencies!).

---

## 🎮 Key Features

* **3D Physical Chassis**: A realistic Nokia 3310 front cover shell, bezel trim, and speaker grill.
* **Keypad Backlight Underglow**: rub-key button overlays that light up with a soft green LED backlight when the screen is active, compressing naturally on click.
* **Pixelated LCD Screen**: Monochromatic green/gray display with simulated scanline grids, glare glaze reflections, and authentic scrolling lists.
* **Monophonic Synth Sound**: An 8-bit square-wave oscillator reproducing menu beeps, eating chirps, crash sounds, and the iconic **Nokia Ringtone** melody.
* **LCD Status Bars**: Real standby indicators showing 5 cellular signal bars on the left, a battery level grid on the right, and the operator tag "Nokia II".
* **Haptic Vibration Feedback**: A physical wiggle animation shaking the entire chassis on collision (Game Over) and giving micro-pulses on scoring.
* **Original Gameplay Rules**:
  * **Border settings**: Toggle between *Solid Walls* (crashing is fatal) and *Wrap Around* (wrapping to the opposite side).
  * **Speed Levels**: Adjustable levels 1 (slow) through 9 (extremely fast).
  * **High Scores**: Automatically saves and displays top 5 ranks using browser `LocalStorage`.

---

## 🛠️ Tech Stack

* **Core**: Vue 3 (Composition API, `<script setup>`)
* **Build System**: Vite
* **Styling**: Vanilla CSS (custom variables, keyframes, grid/flex overlays, and aspect ratio containment)
* **Audio System**: Monophonic Web Audio API (Synthesizer class)

---

## 🚀 How to Run Locally

### 1. Prerequisite
Ensure you have **Node.js** (v18+) and **npm** installed.

### 2. Installation
Clone the repository and install the dependencies:
```bash
# Navigate to the directory
cd nokia-3310-snake

# Install npm packages
npm install
```

### 3. Start Development Server
Boot up the dev server:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 4. Build for Production
To bundle and optimize the application:
```bash
npm run build
```
Production assets will compile inside the `/dist` directory.

---

## 🕹️ Controls Guide

Play using either the screen-clicks on the physical keys or your computer keyboard:

| Action | Nokia Keypad Key | Computer Keyboard Shortcut |
| :--- | :--- | :--- |
| **Move Up** | `2` Key (abc ▲) | `Up Arrow` / `W` |
| **Move Down** | `8` Key (tuv ▼) | `Down Arrow` / `S` |
| **Move Left** | `4` Key (ghi ◀) | `Left Arrow` / `A` |
| **Move Right** | `6` Key (mno ▶) | `Right Arrow` / `D` |
| **OK / Select** | `5` Key / Center Key (━) | `Enter` / `Space` |
| **Pause / Back** | Left Key (C) | `Backspace` / `Escape` / `C` |
| **Mute Audio** | Right Key (♫) | `M` Key |
