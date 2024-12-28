document.addEventListener('DOMContentLoaded', () => {
    const gameMenuButtons = document.querySelectorAll('.game-card button');
    const gameContainer = document.getElementById('game-container');
    const gameMenu = document.querySelector('.game-menu');
    
    gameMenuButtons.forEach(button => {
        button.addEventListener('click', event => {
            const gameName = event.target.textContent;
            
            // Show the game container when a game is selected
            gameContainer.style.display = 'block';
            gameMenu.style.display = 'none';
            gameContainer.innerHTML = ''; // Clear any existing content
            
            if (gameName === 'Flappy Bird') {
                gameContainer.innerHTML = `
                    <div class="start-game">
                        <p>Ready to play Flappy Bird?</p>
                        <button id="start-flappy-bird">Start Game</button>
                        <button id="exit-flappy-bird">Exit Game</button>
                    </div>
                `;
                
                document.getElementById('start-flappy-bird').addEventListener('click', () => {
                    let countdown = 3;
                    const countdownElement = document.createElement('p');
                    countdownElement.id = 'countdown';
                    gameContainer.innerHTML = '';
                    gameContainer.appendChild(countdownElement);
                    
                    const countdownInterval = setInterval(() => {
                        if (countdown > 0) {
                            countdownElement.textContent = countdown;
                        } else if (countdown === 0) {
                            countdownElement.textContent = "Start!";
                        } else {
                            clearInterval(countdownInterval);
                            window.location.href = 'flappy-bird/flappyBird.html';  // Redirect to Flappy Bird HTML
                        }
                        countdown--;
                    }, 1000);
                });
                
                document.getElementById('exit-flappy-bird').addEventListener('click', () => {
                    gameContainer.style.display = 'none';
                    gameMenu.style.display = 'flex';
                });
            } else {
                gameContainer.innerHTML = `<p>${gameName} is under development. Stay tuned!</p>`;
            }
        });
    });
});