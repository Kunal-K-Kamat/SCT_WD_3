const board = document.getElementById("board");
const message = document.getElementById("message");
const resetBtn = document.getElementById("reset");
const pvpBtn = document.getElementById("pvp");
const cpuBtn = document.getElementById("cpu");

let cells = [];
let currentPlayer = "X";
let gameActive = false;
let vsCPU = false;

const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function createBoard() {
  board.innerHTML = "";
  cells = [];
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
    cells.push(cell);
  }
}

function startGame(cpu = false) {
  vsCPU = cpu;
  currentPlayer = "X";
  gameActive = true;
  createBoard();
  message.textContent = cpu
    ? "Player vs Computer: X goes first!"
    : "Player vs Player: X goes first!";
}

function handleClick(e) {
  const cell = e.target;
  if (!gameActive || cell.textContent !== "") return;

  makeMove(cell, currentPlayer);

  if (checkWin(currentPlayer)) {
    endGame(false);
    return;
  }

  if (isDraw()) {
    endGame(true);
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  message.textContent = `Turn: ${currentPlayer}`;

  if (vsCPU && currentPlayer === "O") {
    setTimeout(cpuMove, 1000);
  }
}

function makeMove(cell, player) {
  cell.textContent = player;
  cell.classList.add(player.toLowerCase());
}

function cpuMove() {
  let move = findBestMove("O"); // try to win
  if (!move) move = findBestMove("X"); // block player
  if (!move) {
    const emptyCells = cells.filter((c) => c.textContent === "");
    move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  makeMove(move, "O");

  if (checkWin("O")) {
    endGame(false);
    return;
  }

  if (isDraw()) {
    endGame(true);
    return;
  }

  currentPlayer = "X";
  message.textContent = `Turn: ${currentPlayer}`;
}

function findBestMove(player) {
  for (let combo of winCombos) {
    const [a, b, c] = combo;
    const line = [cells[a], cells[b], cells[c]];
    const marks = line.map((cell) => cell.textContent);
    if (marks.filter((m) => m === player).length === 2 && marks.includes("")) {
      return line[marks.indexOf("")];
    }
  }
  return null;
}

function checkWin(player) {
  return winCombos.some((combo) =>
    combo.every((index) => cells[index].textContent === player)
  );
}

function isDraw() {
  return cells.every((cell) => cell.textContent !== "");
}

function endGame(draw) {
  gameActive = false;
  if (draw) {
    message.textContent = "It's a Draw!";
    cells.forEach((cell) => cell.classList.add("draw"));
  } else {
    message.textContent = `${currentPlayer} Wins!`;
    highlightWin(currentPlayer);
  }
}

function highlightWin(player) {
  winCombos.forEach((combo) => {
    if (combo.every((index) => cells[index].textContent === player)) {
      combo.forEach((index) => cells[index].classList.add("win"));
    }
  });
}

resetBtn.addEventListener("click", () => {
  createBoard();
  message.textContent = "Game reset! Choose mode.";
  gameActive = false;
});

pvpBtn.addEventListener("click", () => startGame(false));
cpuBtn.addEventListener("click", () => startGame(true));

// Initialize
createBoard();
