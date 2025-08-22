const cells = document.querySelectorAll(".cell");
const messages = document.querySelector("#message");
const restartBtn = document.querySelector("#restartBtn");
const modeSelect = document.querySelector("#mode");
const difficultySelect = document.querySelector("#difficulty");

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diagonals
];

let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

runGame();

function runGame() {
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    messages.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function cellClicked() {
    const cellIndex = this.getAttribute("cellIndex");

    if (options[cellIndex] !== "" || !running) {
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();

    // If bot mode and still running
    if (modeSelect.value === "bot" && running && currentPlayer === "O") {
        setTimeout(botMove, 500);
    }
}

function updateCell(cell, index) {
    cell.textContent = currentPlayer;
    options[index] = currentPlayer;
}

function changePlayer() {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    messages.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {
    let roundWon = false;

    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (options[a] && options[a] === options[b] && options[a] === options[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        messages.textContent = `${currentPlayer} wins!`;
        running = false;
    } else if (!options.includes("")) {
        messages.textContent = "Draw!";
        running = false;
    } else {
        changePlayer();
    }
}

function restartGame() {
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    messages.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    running = true;
}

// ---------------- BOT LOGIC ---------------- //

function botMove() {
    let move;
    if (difficultySelect.value === "easy") {
        move = easyMove();
    } else if (difficultySelect.value === "medium") {
        move = Math.random() < 0.5 ? easyMove() : bestMove();
    } else {
        move = bestMove();
    }

    const cell = cells[move];
    updateCell(cell, move);
    checkWinner();
}

function easyMove() {
    const empty = options
        .map((val, idx) => (val === "" ? idx : null))
        .filter(v => v !== null);
    return empty[Math.floor(Math.random() * empty.length)];
}

function bestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < options.length; i++) {
        if (options[i] === "") {
            options[i] = "O";
            let score = minimax(options, 0, false);
            options[i] = "";
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

const scores = { X: -1, O: 1, tie: 0 };

function minimax(board, depth, isMaximizing) {
    let result = checkWinnerMinimax(board);
    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinnerMinimax(board) {
    for (let [a, b, c] of winConditions) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return board.includes("") ? null : "tie";
}