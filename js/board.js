'use strict'

function buildBoard() {
    console.log('hi there')
    console.log('Initializing gBoard...')
    const board = [];
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
    console.log('gBoard after initialization:', board)
    console.table(board)
    return board
}

function handleCellClick(event, i, j) {

    console.log('handleCellClick triggered')
    console.log('Mouse button:', event.button)

    if (event.button === LEFT_MOUSE_BUTTON) {
        onCellClicked(document.querySelector(`[data-row="${i}"][data-col="${j}"]`), i, j, event);
    } else if (event.button === RIGHT_MOUSE_BUTTON) {
        onCellMarked(document.querySelector(`[data-row="${i}"][data-col="${j}"]`));
    }
}

function onCellClicked(elCell, i, j, event) {

    if (!gGame.isOn) {
        // console.log('Game is not active. Not proceeding.');
        return;
    }

    if (!isValidCell(i, j)) {
        // console.log('Invalid cell coordinates. Not proceeding.');
        return;
    }
    console.log('gBoard:', gBoard)
    if (!gBoard) {
        // console.log('gBoard is undefined. Not proceeding.');
        return;
    }

    console.log('Before if (!gBoard[i]):', i, gBoard)
    if (!gBoard[i]) {
        // console.log('Row at index', i, 'is undefined. Not proceeding.');
        return;
    }

    var cell = gBoard[i][j];

    if (!cell) {
        // console.log('Cell at coordinates', i, j, 'is undefined.');
        return;
    }

    if (cell.isMarked || cell.isShown) {
        // console.log('Not proceeding due to cell state');
        return;
    }

    if (gGame.shownCount === 0) {
        updateTimer();
    }

    // recalculate the board if the first click is mine.
    if (gGame.shownCount === 0 && event.button === LEFT_MOUSE_BUTTON) {
        // console.log('First click! is MINE');

        // Shuffle the mines until a non-mine cell is clicked
        while (gBoard[i][j].isMine) {
            shuffleMines();
        }

        setMinesNegsCount(gBoard);
        renderBoard(gBoard);
    }

    // Right mouse button (flagging)
    if (event.button === RIGHT_MOUSE_BUTTON) {
        handleRightClick(i, j);
        gGame.markedCount++
    }

    // Left mouse button (revealing)
    if (event.button === LEFT_MOUSE_BUTTON && !cell.isMarked && !cell.isShown) {
        // console.log('Left mouse button clicked')

        cell.isShown = true
        gGame.shownCount++

        if (cell.isMine) {
            revealAllMines()
            // console.log('Game over! You hit a mine!')
            stopTimer()
            resetTimer()
            // gameOver()
            setTimeout(function () {
                alert('Game over! You hit a mine!');
                resetGame();
            }, 500)
        } else if (cell.minesAroundCount === 0) {
            // console.log('Expanding shown cells')
            expandShown(gBoard, i, j)
        }
    }

    // console.log('Checking game over state');
    checkGameOver();
    // console.log('Rendering board');
    renderBoard(gBoard);
}

function shuffleMines() {
    resetFlagsAndMarks(gBoard);
    setMines(gBoard);
}

function revealAllMines() {
    // console.log('Revealing all mines...')
    // console.log('Board:', gBoard)

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            // console.log(`Checking cell (${i}, ${j}):`, gBoard[i][j])
            if (gBoard[i][j].isMine) {
                gBoard[i][j].isShown = true;
                // console.log(`Mine revealed at (${i}, ${j})`)
            }
        }
    }

    // console.log('All mines revealed.')
    renderBoard(gBoard)
}

function handleRightClick(i, j) {
    // console.log('Right mouse button clicked');
    if (!gBoard[i][j].isShown) {
        toggleCellMarked(i, j)
    }
}

function toggleCellMarked(i, j) {
    gBoard[i][j].isMarked = !gBoard[i][j].isMarked
    gGame.markedCount += gBoard[i][j].isMarked ? 1 : -1
    renderBoard(gBoard)
    checkGameOver()
}

function revealCell(gameBoard, clickedCell, rowIndex, colIndex, game) {

    // console.log('revealCell triggered')
    // console.log('Row Index:', rowIndex, 'Column Index:', colIndex)

    gameBoard[rowIndex][colIndex].isShown = true
    game.shownCount++;

    if (gameBoard[rowIndex][colIndex].isMine) {
        // gameOver(game);
        alert('Game over! You hit a mine!')
        resetGame()
    } else {
        expandShown(gameBoard, clickedCell, rowIndex, colIndex)
    }
}

