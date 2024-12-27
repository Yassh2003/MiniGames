document.addEventListener('DOMContentLoaded', () => {
    const gameMenuButtons = document.querySelectorAll('.game-card button');
    
    gameMenuButtons.forEach(button => {
        button.addEventListener('click', event => {
            const gameName = event.target.textContent;
            const gameContainer = document.getElementById('game-container');
            
            // Clear previous content and show new game message
            gameContainer.innerHTML = `
                <h2>${gameName}</h2>
                <p>${gameName} is currently under development. Stay tuned for updates!</p>
            `;
        });
    });
});
