// Chess Game
document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('chess-board');
    const status = document.getElementById('chess-status');
    const modeInfo = document.getElementById('chess-mode-info');
    const resetBtn = document.getElementById('reset-chess');

    let gameMode = '2players'; // '2players' or 'online'

    const pieces = {
        'white': {
            'rook': '♖', 'knight': '♘', 'bishop': '♗',
            'queen': '♕', 'king': '♔', 'pawn': '♙'
        },
        'black': {
            'rook': '♜', 'knight': '♞', 'bishop': '♝',
            'queen': '♛', 'king': '♚', 'pawn': '♟'
        }
    };

    let gameState = initializeBoard();
    let selectedSquare = null;
    let currentPlayer = 'white';

    function initializeBoard() {
        const board = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // Place pieces
        const backRow = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
        
        // Black pieces
        for (let i = 0; i < 8; i++) {
            board[0][i] = { color: 'black', type: backRow[i] };
            board[1][i] = { color: 'black', type: 'pawn' };
        }
        
        // White pieces
        for (let i = 0; i < 8; i++) {
            board[7][i] = { color: 'white', type: backRow[i] };
            board[6][i] = { color: 'white', type: 'pawn' };
        }
        
        return board;
    }

    function renderBoard() {
        board.innerHTML = '';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                square.className = `chess-square ${(row + col) % 2 === 0 ? 'light' : 'dark'}`;
                square.dataset.row = row;
                square.dataset.col = col;
                
                const piece = gameState[row][col];
                if (piece) {
                    square.textContent = pieces[piece.color][piece.type];
                }
                
                if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
                    square.classList.add('selected');
                }
                
                square.addEventListener('click', () => handleSquareClick(row, col));
                board.appendChild(square);
            }
        }
    }

    function handleSquareClick(row, col) {
        const piece = gameState[row][col];
        
        if (selectedSquare) {
            const selectedPiece = gameState[selectedSquare.row][selectedSquare.col];
            
            // If clicking on own piece, select it
            if (piece && piece.color === currentPlayer) {
                selectedSquare = { row, col };
            }
            // If valid move, make it
            else if (isValidMove(selectedSquare.row, selectedSquare.col, row, col)) {
                gameState[row][col] = selectedPiece;
                gameState[selectedSquare.row][selectedSquare.col] = null;
                selectedSquare = null;
                currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
                
                if (gameMode === 'online') {
                    if (currentPlayer === 'black') {
                        status.textContent = "Waiting for opponent...";
                        // Simulate online opponent move
                        setTimeout(() => {
                            makeAIMove();
                        }, 800);
                    } else {
                        status.textContent = "Your turn (White)";
                    }
                } else {
                    status.textContent = `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)}'s turn`;
                }
            }
            // Otherwise, deselect
            else {
                selectedSquare = null;
            }
        } else {
            // Select piece if it's current player's turn
            if (piece && piece.color === currentPlayer) {
                selectedSquare = { row, col };
            }
        }
        
        renderBoard();
    }

    function isValidMove(fromRow, fromCol, toRow, toCol) {
        const piece = gameState[fromRow][fromCol];
        const targetPiece = gameState[toRow][toCol];
        
        // Can't capture own piece
        if (targetPiece && targetPiece.color === piece.color) {
            return false;
        }
        
        // Simple move validation (basic rules)
        const rowDiff = Math.abs(toRow - fromRow);
        const colDiff = Math.abs(toCol - fromCol);
        
        switch (piece.type) {
            case 'pawn':
                const direction = piece.color === 'white' ? -1 : 1;
                if (fromCol === toCol && !targetPiece) {
                    // Moving forward
                    if (toRow === fromRow + direction) return true;
                    // Initial double move
                    if ((piece.color === 'white' && fromRow === 6 && toRow === 4) ||
                        (piece.color === 'black' && fromRow === 1 && toRow === 3)) {
                        return true;
                    }
                }
                // Capturing diagonally
                if (colDiff === 1 && rowDiff === 1 && targetPiece) {
                    return toRow === fromRow + direction;
                }
                return false;
                
            case 'rook':
                return (rowDiff === 0 || colDiff === 0) && isPathClear(fromRow, fromCol, toRow, toCol);
                
            case 'bishop':
                return (rowDiff === colDiff) && isPathClear(fromRow, fromCol, toRow, toCol);
                
            case 'queen':
                return ((rowDiff === 0 || colDiff === 0 || rowDiff === colDiff) && 
                       isPathClear(fromRow, fromCol, toRow, toCol));
                
            case 'king':
                return rowDiff <= 1 && colDiff <= 1;
                
            case 'knight':
                return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
                
            default:
                return false;
        }
    }

    function isPathClear(fromRow, fromCol, toRow, toCol) {
        const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
        const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;
        
        let row = fromRow + rowStep;
        let col = fromCol + colStep;
        
        while (row !== toRow || col !== toCol) {
            if (gameState[row][col] !== null) {
                return false;
            }
            row += rowStep;
            col += colStep;
        }
        
        return true;
    }

    function makeAIMove() {
        // Simple AI: find a random valid move
        const allMoves = [];
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = gameState[row][col];
                if (piece && piece.color === currentPlayer) {
                    for (let toRow = 0; toRow < 8; toRow++) {
                        for (let toCol = 0; toCol < 8; toCol++) {
                            if (isValidMove(row, col, toRow, toCol)) {
                                allMoves.push({ fromRow: row, fromCol: col, toRow, toCol });
                            }
                        }
                    }
                }
            }
        }
        
        if (allMoves.length > 0 && currentPlayer === 'black') {
            const move = allMoves[Math.floor(Math.random() * allMoves.length)];
            gameState[move.toRow][move.toCol] = gameState[move.fromRow][move.fromCol];
            gameState[move.fromRow][move.fromCol] = null;
            currentPlayer = 'white';
            status.textContent = "Your turn (White)";
            renderBoard();
        }
    }

    function resetGame() {
        gameState = initializeBoard();
        selectedSquare = null;
        currentPlayer = 'white';
        
        if (gameMode === 'online') {
            status.textContent = "Your turn (White)";
        } else {
            status.textContent = "White's turn";
        }
        renderBoard();
    }

    // Listen for mode changes
    document.addEventListener('modeChange', (e) => {
        if (e.detail.game === 'chess') {
            gameMode = e.detail.mode;
            if (gameMode === 'online') {
                modeInfo.textContent = 'Online mode - Playing against AI';
            } else {
                modeInfo.textContent = 'Local 2-player mode';
            }
            resetGame();
        }
    });

    resetBtn.addEventListener('click', resetGame);
    renderBoard();
});