function onCellMarked(elCell, i, j, event) {
    if (!gGame.isOn) return

    var cell = gBoard[i][j]

    if (cell.isShown) return

    if (!cell.isMarked && !cell.isFlagged) {
        cell.isMarked = true
        elCell.innerHTML = FLAG
        gGame.markedCount++
        if (cell.isMine) {
            gGame.correctlyMarkedMines++;
        }
    } else if (cell.isMarked || cell.isFlagged) {
        cell.isMarked = false
        cell.isFlagged = false
        elCell.innerHTML = ''
        gGame.markedCount--
        if (cell.isMine) {
            gGame.correctlyMarkedMines--
        }
    }
    updateMineCountDisplay();

    renderBoard(gBoard);
    checkGameOver();
}

function updateMineCountDisplay() {
    var minesLeftElement = document.querySelector('.mines-left');
    if (minesLeftElement) {
        var minesLeft = gLevel.MINES - gGame.markedCount;
        minesLeftElement.innerText = minesLeft;

        if (minesLeft === 0 && gGame.shownCount === (gLevel.SIZE * gLevel.SIZE - gLevel.MINES)) {
            alert('Congratulations! You won!');
            resetGame();
        }
    }
}

function expandShown(board, i, j) {
    if (!board[i] || !board[i][j] || board[i][j].isMine || board[i][j].visited) {
        return;
    }

    board[i][j].isShown = true;
    board[i][j].visited = true;

    if (board[i][j].minesAroundCount === 0) {
        for (var row = i - 1; row <= i + 1; row++) {
            for (var col = j - 1; col <= j + 1; col++) {
                expandShown(board, row, col);
            }
        }
    }
}

function isValidCell(x, y) {
    return x >= 0 && x < gLevel.SIZE && y >= 0 && y < gLevel.SIZE;
}

function renderBoard(board) {
    var strHTML = '<table><tbody>';
    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < gLevel.SIZE; j++) {
            var cellContent = ''
            var cellClass = ''


            if (board[i] && board[i][j]) {
                var cell = board[i][j];

                if (cell.isMine && cell.isShown) {
                    cellClass = 'cell-isShown-isMine'
                    cellContent = '<img src="img/mine.png" alt="mine">'
                } else if (cell.isMarked || cell.isFlagged) {
                    cellClass = 'cell-isFlagged'
                    cellContent = '<img src="img/flag.png" alt="flag">'
                } else if (cell.isShown) {
                    cellClass = 'shown-cell'
                    if (cell.minesAroundCount === 0) {
                        cellContent = ''
                    } else {
                        cellContent = cell.minesAroundCount.toString();
                    }
                }
            }

            strHTML += `<td class="${cellClass}" 
                onclick="onCellClicked(this, ${i}, ${j}, event)" 
                oncontextmenu="onCellMarked(this, ${i}, ${j}, event); 
                return false;">${cellContent}
                        </td>`
        }
        strHTML += '</tr>';
    }
    strHTML += '</tbody></table>'
    const elContainer = document.querySelector('.game-board')
    elContainer.innerHTML = strHTML
}

function renderCell(i, j) {
    const elCell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`);
    if (elCell) {
        elCell.innerHTML = gBoard[i][j].minesAroundCount
    }
}

function checkGameOver() {
    var totalCells = gLevel.SIZE * gLevel.SIZE;
    if (
        gGame.shownCount === totalCells - gLevel.MINES &&
        gGame.markedCount === gLevel.MINES &&
        gGame.correctlyMarkedMines === gLevel.MINES &&
        !gBoard.some(row => row.some(cell => cell.isMine && cell.isShown))
    ) {
        console.log('Victory conditions met. Showing victory alert.')

        setTimeout(function () {
            alert('Congratulations! You won!')
            resetGame()
        }, 500)
    }
}

function gameOver() {
    gGame.isOn = false
    stopTimer()
    resetTimer()
    alert('Game over! You hit a mine!')
}

function resetGame() {
    console.log('resetting game.......')


    console.log('Step 1: Resetting variables...');
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
