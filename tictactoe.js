// Tic-Tac-Toe Game
document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('ttt-board');
    const cells = document.querySelectorAll('.ttt-cell');
    const status = document.getElementById('ttt-status');
    const modeInfo = document.getElementById('ttt-mode-info');
    const resetBtn = document.getElementById('reset-ttt');

    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let gameMode = '2players'; // '2players' or 'online'

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];

    function handleCellClick(e) {
        const cell = e.target;
        const index = parseInt(cell.dataset.index);

        if (gameBoard[index] !== '' || !gameActive) {
            return;
        }

        gameBoard[index] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add(currentPlayer.toLowerCase());

        if (checkWinner()) {
            if (gameMode === 'online') {
                status.textContent = `You win! 🎉`;
            } else {
                status.textContent = `Player ${currentPlayer} wins! 🎉`;
            }
            gameActive = false;
            return;
        }

        if (checkDraw()) {
            status.textContent = "It's a draw! 🤝";
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        
        if (gameMode === 'online') {
            status.textContent = gameActive ? "Waiting for opponent..." : '';
            // Simulate online opponent move (in real implementation, this would be a server call)
            setTimeout(() => {
                if (gameActive && currentPlayer === 'O') {
                    makeAIMove();
                }
            }, 500);
        } else {
            status.textContent = `Player ${currentPlayer}'s turn`;
        }
    }

    function makeAIMove() {
        // Simple AI: find first available spot
        const availableMoves = [];
        for (let i = 0; i < 9; i++) {
            if (gameBoard[i] === '') {
                availableMoves.push(i);
            }
        }
        
        if (availableMoves.length > 0 && gameActive) {
            const randomIndex = availableMoves[Math.floor(Math.random() * availableMoves.length)];
            const cell = cells[randomIndex];
            gameBoard[randomIndex] = currentPlayer;
            cell.textContent = currentPlayer;
            cell.classList.add(currentPlayer.toLowerCase());

            if (checkWinner()) {
                status.textContent = `Opponent wins! 😔`;
                gameActive = false;
                return;
            }

            if (checkDraw()) {
                status.textContent = "It's a draw! 🤝";
                gameActive = false;
                return;
            }

            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            status.textContent = "Your turn";
        }
    }

    function checkWinner() {
        return winningConditions.some(condition => {
            const [a, b, c] = condition;
            return gameBoard[a] && 
                   gameBoard[a] === gameBoard[b] && 
                   gameBoard[a] === gameBoard[c];
        });
    }

    function checkDraw() {
        return gameBoard.every(cell => cell !== '');
    }

    function resetGame() {
        currentPlayer = 'X';
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        
        if (gameMode === 'online') {
            status.textContent = "Your turn (X)";
        } else {
            status.textContent = "Player X's turn";
        }
        
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
    }

    // Listen for mode changes
    document.addEventListener('modeChange', (e) => {
        if (e.detail.game === 'tictactoe') {
            gameMode = e.detail.mode;
            if (gameMode === 'online') {
                modeInfo.textContent = 'Online mode - Playing against AI';
            } else {
                modeInfo.textContent = 'Local 2-player mode';
            }
            resetGame();
        }
    });

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    resetBtn.addEventListener('click', resetGame);
});

