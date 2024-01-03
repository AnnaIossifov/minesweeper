'use strict'

const FLAG = '🚩'
const MINE = '💣'

const EMPTY = ''

var minesAroundCount
var LEVEL = 4

var gameOver = false
var TIMER
var LIFE
var gMineCount

var gIntervalId 
var gStartTime

// This is an object in which you can keep and update the current game state:
// isOn: Boolean, when true we let the user play 
// shownCount: How many cells are shown 
// markedCount: How many cells are marked (with a flag) 
// secsPassed: How many seconds passed
var gGame = {
    isOn: true,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {
    // chooseLevel()
    // setMinesNegsCount(board);
    const gBoard = buildBoard()
    renderBoard(gBoard)
    console.log('Reset complete. Board re-rendered.')
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
    for (var i = 0; i <= row + 1; i++) {
        for (var j = 0; j <= col + 1; j++) {
            if (i >= 0 && i < gLevel.SIZE && j >= 0 && j < gLevel.SIZE && board[i][j].isMine) {
                count++;
            }
        }
    }
    return count;
}



