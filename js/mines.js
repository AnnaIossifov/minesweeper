'use strict'

function chooseLevel(level) {
  console.log('chose level:')
  switch (level) {
    case 'beginner':
      gLevel = { SIZE: 4, MINES: 2 };
      break;
    case 'intermediate':
      gLevel = { SIZE: 8, MINES: 14 };
      break;
    case 'expert':
      gLevel = { SIZE: 12, MINES: 32 };
      break;
    default:
      break;
  }

  resetGame();
}

function setMines(board) {

  var minesPlaced = 0;

  while (minesPlaced < gLevel.MINES) {
    var randI = Math.floor(Math.random() * gLevel.SIZE);
    var randJ = Math.floor(Math.random() * gLevel.SIZE);

    // Check if the chosen cell already has a mine
    if (!board[randI][randJ].isMine) {
      board[randI][randJ].isMine = true;
      minesPlaced++;
    }
  }
}

function updateNeighborCounts(x, y) {
  for (var i = -1; i <= 1; i++) {
    for (var j = -1; j <= 1; j++) {
      const newX = x + i;
      const newY = y + j;

      if (isValidCell(newX, newY) && !board[newX][newY].isMine) {
        board[newX][newY].neighborCount++;
      }
    }
  }
}

function isValidCell(x, y) {
  return x >= 0 && x < gLevel.SIZE && y >= 0 && y < gLevel.SIZE;
}

function revealCell(x, y) {
  if (!isValidCell(x, y) || board[x][y].isOpen || gameOver) {
    return;
  }

  board[x][y].isOpen = true;

  if (board[x][y].isMine) {
    gameOver = true;
    revealAllMines();
    alert("Game Over! You clicked on a mine.");
  } else if (board[x][y].neighborCount === 0) {
    // If the cell has no neighboring mines, reveal its neighbors
    for (var i = -1; i <= 1; i++) {
      for (var j = -1; j <= 1; j++) {
        revealCell(x + i, y + j);
      }
    }
  }

  renderBoard();
}

function revealAllMines() {
  for (var i = 0; i < boardSize; i++) {
    for (var j = 0; j < boardSize; j++) {
      if (board[i][j].isMine) {
        board[i][j].isOpen = true;
      }
    }
  }
}

function flagCell(x, y) {
  if (!isValidCell(x, y) || board[x][y].isOpen || gameOver) {
    return;
  }

  board[x][y].isFlagged = !board[x][y].isFlagged;
  renderBoard();
}
