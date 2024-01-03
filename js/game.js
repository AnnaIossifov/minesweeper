'use strict'

const FLAG = '🚩'
const MINE = '💣'

const EMPTY = ''

var minesAroundCount
var LEVEL

var gameOver = false
var TIMER
var LIFE
// var gMineCount

var gIntervalId
var gStartTime
var gFirstClick = true

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
    life: 3
}

function onInit() {
    gGame.isOn = true  // Reset game state
    // gGame.shownCount = 0
    // gGame.markedCount = 0
    // gGame.secsPassed = 0
    // stopTimer()
    // resetTimer()

    // Other initialization code...
    const gBoard = buildBoard()
    renderBoard(gBoard)
    placeMines()
    setMinesNegsCount()
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

function renderLife() {
    for (var i = 1; i <= 3; i++) {
        var heart = document.querySelector('.life-' + i);
        if (i <= gGame.life) {
            heart.style.display = 'inline-block';
        } else {
            heart.style.display = 'none';
        }
    }
}