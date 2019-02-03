const PLAYER_ONE = "player_one";
const PLAYER_TWO = "player_two";
const EMPTY = "player_none";

const PLAYERS = { EMPTY, PLAYER_ONE, PLAYER_TWO };

const GAME_STATE = {
  PLAYER_ONE,
  PLAYER_TWO,
  DRAW: 0,
  ONGOING: -1
};
const GLOBAL = {
  boardState: initializeBoardState(),
  nextPlayerTurn: PLAYERS.PLAYER_ONE
};

function buildBoard() {
  const boardContainer = document.getElementById("boardContainer");

  for (let i = 0; i < 42; i++) {
    const cellElement = document.createElement("DIV");
    cellElement.classList.add("cell");
    boardContainer.appendChild(cellElement);
  }
}

buildBoard();

function initializeBoardState() {
  const boardState = [];
  for (let i = 0; i < 42; i++) {
    boardState.push(PLAYERS.EMPTY);
  }
  return boardState;
}

function togglePlayerTurn() {
  GLOBAL.nextPlayerTurn =
    GLOBAL.nextPlayerTurn === PLAYERS.PLAYER_ONE
      ? PLAYERS.PLAYER_TWO
      : PLAYERS.PLAYER_ONE;
}

function makeMove(boardState, column) {
  const gameState = getGameState(boardState)
  if (gameState !== GAME_STATE.ONGOING) {
    console.log('game ended, player won: ', gameState)
    return 
  }

  const index = findIndexOfLowestRow(boardState, column);
  if (index > -1) {
    boardState[index] = GLOBAL.nextPlayerTurn;
    togglePlayerTurn();
    updateDOM(boardState, index);
  }

  return boardState;
}

// Returns the index of lowest empty row at the specific column, -1 if no available empty cells.
function findIndexOfLowestRow(boardState, column) {
  for (let r = 5; r >= 0; r--) {
    if (boardState[r * 7 + column] === PLAYERS.EMPTY) {
      return r * 7 + column;
    }
  }
  return -1;
}

function updateDOM(boardState, index) {
  const cellElement = document.getElementsByClassName("cell")[index];
  cellElement.classList.add(boardState[index]);
}

/*
 Returns the ID of the winning player if the game is won.
 Returns 0 if the game is a draw.
 Returns -1 if the game is ongoing
*/
function getGameState(boardState) {
  // Check rows for a win
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c <= 4; c++) {
      const i = r * 7 + c;
      const isWinning = isWinningSlice(boardState.slice(i, i + 4));
      if (isWinning !== false) return isWinning;
    }
  }

  // Check columns
  for (let c = 0; c < 7; c++) {
    for (let r = 0; r <= 2; r++) {
      const boardSlice = [
        boardState[r * 7 + c],
        boardState[(r + 1) * 7 + c],
        boardState[(r + 2) * 7 + c],
        boardState[(r + 3) * 7 + c]
      ]
      const isWinning = isWinningSlice(boardSlice);
      if (isWinning !== false) return isWinning;
    }
  }

  // Check diagonals for a win
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 7; c++) {
      // Checks right diagonal
      if (c < 4) {
        const boardSlice = [
          boardState[r * 7 + c],
          boardState[(r + 1) * 7 + c + 1],
          boardState[(r + 2) * 7 + c + 2],
          boardState[(r + 3) * 7 + c + 3]
        ]
        const isWinning = isWinningSlice(boardSlice);
        if (isWinning !== false) return isWinning;
      }

      // Checks left diagonal
      if (c > 3) {
        const boardSlice = [
          boardState[r * 7 + c],
          boardState[(r + 1) * 7 + c - 1],
          boardState[(r + 2) * 7 + c - 2],
          boardState[(r + 3) * 7 + c - 3]
        ]
        const isWinning = isWinningSlice(boardSlice);
        if (isWinning !== false) return isWinning;
      }
    }
  }

  if (boardState.some(val => val === PLAYERS.EMPTY)) {
    return GAME_STATE.ONGOING;
  }

  return GAME_STATE.DRAW;
}


console.log('winning slice test', isWinningSlice([1,1,1,1]))
// Takes 4 cells and returns the winning player's ID if they all match that one player.
// Returns false otherwise.
function isWinningSlice(miniBoard) {
  if (miniBoard.some(p => p === PLAYERS.EMPTY)) {
    return false;
  }
  if (
    miniBoard[0] === miniBoard[1] &&
    miniBoard[1] === miniBoard[2] &&
    miniBoard[2] === miniBoard[3]
  ) {
    return miniBoard[0];
  }

  return false;
}

// Hacky random moves below

setInterval(makeRandomMove, 1000);

function makeRandomMove() {
  const column = getRandomInteger(0, 7);
  makeMove(GLOBAL.boardState, column);
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

console.log(GLOBAL.boardState);

// event listeners for columns - only applicable for player v player - HTML side
// API for making moves

/*
  Making moves
- pick a column
- find the lowest empty row to fit a piece
*/

/* 
  Check win conditions
*/
