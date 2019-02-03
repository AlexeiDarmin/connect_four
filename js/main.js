const PLAYER_ONE = 'player_one'
const PLAYER_TWO = 'player_two'
const EMPTY = 'player_none'

const PLAYERS = { EMPTY, PLAYER_ONE, PLAYER_TWO}

const GLOBAL = {
  boardState: initializeBoardState(),
  nextPlayerTurn: PLAYERS.PLAYER_ONE
}



function buildBoard() {
  const boardContainer = document.getElementById('boardContainer')
  
  for (let i = 0; i < 42; i++) {
    const cellElement = document.createElement("DIV")
    cellElement.classList.add("cell") 
    boardContainer.appendChild(cellElement)
  }
}

buildBoard()


function initializeBoardState() {
  const boardState = []
  for(let i = 0; i < 42; i++) {
    boardState.push(PLAYERS.EMPTY)
  }
  return boardState
}

function togglePlayerTurn() {
  GLOBAL.nextPlayerTurn = GLOBAL.nextPlayerTurn === PLAYERS.PLAYER_ONE ? PLAYERS.PLAYER_TWO : PLAYERS.PLAYER_ONE
}

function makeMove(boardState, column) {
  const index = findIndexOfLowestRow(boardState, column)
  console.log('index found:', index)
  if (index > -1) {
    boardState[index] = GLOBAL.nextPlayerTurn
    togglePlayerTurn()
    updateDOM(boardState, index)
  }

  return boardState
}


// Returns the index of lowest empty row at the specific column, -1 if no available empty cells.
function findIndexOfLowestRow(boardState, column) {
  for (let r = 5; r > 0; r--) {
    console.log('r, c', r, column, r * 7 + column)
    debugger
    if (boardState[r * 7 + column] === PLAYERS.EMPTY) {
      return r * 7 + column
    }
  }
  return -1
}

function updateDOM(boardState, index) {
  debugger
  const cellElement = document.getElementsByClassName('cell')[index]
  cellElement.classList.add(boardState[index]) 
}






// Hacky random moves below

setInterval(makeRandomMove, 1000)

function makeRandomMove() {
  const column = getRandomInteger(0, 7)
  makeMove(GLOBAL.boardState, column)
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

console.log(GLOBAL.boardState)

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