// 游戏配置
const GAME_LEVELS = {
    beginner: { rows: 9, cols: 9, mines: 10 },
    intermediate: { rows: 16, cols: 16, mines: 40 },
    expert: { rows: 16, cols: 30, mines: 99 }
};

// 游戏状态
let gameState = {
    board: [],
    mineLocations: [],
    rows: GAME_LEVELS.beginner.rows,
    cols: GAME_LEVELS.beginner.cols,
    mines: GAME_LEVELS.beginner.mines,
    remainingMines: GAME_LEVELS.beginner.mines,
    timer: 0,
    timerInterval: null,
    gameOver: false,
    firstClick: true,
    cellsRevealed: 0
};

// DOM 元素
const gameBoard = document.getElementById('game-board');
const minesCount = document.getElementById('mines-count');
const resetButton = document.getElementById('reset-button');
const timerDisplay = document.getElementById('timer');
const difficultyButtons = document.querySelectorAll('.difficulty button');

// 初始化游戏
function initGame() {
    // 清除旧的游戏状态
    clearInterval(gameState.timerInterval);
    gameState.timer = 0;
    gameState.gameOver = false;
    gameState.firstClick = true;
    gameState.cellsRevealed = 0;
    gameState.remainingMines = gameState.mines;
    gameState.mineLocations = [];
    gameState.board = [];
    
    // 更新显示
    timerDisplay.textContent = '0';
    minesCount.textContent = gameState.remainingMines;
    
    // 创建游戏板
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${gameState.cols}, 30px)`;
    gameBoard.style.gridTemplateRows = `repeat(${gameState.rows}, 30px)`;
    
    // 初始化游戏板数组
    for (let i = 0; i < gameState.rows; i++) {
        gameState.board[i] = [];
        for (let j = 0; j < gameState.cols; j++) {
            gameState.board[i][j] = {
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0
            };
            
            // 创建单元格元素
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = i;
            cell.dataset.col = j;
            
            // 添加事件监听器
            cell.addEventListener('click', handleCellClick);
            cell.addEventListener('contextmenu', handleCellRightClick);
            
            gameBoard.appendChild(cell);
        }
    }
}

// 放置地雷（在第一次点击后）
function placeMines(firstRow, firstCol) {
    let minesPlaced = 0;
    
    while (minesPlaced < gameState.mines) {
        const row = Math.floor(Math.random() * gameState.rows);
        const col = Math.floor(Math.random() * gameState.cols);
        
        // 确保不在第一次点击的位置及其周围放置地雷
        if ((Math.abs(row - firstRow) > 1 || Math.abs(col - firstCol) > 1) && 
            !gameState.board[row][col].isMine) {
            gameState.board[row][col].isMine = true;
            gameState.mineLocations.push({ row, col });
            minesPlaced++;
        }
    }
    
    // 计算每个单元格周围的地雷数
    calculateAdjacentMines();
}

// 计算每个单元格周围的地雷数
function calculateAdjacentMines() {
    for (let row = 0; row < gameState.rows; row++) {
        for (let col = 0; col < gameState.cols; col++) {
            if (!gameState.board[row][col].isMine) {
                let count = 0;
                
                // 检查周围8个方向
                for (let r = Math.max(0, row - 1); r <= Math.min(gameState.rows - 1, row + 1); r++) {
                    for (let c = Math.max(0, col - 1); c <= Math.min(gameState.cols - 1, col + 1); c++) {
                        if (!(r === row && c === col) && gameState.board[r][c].isMine) {
                            count++;
                        }
                    }
                }
                
                gameState.board[row][col].adjacentMines = count;
            }
        }
    }
}

// 处理单元格点击
function handleCellClick(event) {
    if (gameState.gameOver) return;
    
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const cell = gameState.board[row][col];
    
    // 如果是已标记或已揭示的单元格，不做任何操作
    if (cell.isFlagged || cell.isRevealed) return;
    
    // 如果是第一次点击
    if (gameState.firstClick) {
        gameState.firstClick = false;
        placeMines(row, col);
        startTimer();
    }
    
    // 如果点击到地雷，游戏结束
    if (cell.isMine) {
        revealAllMines();
        endGame(false);
        return;
    }
    
    // 揭示单元格
    revealCell(row, col);
    
    // 检查是否获胜
    checkWin();
}

// 处理单元格右键点击（标记）
function handleCellRightClick(event) {
    event.preventDefault();
    
    if (gameState.gameOver || gameState.firstClick) return;
    
    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    const cell = gameState.board[row][col];
    const cellElement = event.target;
    
    // 如果单元格已揭示，不做任何操作
    if (cell.isRevealed) return;
    
    // 切换标记状态
    if (cell.isFlagged) {
        cell.isFlagged = false;
        cellElement.classList.remove('flagged');
        gameState.remainingMines++;
    } else {
        cell.isFlagged = true;
        cellElement.classList.add('flagged');
        gameState.remainingMines--;
    }
    
    // 更新剩余地雷数显示
    minesCount.textContent = gameState.remainingMines;
}

// 揭示单元格
function revealCell(row, col) {
    const cell = gameState.board[row][col];
    
    // 如果单元格已揭示或已标记，不做任何操作
    if (cell.isRevealed || cell.isFlagged) return;
    
    // 标记单元格为已揭示
    cell.isRevealed = true;
    gameState.cellsRevealed++;
    
    // 更新 DOM
    const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cellElement.classList.add('revealed');
    
    // 如果周围有地雷，显示数字
    if (cell.adjacentMines > 0) {
        cellElement.textContent = cell.adjacentMines;
        cellElement.dataset.count = cell.adjacentMines;
    } 
    // 如果周围没有地雷，递归揭示周围的单元格
    else {
        for (let r = Math.max(0, row - 1); r <= Math.min(gameState.rows - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(gameState.cols - 1, col + 1); c++) {
                if (!(r === row && c === col)) {
                    revealCell(r, c);
                }
            }
        }
    }
}

// 揭示所有地雷
function revealAllMines() {
    gameState.mineLocations.forEach(({ row, col }) => {
        const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cellElement.classList.add('mine');
    });
}

// 检查是否获胜
function checkWin() {
    const totalCells = gameState.rows * gameState.cols;
    const nonMineCells = totalCells - gameState.mines;
    
    if (gameState.cellsRevealed === nonMineCells) {
        endGame(true);
    }
}

// 游戏结束
function endGame(isWin) {
    gameState.gameOver = true;
    clearInterval(gameState.timerInterval);
    
    if (isWin) {
        alert('恭喜你赢了！');
        // 标记所有未标记的地雷
        gameState.mineLocations.forEach(({ row, col }) => {
            const cell = gameState.board[row][col];
            if (!cell.isFlagged) {
                cell.isFlagged = true;
                const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                cellElement.classList.add('flagged');
            }
        });
        gameState.remainingMines = 0;
        minesCount.textContent = 0;
    } else {
        alert('游戏结束！');
    }
}

// 开始计时器
function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.timer++;
        timerDisplay.textContent = gameState.timer;
    }, 1000);
}

// 切换难度
function changeDifficulty(level) {
    const config = GAME_LEVELS[level];
    gameState.rows = config.rows;
    gameState.cols = config.cols;
    gameState.mines = config.mines;
    gameState.remainingMines = config.mines;
    
    // 更新 UI
    difficultyButtons.forEach(button => {
        if (button.dataset.difficulty === level) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // 重新初始化游戏
    initGame();
}

// 事件监听器
resetButton.addEventListener('click', initGame);

difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
        changeDifficulty(button.dataset.difficulty);
    });
});

// 阻止右键菜单
gameBoard.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// 初始化游戏
initGame();