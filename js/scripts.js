document.addEventListener('DOMContentLoaded', () => {
    const gameMenuButtons = document.querySelectorAll('.game-card button');
    const gameContainer = document.getElementById('game-container');
    const gameControls = document.getElementById('game-controls');
    const startGameButton = document.getElementById('startGameButton');
    const exitGameButton = document.getElementById('exitGameButton');

    gameMenuButtons.forEach(button => {
        button.addEventListener('click', event => {
            const gameName = event.target.textContent;
            gameContainer.innerHTML = `
                <h2>${gameName}</h2>
                <p>${gameName} is currently under development. Stay tuned for updates!</p>
            `;
            gameControls.style.display = 'block';
        });
    });

    startGameButton.addEventListener('click', () => {
        const gameName = gameContainer.querySelector('h2').textContent;
        if (gameName === 'Flappy Bird') {
            window.location.href = 'flappy-bird/index.html';
        } else if (gameName === 'Puzzle Game') {
            window.location.href = 'slidingpuzzlegame/index.html';
        } else {
            alert(`${gameName} is currently under development. Stay tuned for updates!`);
        }
    });

    exitGameButton.addEventListener('click', () => {
        gameContainer.innerHTML = '<p>Select a game to see details or play when available!</p>';
        gameControls.style.display = 'none';
    });
});