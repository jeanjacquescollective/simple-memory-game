const symbols = [
  '👩‍🎤',
  '🦄',
  '🍕',
  '🌻',
  '🚀',
  '🍔',
  '🎉',
  '🌈',
  '🎨',
  '🐬',
  '🌸',
  '🌊',
  '🍩',
  '🎸',
  '🍉',
  '🍓',
  '🌵',
  '🍁',
  '🐞',
  '🎃',
  '🦜',
  '🎓',
  '🚲',
  '🦈',
  '👨‍👩‍👧‍👦',
  '🌺',
  '🐘',
  '👽',
  '🚁',
  '🍂',
  '🍟',
  '👑',
  '🌳',
  '🎤',
  '🌉',
  '🚢',
  '🌭',
  '🌅',
  '🐾',
  '🎥',
  '🍭',
];

const BASE_SCORE = 100; // The base score for completing the game
const TIME_PENALTY = 10; // The number of points to subtract for each second elapsed
const DIFFICULTY_BONUS = 50; // The bonus points for completing a harder level

// Define variables
const gameContainer = document.querySelector('.game-container');
const levelSelect = document.querySelector('.level-select');
const gameBoard = document.querySelector('.game-board');
const timerElement = document.querySelector('.score__timer');
const highScoreElement = document.querySelector('.highscore__value');

let seconds = 0;
let score = 0;
let timerInterval;
let cards = [];
let flippedCards = [];

let highScore = JSON.parse(localStorage.getItem('highScore')) || 0;

highScoreElement.textContent = highScore;

// init game
const initGame = (numCards = 8) => {
  seconds = 0;
  timerElement.textContent = '0:00';
  clearInterval(timerInterval);
  createCards(numCards);
  timerInterval = setInterval(() => {
    seconds++;
    timerElement.textContent = `${Math.floor(seconds / 60)}:${(seconds % 60)
      .toString()
      .padStart(2, '0')}`;
  }, 1000);
};

// Define functions
function createCards(numCards) {
  const cardValues = [];
  for (let i = 1; i <= numCards / 2; i++) {
    cardValues.push(i);
    cardValues.push(i);
  }
  shuffleArray(cardValues);
  cards = cardValues.map((value) => ({
    value,
    flipped: false,
    matched: false,
  }));
  displayCards();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; //fix this line of code, should swap the values
  }
}

function displayCards() {
  gameBoard.innerHTML = '';
  cards.forEach((card) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    if (card.flipped) {
      cardElement.innerHTML = symbols[card.value];
      cardElement.classList.add('flipped');
    }
    if (card.matched) {
      cardElement.classList.add('matched');
      cardElement.innerHTML = symbols[card.value];
    }
    cardElement.addEventListener('click', () => flipCard(card));
    gameBoard.appendChild(cardElement);
  });
}

function flipCard(clickedCard) {
  if (flippedCards.length < 2 && !clickedCard.flipped && !clickedCard.matched) {
    clickedCard.flipped = true;
    flippedCards.push(clickedCard);
    displayCards();
    if (flippedCards.length === 2) {
      if (flippedCards[0].value === flippedCards[1].value) {
        flippedCards.forEach((card) => (card.matched = true));
      }
      setTimeout(() => {
        flippedCards.forEach((card) => (card.flipped = false));
        flippedCards = [];
        checkWin();
        displayCards();
      }, 1000);
    }
  }
}

function checkWin() {
  if (cards.every((card) => card.matched)) {
    clearInterval(timerInterval);
    let score = calculateScore(cards.length);
    if (score > highScore || highScore === 0) {
      highScore = score;
      localStorage.setItem('highScore', JSON.stringify(highScore));
      highScoreElement.textContent = highScore;
    }
    alert('You win!');
  }
}

function calculateScore(numCards) {
  // Calculate the time penalty
  const timePenalty = seconds * TIME_PENALTY;
  // Calculate the difficulty bonus
  const difficultyBonus = numCards * DIFFICULTY_BONUS;
  // Calculate the total score
  score = BASE_SCORE - timePenalty + difficultyBonus;
  // Round the score to the nearest integer
  score = Math.round(score);
  return score;
}

// Event Listeners
levelSelect.addEventListener('click', (event) => {
  let numCards = parseInt(event.target.getAttribute('data-level'));
  initGame(numCards);
});

gameContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('reset-button')) {
    initGame(cards.length);
  }
});

// Initialize game
// initGame();
