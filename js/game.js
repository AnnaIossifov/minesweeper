'use strict'


const MINE = '🚩'
const FLAG = '💣'

const EMPTY = ''

var minesAroundCount
var LEVEL = 4

var gBoard = []

var gameOver = false
var TIMER
var LIFE
var gMineCount

// = { 
//     minesAroundCount: 4,
//     isShown: false,
//     isMine: false,
//     isMarked: true
// }


// This is an object by which the board size is set 
// (in this case: 4x4 board and how many mines to place)
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
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function onInit() {
    // placeMines();
    // setMinesNegsCount(board);
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard() {
    console.log('hi there')
    var board = [];
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
                isFlagged: false
            }
        }
    }
    setMines(board)
    setMinesNegsCount(board)
    console.table(board)
    return board
}


function getRandomCoordinate() {
    let x, y;
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

function renderBoard(board) {

    const elContainer = document.querySelector('.game-board')
    elContainer.innerHTML = ""

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            const cell = document.createElement('div')
            cell.className = 'cell'
            cell.textContent = ""
            
            
            if (board[i][j].isOpen) {
                if (board[i][j].isMine) {
                    cell.textContent = MINE
                    cell.style.backgroundColor = 'red'
                } else {
                    const count = board[i][j].neighborCount
                    cell.textContent = count > 0 ? count : ''
                    cell.style.backgroundColor = '#ddd'
                }
            } else if (board[i][j].isFlagged) {
                cell.textContent = FLAG
            }

            cell.addEventListener("click", (event) => {
                if (!gameOver) {
                    if (event.button === 0) {
                        revealCell(i, j)
                    } else if (event.button === 2) {
                        flagCell(i, j)
                    }
                }
            })

            elContainer.appendChild(cell);
        }
    }
}



// function renderBoard(board) {
//     var strHTML = '<table><tbody>'
//     for (var i = 0; i < gLevel.SIZE; i++) {
//         strHTML += '<tr>';
//         for (var j = 0; j < gLevel.SIZE; j++) {
//             var cellContent = ''

//             if (board[i][j].isMine && board[i][j].isShown) {

//                 cellContent = board[i][j].isMine ? '<img src="img\mine.png" alt="mine">' : board[i][j].minesAroundCount;
//                 console.log('cellContent', cellContent);
//             } else if (board[i][j].isMarked || board[i][j].isFlagged) {
//                 cellContent = '<img src="img\flag.png" alt="flag">';
//             }

//             strHTML += `<td onclick="onCellClicked(this, ${i}, ${j})" 
//             oncontextmenu="onCellMarked(event, this)
//             return false;">
//             ${cellContent}
//             </td>`;
//         }
//         strHTML += '</tbody></table>'
//     }
//     strHTML += '</table>';
//     const elContainer = document.querySelector('.game-board')
//     elContainer.innerHTML = strHTML
// }



function onCellClicked(elCell, i, j) {
    if (!gGame.isOn || gBoard[i][j].isMarked || gBoard[i][j].isShown) return;

    gBoard[i][j].isShown = true;
    gGame.shownCount++

    if (gBoard[i][j].isMine) {
        gameOver()
    } else {
        expandShown(gBoard, elCell, i, j)
    }

    checkGameOver()
    renderBoard(gBoard)
}

function expandShown(gBoard, elCell, i, j) { //implementation for 1st degree neighbors
    for (var row = i - 1; row <= i + 1; row++) {
        for (var col = j - 1; col <= j + 1; col++) {
            if (row >= 0 && row < gLevel.SIZE && col >= 0 && col < gLevel.SIZE && !gBoard[row][col].isMine) {
                gBoard[row][col].isShown = true;
                gGame.shownCount++;
            }
        }
    }
}

function onCellMarked(elCell) {

    if (!gGame.isOn) return;

    var i = elCell.parentNode.rowIndex;
    var j = elCell.cellIndex

    if (gBoard[i][j].isShown) return;

    if (!gBoard[i][j].isMarked && !gBoard[i][j].isFlagged) {
        gBoard[i][j].isMarked = true;
        elCell.innerHTML = FLAG
        gGame.markedCount++;

    } else if (gBoard[i][j].isMarked || gBoard[i][j].isFlagged) {
        gBoard[i][j].isMarked = false;
        gBoard[i][j].isFlagged = false;
        elCell.innerHTML = ''; // this Removes the flag emoji
        gGame.markedCount--;
    }
    renderBoard(gBoard)
    checkGameOver()
}

function checkGameOver() {
    if (gGame.markedCount === gLevel.MINES && gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES) {
        // Game over, player won!
        alert('Congratulations! You won!')
        resetGame()
    }
}

function gameOver() {
    alert('Game over! You hit a mine!')
    resetGame()
}

function resetGame() {
    gGame.isOn = false;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gBoard = buildBoard();
    renderBoard(gBoard);
}
