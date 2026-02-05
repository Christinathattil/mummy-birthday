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

// ====== Visitor Counter ======
function incrementVisitors() {
  let count = parseInt(localStorage.getItem('visitorCount') || '0');
  count++;
  localStorage.setItem('visitorCount', count);
  return count;
}
function getVisitorCount() {
  return parseInt(localStorage.getItem('visitorCount') || '0');
}

// ====== Hero ======
const visitorCountEl = $('#visitorCount');
let hasClicked = sessionStorage.getItem('hasClickedStart');
if (!hasClicked) {
  visitorCountEl.textContent = `${getVisitorCount()} ${getVisitorCount() === 1 ? 'person has' : 'people have'} wished Mummy today 🤩`;
} else {
  visitorCountEl.textContent = `${getVisitorCount()} ${getVisitorCount() === 1 ? 'person has' : 'people have'} wished Mummy today 🤩`;
}

$('#startButton').addEventListener('click', () => {
  if (!sessionStorage.getItem('hasClickedStart')) {
    const count = incrementVisitors();
    visitorCountEl.textContent = `${count} ${count === 1 ? 'person has' : 'people have'} wished Mummy today 🤩`;
    sessionStorage.setItem('hasClickedStart', 'true');
  }
  burstConfetti();
  document.getElementById('wishSection').scrollIntoView({ behavior: 'smooth' });
});

// ====== Wish Carousel ======
function loadWishes() {
  const stored = localStorage.getItem('wishes');
  if (stored) {
    return JSON.parse(stored);
  }
  return [
    { text: 'Wishing you decades of laughter!', name: 'Anita' },
    { text: 'Sixty & sassy—stay that way!', name: 'Raj' },
    { text: 'May your coffee be strong & naps long.', name: '' },
    { text: 'To more adventures and cake! 🍰', name: 'Alex' },
  ];
}
function saveWishes() {
  localStorage.setItem('wishes', JSON.stringify(wishes));
}
const wishes = loadWishes();
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
$('#submitWish').addEventListener('click', () => {
  const text = $('#wishInput').value.trim();
  if (!text) return;
  const name = $('#nameInput').value.trim();
  wishes.push({ text, name });
  saveWishes();
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
const answerKey = { q1: 'A', q2: 'C', q3: 'C' };

// Q3 interactive - float correct option near wrong attempts
const wrongOptions = $$('.option-label[data-value="A"], .option-label[data-value="B"], .option-label[data-value="D"]');
const correctOpt = $('#correctOption');
wrongOptions.forEach(opt => {
  opt.addEventListener('click', (e) => {
    e.preventDefault();
    const rect = opt.getBoundingClientRect();
    correctOpt.style.position = 'fixed';
    correctOpt.style.left = rect.left + 'px';
    correctOpt.style.top = (rect.top - 60) + 'px';
    correctOpt.style.zIndex = '100';
    correctOpt.style.background = '#fef08a';
    correctOpt.style.padding = '8px';
    correctOpt.style.borderRadius = '8px';
    correctOpt.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    setTimeout(() => {
      correctOpt.style.position = '';
      correctOpt.style.left = '';
      correctOpt.style.top = '';
      correctOpt.style.zIndex = '';
      correctOpt.style.background = '';
      correctOpt.style.padding = '';
      correctOpt.style.borderRadius = '';
      correctOpt.style.boxShadow = '';
    }, 2000);
  });
});

$('#submitQuiz').addEventListener('click', () => {
  const form = new FormData($('#quizForm'));
  let score = 0;
  Object.keys(answerKey).forEach((q) => {
    if (form.get(q) === answerKey[q]) score++;
  });
  const result = $('#quizResult');
  if (score === 3) {
    result.textContent = 'Perfect! You\'re an Official Mom Expert 🏅';
  } else if (form.get('q3') !== 'C') {
    result.textContent = `Nice try! But we all know the 3rd child is the favourite 😉 Score: ${score}/3`;
  } else {
    result.textContent = `You got ${score}/3! Still pretty nifty.`;
  }
  result.classList.remove('hidden');
  burstConfetti();
});

// ====== Magic 8-Ball ======
const oracleAnswers = [
  'Mom says: More cake is always the answer!',
  'The oracle predicts: Unlimited naps in your future!',
  'Mom\'s wisdom: Age is just a number, cake is forever.',
  'Signs point to: Another embarrassing story incoming!',
  'Outlook good: You\'ll get the best hugs today!',
  'Reply hazy: Ask again after coffee.',
  'Mom says: Stop asking and just eat the cake!',
  'The stars align: Dance like nobody\'s watching!',
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
  'Cake calories don\'t count today!',
  'Age is merely the number of years the world has enjoyed you!',
  'Free refills on wisdom at 60!',
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
