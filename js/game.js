'use strict'

const FLAG = '🚩'
const MINE = '💣'

const EMPTY = ''

var minesAroundCount
var gMineCount
var LEVEL

var gameOver = false
var TIMER
// var LIFE
var gBoard

var gIntervalId
var gStartTime
var gFirstClick = true

const LEFT_MOUSE_BUTTON = 0;
const RIGHT_MOUSE_BUTTON = 2;

var gLevel = {
    SIZE: 4,  //rows and cols
    MINES: 2
}

// This is an object in which you can keep and update the current game state:
// isOn: Boolean, when true we let the user play 
// shownCount: How many cells are shown 
// markedCount: How many cells are marked (with a flag) 
// secsPassed: How many seconds passed
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    correctlyMarkedMines: 0
    // life: 3
}

var gBoard = buildBoard()

function onInit() {
    gGame.isOn = true  // Reset game state
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    // stopTimer()
    // resetTimer()

    // Other initialization code...
    gBoard = buildBoard()
    renderBoard(gBoard)
    setMines(gBoard)
    setMinesNegsCount(gBoard)
    console.log('Board is ready.')
}

function getRandomCoordinate() {
    var x, y;
    do {
        x = Math.floor(Math.random() * boardSize);
        y = Math.floor(Math.random() * boardSize);
    } while (board[x][y].isMine);

    return [x, y];
}

function setMinesNegsCount(board) {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount = countMinesAround(board, i, j);
            }
        }
    }
}

function countMinesAround(board, row, col) {
    var count = 0;

    for (var i = Math.max(0, row - 1); i <= Math.min(row + 1, gLevel.SIZE - 1); i++) {
        for (var j = Math.max(0, col - 1); j <= Math.min(col + 1, gLevel.SIZE - 1); j++) {
            if (i !== row || j !== col) {
                if (board[i][j].isMine) {
                    count++;
                }
            }
        }
    }
    return count;
}

// function renderLife() {
//     for (var i = 1; i <= 3; i++) {
//         var heart = document.querySelector('.life-' + i);
//         if (i <= gGame.life) {
//             heart.style.display = 'inline-block';
//         } else {
//             heart.style.display = 'none';
//         }
//     }
// }

function checkGameOver() {
    var totalCells = gLevel.SIZE * gLevel.SIZE;
    console.log('gGame.shownCount:', gGame.shownCount);
    console.log('gGame.markedCount:', gGame.markedCount);
    console.log('gGame.correctlyMarkedMines:', gGame.correctlyMarkedMines);
    // Check if all non-mine cells are opened, all mines are flagged, and no bombs are hit
    if (
        gGame.shownCount === totalCells - gLevel.MINES &&
        gGame.markedCount === gLevel.MINES &&
        gGame.correctlyMarkedMines === gLevel.MINES &&
        !gBoard.some(row => row.some(cell => cell.isMine && cell.isShown))
    ) {
        // The player won!
        alert('Congratulations! You won!');
        resetGame();
    }
}

function gameOver() {
    gGame.isOn = false
    stopTimer(); // Stop timer
    resetTimer()
    alert('Game over! You hit a mine!')
}

function resetGame() {
    console.log('resetting game.......')
    console.log('Step 1: Resetting variables...')

    gGame.isOn = true
    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gGame.correctlyMarkedMines = 0
    // gGame.life = 3

    console.log('stopping the timer')
    
    stopTimer()
    resetTimer()
    // renderLife()

    // Update the level and rebuild the board
    console.log('building new board');
    gBoard = buildBoard();
    setMines(gBoard);
    setMinesNegsCount(gBoard);

    renderBoard(gBoard);
}

function resetFlagsAndMarks(board) {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j].isMarked = false;
            board[i][j].isFlagged = false;
        }
    }
}