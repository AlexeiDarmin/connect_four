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

    cellElement.addEventListener("click", function() {
      const column = i % 7;
      makeMove(GLOBAL.boardState, column);
      makeRandomMove();
    });

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
  let gameState = getGameState(boardState);
  if (gameState !== GAME_STATE.ONGOING) {
    console.log("game ended, player won: ", gameState);
    return;
  }

  const index = findIndexOfLowestRow(boardState, column);
  if (index > -1) {
    boardState[index] = GLOBAL.nextPlayerTurn;
    togglePlayerTurn();
    updateDOM(boardState, index);
  }

  gameState = getGameState(boardState);
  if (gameState !== GAME_STATE.ONGOING) {
    console.log("game ended, player won: ", gameState);
    return;
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
    for (let c = 0; c < 4; c++) {
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
      ];
      const isWinning = isWinningSlice(boardSlice);
      if (isWinning !== false) return isWinning;
    }
  }

  // Check diagonals for a win
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 7; c++) {
      // Checks left diagonal
      if (c < 4) {
        const boardSlice = [
          boardState[r * 7 + c],
          boardState[(r + 1) * 7 + c + 1],
          boardState[(r + 2) * 7 + c + 2],
          boardState[(r + 3) * 7 + c + 3]
        ];
        const isWinning = isWinningSlice(boardSlice);
        if (isWinning !== false) return isWinning;
      }

      // Checks right diagonal
      if (c > 3) {
        const boardSlice = [
          boardState[r * 7 + c],
          boardState[(r + 1) * 7 + c - 1],
          boardState[(r + 2) * 7 + c - 2],
          boardState[(r + 3) * 7 + c - 3]
        ];
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

console.log("winning slice test", isWinningSlice([1, 1, 1, 1]));
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

// setInterval(makeRandomMove, 100);

function makeRandomMove() {
  const neurons = applyGameStateToNeuralNetwork(
    randomNeuralNetwork,
    GLOBAL.boardState,
    GLOBAL.nextPlayerTurn
  );

  let max = indexOfMax(neurons.map(n => n.value))
  console.log("neurons:", neurons);

    console.log('max', max)
  // const column = getRandomInteger(0, 7);
  const column = max
  makeMove(GLOBAL.boardState, column);
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}


function indexOfMax(arr) {
  if (arr.length === 0) {
      return -1;
  }

  var max = arr[0];
  var maxIndex = 0;

  for (var i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
          maxIndex = i;
          max = arr[i];
      }
  }

  return maxIndex;
}











/*
  Neural network code
*/

// Creates a layer of neurons
function createNeuralLayer(length) {
  const neurons = [];
  for (let i = 0; i < length; i++) {
    neurons.push(createNeuron());
  }
  return neurons;
}

function createNeuron() {
  return {
    value: 0,
    childrenSynapse: []
  };
}

// Creates synapsis between layers of neurons
function linkSynapsis(neuralNetwork) {
  for (let i = 1; i < neuralNetwork.length; i++) {
    const parentLayer = neuralNetwork[i - 1];
    const currentLayer = neuralNetwork[i]

    for (let parent_index = 0; parent_index < parentLayer.length; parent_index++) {
      for (let child_index = 0; child_index < currentLayer.length; child_index++) {
        const parentNeuron = parentLayer[parent_index];
        const childNeuron = currentLayer[child_index];
        createSynapse(parentNeuron, childNeuron);
      }
    }
  }
  return neuralNetwork;
}

function createSynapse(neuronOne, neuronTwo) {
  neuronOne.childrenSynapse.push({
    weight: getRandom(0, 1),
    neuron: neuronTwo
  });
}

// A neural network is a list of neural layers.
function createNeuralNetwork() {
  const inputLayerOne = createNeuralLayer(2);
  const inputLayerTwo = createNeuralLayer(126);
  const outputLayer = createNeuralLayer(8);

  const neuralNetwork = linkSynapsis([
    inputLayerOne,
    inputLayerTwo,
    outputLayer
  ]);

  console.log(neuralNetwork[0], neuralNetwork[1], neuralNetwork[2])

  return neuralNetwork;
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

// Updates the values of each input node with the relevant values from the game state
function applyGameStateToNeuralNetwork(neuralNetwork, board, playerTurn) {
  applyPlayerLayer(neuralNetwork[0], playerTurn);
  applyBoardLayer(neuralNetwork[1], board);
  debugger
  sumLayers(neuralNetwork[0], neuralNetwork[1]);
  resetLayer(neuralNetwork[2]);
  sumLayers(neuralNetwork[1], neuralNetwork[2]);

  console.log("neural network results: ", neuralNetwork[2]);
  return neuralNetwork[2];
}

// Evaluates the output layer based on the other neural layers and synapses.
function sumLayers(parentLayer, childLayer) {
  for (let i = 0; i < childLayer.length; i++) {
    debugger;
    const childNeuron = childLayer[i];
    let sum = 0;
    // calculate the sum of influence of the parent synapsis on current value
    for (let p = 0; p < parentLayer.length; p++) {
      sum += (parentLayer[p].value * parentLayer[p].childrenSynapse[i].weight)
    }
    debugger
    const influence = sum / parentLayer.length;
    childNeuron.value += influence;
  }
}

// Resets the values at the given layer
function resetLayer(layer) {
  for (let i = 0; i < layer.length; i++) {
    layer[i].value = 0;
  }
  console.log('reset layer:', layer)
}

function applyPlayerLayer(layer, player) {
  layer[0].value = player === PLAYERS.PLAYER_ONE ? 1 : 0;
  layer[1].value = player === PLAYERS.PLAYER_ONE ? 0 : 1;
}

function applyBoardLayer(layer, board) {
  // Empty cells
  for (let i = 0; i < board.length; i++) {
    if (board[i] === PLAYERS.EMPTY) {
      layer[i].value = 1;
    } else {
      layer[i].value = 0;
    }
  }

  // Player one owned cells
  for (let i = 0; i < board.length; i++) {
    if (board[i] === PLAYERS.PLAYER_ONE) {
      layer[i + (board.length - 1)].value = 1;
    } else {
      layer[i + (board.length - 1)].value = 0;
    }
  }

  // Player two owned cells
  for (let i = 0; i < board.length; i++) {
    if (board[i] === PLAYERS.PLAYER_ONE) {
      layer[i + (board.length - 1) * 2].value = 1;
    } else {
      layer[i + (board.length - 1) * 2].value = 0;
    }
  }
}



const rnn = JSON.stringify(createNeuralNetwork())

if (!JSON.parse(window.localStorage.getItem('connectFourNeuralNetwork'))) {
  console.log('initializing neural network for the first time!')
  window.localStorage.setItem('connectFourNeuralNetwork', rnn)
}

const randomNeuralNetwork = JSON.parse(window.localStorage.getItem('connectFourNeuralNetwork'))
console.log(randomNeuralNetwork)