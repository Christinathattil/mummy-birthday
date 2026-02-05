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

// ====== Hero ======
$('#startButton').addEventListener('click', () => {
  burstConfetti();
  document.getElementById('wishSection').scrollIntoView({ behavior: 'smooth' });
});

// ====== Wish Carousel ======
const wishes = [
  { text: 'Wishing you decades of laughter!', name: 'Anita' },
  { text: 'Sixty & sassy—stay that way!', name: 'Raj' },
  { text: 'May your coffee be strong & naps long.', name: '' },
  { text: 'To more adventures and cake! 🍰', name: 'Alex' },
];
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
const answerKey = { q1: 'A', q2: 'A', q3: 'A' };
$('#submitQuiz').addEventListener('click', () => {
  const form = new FormData($('#quizForm'));
  let score = 0;
  Object.keys(answerKey).forEach((q) => {
    if (form.get(q) === answerKey[q]) score++;
  });
  const result = $('#quizResult');
  result.textContent = score === 3 ? 'Perfect! You\'re an Official Mom Expert 🏅' : `You got ${score}/3! Still pretty nifty.`;
  result.classList.remove('hidden');
  burstConfetti();
});

// ====== Gift Box Joke ======
const jokes = [
  'Turning 60 means never having to ask "Are we there yet?"—you\'ve arrived!',
  '60 is just 21 in Celsius.',
  'At 60, your warranty has officially expired—enjoy the freedom!',
];
let jokeShown = false;
$('#giftBox').addEventListener('touchstart', revealJoke, { passive: true });
$('#giftBox').addEventListener('click', revealJoke);
function revealJoke() {
  if (jokeShown) return;
  const joke = jokes[Math.floor(Math.random() * jokes.length)];
  $('#jokeText').textContent = joke;
  $('#jokeText').classList.remove('hidden');
  $('#giftBox').textContent = '🎉';
  jokeShown = true;
}

// ====== Memory Flip Cards ======
$$('.flip-card').forEach((card) => {
  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
  });
});

// ====== Countdown ======
const countdownEl = $('#countdown');
// Set target: next birthday at midnight local time (adjust if already past)
const now = new Date();
let target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
// If already past bedtime, maybe next day; but realistically, customize date below
if (target - now < 0) {
  target.setDate(target.getDate() + 1);
}
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
