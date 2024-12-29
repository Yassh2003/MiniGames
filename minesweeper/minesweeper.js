let board = [];
let rows = 8;
let columns = 8;

let minesCount = 10;
let minesLocation = [];

let tilesClicked = 0;
let flagEnabled = false;

let gameOver = false;

window.onload = function() {
    startGame();
}

function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function startGame() {
    gameOver = false;
    tilesClicked = 0;
    minesLocation = [];
    setMines();
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    document.getElementById("restart-button").addEventListener("click", restartGame);

    // Clear existing board
    document.getElementById("board").innerHTML = "";

    // Reset the board array
    board = [];

    // Populate our board
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile"); // Add tile class for styling
            tile.addEventListener("click", clickTile);  // Reattach click event listener to each tile
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

function restartGame() {
    // Reset the game variables and board
    startGame();
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    } else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        } else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }

    if (minesLocation.includes(tile.id)) {
        gameOver = true;
        revealMines();
        return;
    }

    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);
}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    // Top 3
    minesFound += checkTile(r-1, c-1);      // top left
    minesFound += checkTile(r-1, c);        // top
    minesFound += checkTile(r-1, c+1);      // top right

    // Left and right
    minesFound += checkTile(r, c-1);        // left
    minesFound += checkTile(r, c+1);        // right

    // Bottom 3
    minesFound += checkTile(r+1, c-1);      // bottom left
    minesFound += checkTile(r+1, c);        // bottom
    minesFound += checkTile(r+1, c+1);      // bottom right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    } else {
        board[r][c].innerText = "";
        checkMine(r-1, c-1);    // top left
        checkMine(r-1, c);      // top
        checkMine(r-1, c+1);    // top right
        checkMine(r, c-1);      // left
        checkMine(r, c+1);      // right
        checkMine(r+1, c-1);    // bottom left
        checkMine(r+1, c);      // bottom
        checkMine(r+1, c+1);    // bottom right
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}
