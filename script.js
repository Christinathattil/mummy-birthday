// ====== Helpers ======
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ====== Confetti ======
function burstConfetti() {
  if (typeof confetti !== 'function') return;
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

// ====== Visitor Counter via backend ======
const BACKEND_URL = "https://mummy-birthday-production.up.railway.app";
async function fetchCount() {
  try {
    const res = await fetch(`${BACKEND_URL}/count`, { 
      signal: AbortSignal.timeout(5000) 
    });
    if (!res.ok) throw new Error('Network response was not ok');
    const { count } = await res.json();
    return count;
  } catch (e) {
    console.error("Count fetch failed", e);
    return -1; // Return -1 to indicate error
  }
}
async function incrementVisitors() {
  try {
    const res = await fetch(`${BACKEND_URL}/increment`, { method: "POST" });
    const { count } = await res.json();
    return count;
  } catch (e) {
    console.error("Increment failed", e);
    return null;
  }
}

// ====== Hero ======
const visitorCountEl = $('#visitorCount');
(async () => {
  const cnt = await fetchCount();
  if (cnt === -1) {
    visitorCountEl.textContent = '⏳ Loading wishes... (if this persists, check your internet connection)';
    visitorCountEl.style.fontSize = '0.9rem';
  } else {
    visitorCountEl.textContent = `${cnt} ${cnt === 1 ? "person has" : "people have"} wished Mummy today 🤩`;
  }
})();
let hasClicked = sessionStorage.getItem('hasClickedStart');

// Background audio
const bgAudio = $('#birthdayAudio');
bgAudio.loop = true;
bgAudio.volume = 0.3;

$('#startButton').addEventListener('click', async () => {
  if (!sessionStorage.getItem('hasClickedStart')) {
    const count = await incrementVisitors();
    if (count !== null) {
      visitorCountEl.textContent = `${count} ${count === 1 ? 'person has' : 'people have'} wished Mummy today 🤩`;
    }
    sessionStorage.setItem('hasClickedStart', 'true');
  }
  // Play background music on user interaction
  bgAudio.play().catch(() => {});
  burstConfetti();
  document.getElementById('wishSection').scrollIntoView({ behavior: 'smooth' });
});

// ====== Wish Carousel via backend ======
let wishes = [];
async function fetchWishes() {
  try {
    const res = await fetch(`${BACKEND_URL}/wishes`);
    wishes = await res.json();
    currentWishIndex = 0;
    renderWish();
  } catch (e) {
    console.error('Failed to fetch wishes', e);
  }
}
fetchWishes();
let currentWishIndex = 0;
const wishDisplay = $('#wishCarousel');
const wishCountEl = $('#wishCount');
function updateWishCount() {
  wishCountEl.textContent = `${wishes.length} ${wishes.length === 1 ? 'wish' : 'wishes'} so far`;
}

function renderWish() {
  updateWishCount();
  if (!wishes.length) {
    wishDisplay.textContent = 'Be the first slice of cake—add a wish below!';
    return;
  }
  const w = wishes[currentWishIndex];
  wishDisplay.textContent = w.name ? `${w.text} — ${w.name}` : w.text;
}
// initial render
renderWish();
setInterval(() => {
  if (!wishes.length) return;
  currentWishIndex = (currentWishIndex + 1) % wishes.length;
  renderWish();
}, 3500);

// Add wish form toggle
$('#addWishBtn').addEventListener('click', () => {
  $('#wishForm').classList.toggle('hidden');
});

// Submit wish
$('#submitWish').addEventListener('click', async () => {
  const text = $('#wishInput').value.trim();
  if (!text) return;
  const name = $('#nameInput').value.trim();
  try {
    const res = await fetch(`${BACKEND_URL}/wishes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, name }),
    });
    const saved = await res.json();
    wishes.push(saved);
  } catch (e) {
    console.error('Wish submit failed', e);
    return;
  }
    updateWishCount();
  currentWishIndex = wishes.length - 1;
  renderWish();
  // reset form
  $('#wishInput').value = '';
  $('#nameInput').value = '';
  $('#wishForm').classList.add('hidden');
  burstConfetti();
});

// ====== Quiz ======
const answerKey = { q1: 'A', q2: 'C', q3: 'B' };

$('#submitQuiz').addEventListener('click', () => {
  const form = new FormData($('#quizForm'));
  let score = 0;
  Object.keys(answerKey).forEach((q) => {
    if (form.get(q) === answerKey[q]) score++;
  });
  const result = $('#quizResult');
  if (score === 3) {
    result.textContent = 'Perfect! You\'re an Official Mom Expert 🏅';
  } else {
    result.textContent = `You got ${score}/3! Still pretty nifty.`;
  }
  result.classList.remove('hidden');
  burstConfetti();
});

// ====== Magic 8-Ball ======
const oracleAnswers = [
  'At sixty you shine, like the finest of wine! 🍷',
  'Age is just a number, your spirit\'s still thunder! ⚡',
  'Keep dancing through life, cut worries like a knife! 💃',
  'You\'re strong and you\'re bold, worth more than pure gold! ✨',
  'Laugh every day, chase the blues away! 😄',
  'Dream big and soar, there\'s so much more in store! 🚀',
  'Your love lights the way, brighter every day! 💖',
  'Sixty and free, the best is yet to be! 🎉',
];
const magicBall = $('#magicBall');
const ballAnswer = $('#ballAnswer');
const oracleText = $('#oracleText');
let isShaking = false;

function revealOracle() {
  if (isShaking) return;
  isShaking = true;
  magicBall.classList.add('shake');
  ballAnswer.textContent = '...';
  oracleText.textContent = '';
  
  setTimeout(() => {
    const answer = oracleAnswers[Math.floor(Math.random() * oracleAnswers.length)];
    ballAnswer.textContent = '✨';
    oracleText.textContent = answer;
    magicBall.classList.remove('shake');
    burstConfetti();
    isShaking = false;
  }, 800);
}

magicBall.addEventListener('click', revealOracle);

// Shake detection for mobile
if (window.DeviceMotionEvent) {
  let lastShake = 0;
  window.addEventListener('devicemotion', (e) => {
    const acc = e.accelerationIncludingGravity;
    const threshold = 15;
    const now = Date.now();
    if (now - lastShake < 1000) return;
    if (Math.abs(acc.x) > threshold || Math.abs(acc.y) > threshold || Math.abs(acc.z) > threshold) {
      lastShake = now;
      revealOracle();
    }
  });
}

// ====== Memory Flip Cards ======
setTimeout(() => {
  $$('.flip-card').forEach((card) => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });
}, 100);

// ====== Countdown ======
const countdownEl = $('#countdown');
// Birthday: February 21, 2026 at midnight
const target = new Date(2026, 1, 21, 0, 0, 0);
function updateCountdown() {
  const diff = target - new Date();
  if (diff <= 0) {
    countdownEl.textContent = '🎂 It\'s party time!';
    $('#birthdayAudio').play().catch(() => {});
    return;
  }
  const hrs = String(Math.floor(diff / 3600000)).padStart(2, '0');
  const mins = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
  const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
  countdownEl.textContent = `${hrs}:${mins}:${secs} to celebrate`;
  requestAnimationFrame(updateCountdown);
}
updateCountdown();

// ====== Balloons ======
const balloonContainer = $('#balloonContainer');
function createBalloon() {
  const b = document.createElement('div');
  b.className = 'balloon';
  // Random pastel color
  const hue = Math.floor(Math.random() * 360);
  b.style.setProperty('--balloon-color', `hsl(${hue} 70% 80%)`);
  // Random horizontal drift
  const startX = Math.random() * window.innerWidth - window.innerWidth / 2;
  const endX = startX + (Math.random() * 100 - 50);
  b.style.setProperty('--startX', `${startX}px`);
  b.style.setProperty('--endX', `${endX}px`);
  // Duration 6–12s
  const dur = 6 + Math.random() * 6;
  b.style.setProperty('--duration', `${dur}s`);
  // Remove when animation ends
  b.addEventListener('animationend', () => b.remove());
  // Pop on click
  b.addEventListener('click', (e) => {
    e.stopPropagation();
    burstConfetti();
    b.remove();
  });
  balloonContainer.appendChild(b);
}
// spawn balloons every 1.5s
setInterval(createBalloon, 1500);

// ====== Toast jokes ======
const toastEl = $('#toast');
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 3000);
}
const extraJokes = [
  '🕷️ Spiderman says: "With great age comes great wisdom!"',
  '🐭 Jerry whispers: "Outsmart time like I outsmart Tom!"',
  '🐱 Tom meows: "60 years of chasing dreams? Purrfect!"',
  '🕸️ Spiderman swings by: "You\'re never too old to be amazing!"',
  '🧀 Jerry squeaks: "Age is just cheddar getting better!"',
  '🐾 Tom purrs: "Nine lives? You\'re on your best one yet!"',
];
let toastIndex = 0;
setInterval(() => {
  showToast(extraJokes[toastIndex]);
  toastIndex = (toastIndex + 1) % extraJokes.length;
}, 20000);

// ====== Body tap confetti ======
document.body.addEventListener('click', (e) => {
  // avoid double fire when interacting with buttons where own handlers already call confetti
  if (e.target.closest('button')) return;
  burstConfetti();
});

// ====== Native Share ======
$('#shareButton').addEventListener('click', async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Wish Mom Happy 60th!',
        text: 'Join me in wishing her a happy 60th birthday',
        url: window.location.href,
      });
    } catch (e) {
      /* ignored */
    }
  } else {
    prompt('Copy this link and share:', window.location.href);
  }
});
