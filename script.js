
const levels = [
  { numerator: 1, denominator: 2 },
  { numerator: 2, denominator: 3 },
  { numerator: 3, denominator: 4 },
  { numerator: 2, denominator: 5 },
  { numerator: 5, denominator: 6 },
  { numerator: 3, denominator: 8 }
];

const pie = document.getElementById("pie");
const centerLabel = document.getElementById("centerLabel");
const targetTop = document.getElementById("targetTop");
const targetBottom = document.getElementById("targetBottom");
const addButton = document.getElementById("addButton");
const removeButton = document.getElementById("removeButton");
const feedback = document.getElementById("feedback");
const progress = document.getElementById("progress");
const muteButton = document.getElementById("muteButton");
const muteLabel = document.getElementById("muteLabel");
const confetti = document.getElementById("confetti");
const finished = document.getElementById("finished");
const restartButton = document.getElementById("restartButton");

let levelIndex = 0;
let shadedPieces = 0;
let isAdvancing = false;
let isMuted = false;
let audioContext;

// ---------- SVG slice geometry (polar coordinates) ----------
function polarToCartesian(cx, cy, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians)
  };
}

function describeSlice(cx, cy, radius, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", cx, cy,
    "L", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "Z"
  ].join(" ");
}

// ---------- rendering ----------
function renderProgress() {
  progress.innerHTML = "";
  levels.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.className = "dot";
    if (index < levelIndex) dot.classList.add("done");
    if (index === levelIndex) dot.classList.add("current");
    progress.appendChild(dot);
  });
}

function renderLevel() {
  const level = levels[levelIndex];
  const sliceAngle = 360 / level.denominator;

  isAdvancing = false;
  shadedPieces = 0;
  pie.innerHTML = "";
  targetTop.textContent = level.numerator;
  targetBottom.textContent = level.denominator;

  for (let i = 0; i < level.denominator; i++) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", describeSlice(120, 120, 104, i * sliceAngle, (i + 1) * sliceAngle));
    path.setAttribute("class", "slice");
    path.setAttribute("data-index", i);
    pie.appendChild(path);
  }

  renderProgress();
  updateView();
}

function updateView() {
  const level = levels[levelIndex];
  const slices = [...pie.querySelectorAll(".slice")];

  slices.forEach((slice, index) => {
    slice.classList.toggle("filled", index < shadedPieces);
  });

  centerLabel.textContent = `${shadedPieces}/${level.denominator}`;
  addButton.disabled = isAdvancing || shadedPieces === level.denominator;
  removeButton.disabled = isAdvancing || shadedPieces === 0;
  feedback.className = "feedback";

  if (shadedPieces === level.numerator) {
    feedback.textContent = "Perfect match! That is exactly the target fraction.";
    feedback.classList.add("good");
  } else if (shadedPieces < level.numerator) {
    const needed = level.numerator - shadedPieces;
    feedback.textContent = `Add ${needed} more ${needed === 1 ? "piece" : "pieces"} to match the target.`;
  } else {
    const extra = shadedPieces - level.numerator;
    feedback.textContent = `A little too much. Remove ${extra} ${extra === 1 ? "piece" : "pieces"} to get back to the target.`;
    feedback.classList.add("warn");
  }
}

// ---------- sound (Web Audio API, no external files) ----------
function playTone(frequency, start, duration, type = "sine", gain = 0.12) {
  if (isMuted) return;
  audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();

  const oscillator = audioContext.createOscillator();
  const volume = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + start);
  volume.gain.setValueAtTime(0.001, audioContext.currentTime + start);
  volume.gain.exponentialRampToValueAtTime(gain, audioContext.currentTime + start + 0.015);
  volume.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + start + duration);
  oscillator.connect(volume);
  volume.connect(audioContext.destination);
  oscillator.start(audioContext.currentTime + start);
  oscillator.stop(audioContext.currentTime + start + duration + 0.03);
}

function playClickSound() {
  playTone(420, 0, 0.07, "triangle", 0.08);
}

function playWinSound() {
  playTone(523.25, 0, 0.12, "sine", 0.1);
  playTone(659.25, 0.1, 0.12, "sine", 0.1);
  playTone(783.99, 0.2, 0.18, "sine", 0.12);
}

// ---------- confetti ----------
function celebrate() {
  const colors = ["#7c5cff", "#4cc9f0", "#ff6b9d", "#33d6b0", "#ffd166"];
  confetti.innerHTML = "";

  for (let i = 0; i < 28; i++) {
    const piece = document.createElement("span");
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty("--turn", `${(360 / 28) * i}deg`);
    piece.style.animation = `celebrate ${620 + i * 12}ms ease-out forwards`;
    confetti.appendChild(piece);
  }
}

// ---------- game flow ----------
function checkForWin() {
  const level = levels[levelIndex];
  if (shadedPieces !== level.numerator || isAdvancing) return;

  isAdvancing = true;
  updateView();
  celebrate();
  playWinSound();

  setTimeout(() => {
    if (levelIndex === levels.length - 1) {
      finished.classList.add("show");
      return;
    }
    levelIndex++;
    renderLevel();
  }, 1200);
}

function shadeLatestPiece() {
  const slice = pie.querySelector(`.slice[data-index="${shadedPieces - 1}"]`);
  if (!slice) return;
  slice.classList.remove("pop");
  void slice.getBoundingClientRect(); // restart animation on quick repeated taps
  slice.classList.add("pop");
}

// ---------- event listeners ----------
addButton.addEventListener("click", () => {
  const level = levels[levelIndex];
  if (isAdvancing || shadedPieces >= level.denominator) return;
  shadedPieces++;
  updateView();
  shadeLatestPiece();
  playClickSound();
  checkForWin();
});

removeButton.addEventListener("click", () => {
  if (isAdvancing || shadedPieces <= 0) return;
  shadedPieces--;
  updateView();
  playClickSound();
});

muteButton.addEventListener("click", () => {
  isMuted = !isMuted;
  muteLabel.textContent = isMuted ? "Muted" : "Sound On";
  muteButton.setAttribute("aria-pressed", String(isMuted));
});

restartButton.addEventListener("click", () => {
  levelIndex = 0;
  finished.classList.remove("show");
  renderLevel();
});

renderLevel();
