const cells = document.querySelectorAll(".cell");
const messages = document.querySelector("#message");
const restartBtn = document.querySelector("#restartBtn");
const winConditions = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // slant
    [0, 4, 8],
    [2, 4, 6],
];

let options =["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

runGame()
function runGame(){
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    messages.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function cellClicked(){
    const cellIndex = this.getAttribute("cellIndex");

    if(options[cellIndex] != "" || !running){
        return;
    }

    updateCell(this, cellIndex);
    // changePlayer();
    checkWinner()
}

function updateCell(cell, index){
    cell.textContent = currentPlayer;
    options[index] = currentPlayer;
}

function changePlayer(){
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    messages.textContent = `${currentPlayer}'s turn`;
}

function checkWinner(){
    let roundWon = false;

    for(let i = 0; i < winConditions.length; i++){
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }
        if(cellA == cellB && cellB == cellC){
            roundWon = true;
            break;
        }
    }

    if(roundWon){
        messages.textContent = `${currentPlayer} wins!`;
        running = false;
    }
    else if(!options.includes("")){
        messages.textContent = `draw!`;
        running = false;
    }
    else{
        changePlayer();
    }
}

function restartGame(){
    currentPlayer = "X";
    options =["","","","","","","","",""];
    messages.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    running = true;
}