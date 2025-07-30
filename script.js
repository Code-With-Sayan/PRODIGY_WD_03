const board = document.getElementById('board');
const statusDiv = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const modeRadios = document.querySelectorAll('input[name="mode"]');

let currentPlayer = 'X';
let gameActive = true;
let boardState = Array(9).fill('');
let mode = 'pvp';

const winCombos = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

// Create board
function initBoard() {
  board.innerHTML = '';
  boardState = Array(9).fill('');
  gameActive = true;
  currentPlayer = 'X';
  statusDiv.textContent = "Player X's Turn";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleClick);
    board.appendChild(cell);
  }
}

function handleClick(e) {
  const index = e.target.dataset.index;

  if (!gameActive || boardState[index] !== '') return;

  makeMove(index, currentPlayer);
  
  if (checkWin(currentPlayer)) {
    statusDiv.textContent = `Player ${currentPlayer} Wins!`;
    gameActive = false;
    return;
  } else if (boardState.every(cell => cell !== '')) {
    statusDiv.textContent = `It's a Draw!`;
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusDiv.textContent = `Player ${currentPlayer}'s Turn`;

  if (mode === 'ai' && currentPlayer === 'O' && gameActive) {
    setTimeout(aiMove, 500);
  }
}

function makeMove(index, player) {
  boardState[index] = player;
  const cell = board.querySelector(`.cell[data-index="${index}"]`);
  cell.textContent = player;
  cell.style.pointerEvents = 'none';
}

function aiMove() {
  const emptyIndices = boardState
    .map((val, idx) => val === '' ? idx : null)
    .filter(idx => idx !== null);

  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  makeMove(randomIndex, 'O');

  if (checkWin('O')) {
    statusDiv.textContent = 'AI Wins!';
    gameActive = false;
  } else if (boardState.every(cell => cell !== '')) {
    statusDiv.textContent = `It's a Draw!`;
    gameActive = false;
  } else {
    currentPlayer = 'X';
    statusDiv.textContent = `Player X's Turn`;
  }
}

function checkWin(player) {
  return winCombos.some(combo =>
    combo.every(index => boardState[index] === player)
  );
}

resetBtn.addEventListener('click', initBoard);

modeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    mode = document.querySelector('input[name="mode"]:checked').value;
    initBoard();
  });
});

// Start the game
initBoard();
