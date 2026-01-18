// Main navigation script
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const gameSections = document.querySelectorAll('.game-section');
    const gameCards = document.querySelectorAll('.game-card');
    const modeButtons = document.querySelectorAll('.mode-btn');

    // Navigation button click handler
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const gameId = btn.dataset.game;
            switchGame(gameId);
        });
    });

    // Game card click handler
    gameCards.forEach(card => {
        card.addEventListener('click', () => {
            const gameId = card.dataset.game;
            switchGame(gameId);
        });
    });

    // Mode selection handler
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            const game = btn.dataset.game;
            switchMode(game, mode);
        });
    });

    function switchGame(gameId) {
        // Update active nav button
        navButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.game === gameId);
        });

        // Show/hide game sections
        gameSections.forEach(section => {
            section.classList.toggle('active', section.id === gameId);
        });
    }

    function switchMode(game, mode) {
        // Update active mode button for the specific game
        modeButtons.forEach(btn => {
            if (btn.dataset.game === game) {
                btn.classList.toggle('active', btn.dataset.mode === mode);
            }
        });

        // Trigger mode change event
        const event = new CustomEvent('modeChange', { 
            detail: { game, mode } 
        });
        document.dispatchEvent(event);
    }
});

