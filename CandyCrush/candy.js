const candies = ["Blue", "Orange", "Green", "Yellow", "Red", "Purple"];
let board = [];
const rows = 9;
const columns = 9;
let score = 0;
let timeLeft = 50;
let timerInterval;

window.onload = () => {
  startGame();
  startTimer();
  setInterval(() => {
    crushCandy();
    slideCandy();
    generateCandy();
    updateScore();
  }, 100);
  document
    .getElementById("restartButton")
    .addEventListener("click", restartGame);
};
// Generate Board
function startGame() {
  board = [];
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";

  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("img");
      tile.id = `${r}-${c}`;
      tile.src = `./images/${randomCandy()}.png`;

      tile.draggable = true;
      tile.addEventListener("dragstart", dragStart);
      tile.addEventListener("dragover", dragOver);
      tile.addEventListener("drop", dragDrop);
      tile.addEventListener("dragend", dragEnd);

      boardDiv.appendChild(tile);
      row.push(tile);
    }
    board.push(row);
  }
}

// Random Candy Generator
function randomCandy() {
  return candies[Math.floor(Math.random() * candies.length)];
}

// Drag and Drop Handlers
let currTile, otherTile;

function dragStart() {
  currTile = this;
}

function dragOver(e) {
  e.preventDefault();
}

function dragDrop() {
  otherTile = this;
}

function dragEnd() {
  if (!currTile || !otherTile) return;

  let currCoords = currTile.id.split("-").map(Number);
  let otherCoords = otherTile.id.split("-").map(Number);

  let validMove = isAdjacent(currCoords, otherCoords);

  if (validMove) {
    let temp = currTile.src;
    currTile.src = otherTile.src;
    otherTile.src = temp;

    let valid = checkValid();
    if (!valid) {
      // Revert if not valid
      otherTile.src = currTile.src;
      currTile.src = temp;
    }
  }

  currTile = null;
  otherTile = null;
}

// Check if tiles are adjacent
function isAdjacent(coord1, coord2) {
  let [r1, c1] = coord1;
  let [r2, c2] = coord2;
  return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
}

// Crush Candies
function crushCandy() {
  // Check Horizontal Matches
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 2; c++) {
      let candy1 = board[r][c];
      let candy2 = board[r][c + 1];
      let candy3 = board[r][c + 2];
      if (
        candy1.src === candy2.src &&
        candy2.src === candy3.src &&
        !candy1.src.includes("blank")
      ) {
        candy1.src = "./images/blank.png";
        candy2.src = "./images/blank.png";
        candy3.src = "./images/blank.png";
        score += 30;
        playCrushSound();
      }
    }
  }

  // Check Vertical Matches
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 2; r++) {
      let candy1 = board[r][c];
      let candy2 = board[r + 1][c];
      let candy3 = board[r + 2][c];
      if (
        candy1.src === candy2.src &&
        candy2.src === candy3.src &&
        !candy1.src.includes("blank")
      ) {
        candy1.src = "./images/blank.png";
        candy2.src = "./images/blank.png";
        candy3.src = "./images/blank.png";
        score += 30;
        playCrushSound();
      }
    }
  }
}

// Slide Candies Down
function slideCandy() {
  let hasValidSlide = false;

  // Slide candies downward only if they result in a valid match
  for (let c = 0; c < columns; c++) {
    for (let r = rows - 1; r >= 0; r--) {
      if (board[r][c].src.includes("blank")) {
        for (let k = r - 1; k >= 0; k--) {
          if (!board[k][c].src.includes("blank")) {
            // Swap only if the move creates a valid match
            let temp = board[r][c].src;
            board[r][c].src = board[k][c].src;
            board[k][c].src = temp;

            if (checkValid()) {
              hasValidSlide = true;
            } else {
              // Revert if no valid match
              board[k][c].src = board[r][c].src;
              board[r][c].src = temp;
            }
            break;
          }
        }
      }
    }
  }

  // Generate new candies only if sliding created valid moves
  if (hasValidSlide) {
    generateCandy();
    updateScore();
    setTimeout(() => {
      crushCandy();
      slideCandy();
    }, 200); // Delay for smooth animation
  }
}

// Function to check if there are valid matches on the board
function checkValid() {
  // Check Horizontal Matches
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns - 2; c++) {
      if (
        board[r][c].src === board[r][c + 1].src &&
        board[r][c + 1].src === board[r][c + 2].src &&
        !board[r][c].src.includes("blank")
      ) {
        return true;
      }
    }
  }

  // Check Vertical Matches
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows - 2; r++) {
      if (
        board[r][c].src === board[r + 1][c].src &&
        board[r + 1][c].src === board[r + 2][c].src &&
        !board[r][c].src.includes("blank")
      ) {
        return true;
      }
    }
  }

  return false;
}

// Generate New Candies
function generateCandy() {
  for (let c = 0; c < columns; c++) {
    for (let r = 0; r < rows; r++) {
      if (board[r][c].src.includes("blank")) {
        board[r][c].src = `./images/${randomCandy()}.png`;
      }
    }
  }
}
//Play Sound when candy crush
function playCrushSound() {
  const sound = document.getElementById("crushSound");
  sound.currentTime = 0; // Rewind sound to the start
  sound.play().catch((e) => console.warn("Audio Play Error:", e));
}

// Timer
function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = timeLeft;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

// End Game
function endGame() {
  clearInterval(timerInterval);
  document.getElementById("gameOver").classList.remove("hidden");
}

// Restart Game
function restartGame() {
  window.location.reload();
}

// Update Score
function updateScore() {
  document.getElementById("score").innerText = score;
}
