# 🥧 Fraction Game

An interactive, browser-based fraction learning game built with **HTML, CSS, JavaScript, and Three.js**. Players match a target fraction by adding or removing pieces from a circular pie model — with real-time feedback, sound effects, and a modern dark UI.

Built as part of the **Intern – Product** assignment for **ConveGenius.AI**.

---

## 🔗 Live Demo

> **[Play the game here → your-live-link.vercel.app]([(https://fraction-game-eight.vercel.app/)])**

*(Replace the link above once deployed on Vercel.)*

---

## ✨ Features

- 🥧 **Circular fraction model** — a pie divided into equal slices based on the level's denominator
- ➕➖ **Add Piece / Remove Piece controls** — shade or unshade slices one at a time
- 🎯 **Target fraction display** — clearly shows the fraction the player needs to match
- ⚡ **Immediate feedback** — live status updates ("2 more pieces to go", "Perfect match!", "Remove some pieces")
- 🔊 **Sound effects** — synthesized in-browser using the Web Audio API (no external audio files), with a mute toggle
- 🎉 **Celebration animation** — confetti burst and chime on a correct match, with auto-advance to the next level
- 📊 **6 progressive levels** — from `1/2` up to `3/8`
- 🌌 **Three.js animated background** — floating low-poly wireframe shapes and a glowing particle field
- 🌙 **Modern dark UI** — glassmorphism panels, gradient accents, and smooth micro-animations
- 📱 **Fully responsive** — works on mobile, tablet, and desktop
- ♿ **Accessible** — respects `prefers-reduced-motion`, uses semantic markup and `aria` labels

---

## 🗂️ Folder Structure

```
fraction-game/
│
├── index.html        # Main HTML structure — links all CSS/JS files
├── style.css          # Dark theme styling (glassmorphism, animations, layout)
├── script.js           # Core game logic — levels, fraction matching, feedback, sound
├── three-bg.js         # Three.js decorative animated background
└── README.md           # Project documentation (this file)
```

| File            | Responsibility                                                        |
|-----------------|-------------------------------------------------------------------------|
| `index.html`    | Page structure, markup, script/style linking                            |
| `style.css`     | All visual styling — colors, layout, responsiveness, animations          |
| `script.js`     | Game logic — SVG pie rendering, level progression, feedback, Web Audio   |
| `three-bg.js`   | Standalone Three.js scene rendered behind the game UI                    |

---

## 🛠️ Tech Stack

- **HTML5** — semantic structure & SVG-based pie rendering
- **CSS3** — glassmorphism, gradients, responsive grid, keyframe animations
- **JavaScript (Vanilla)** — game logic, DOM manipulation, Web Audio API
- **Three.js (r128)** — animated 3D background scene

---

## 🚀 Running Locally

No build tools or dependencies required.

1. Download / clone this folder.
2. Open `index.html` directly in any modern browser
   **or** serve it locally for the best experience:

   ```bash
   # using Python
   python3 -m http.server 8000

   # then open
   http://localhost:8000
   ```

> Note: `three-bg.js` loads Three.js from a CDN, so an internet connection is required for the animated background to appear.

---

## 🌐 Deploying to Vercel

1. Push this folder to a GitHub repository (or drag-and-drop it into the Vercel dashboard).
2. Import the repo on [vercel.com](https://vercel.com).
3. Framework preset: **Other** (static site) — no build command needed.
4. Deploy, then copy the generated URL into the **Live Demo** section above.

---

## 🎮 How to Play

1. Look at the target fraction shown in the panel (e.g. `3/4`).
2. Click **Add Piece** to shade slices, or **Remove Piece** to unshade them.
3. Match the number of shaded slices to the numerator.
4. On a correct match, enjoy the celebration and move to the next level automatically.
5. Complete all 6 levels to finish the game — then hit **Play Again** to restart.

---

## 👤 Author

Built by *AKarsh Yadav*
Batch 2026 · B.Tech (CSE)
