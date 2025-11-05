function getRandomComputerResult() {
  const options = ["Rock", "Paper", "Scissors"];
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}

function hasPlayerWonTheRound(player, computer) {
  return (
    (player === "Rock" && computer === "Scissors") ||
    (player === "Scissors" && computer === "Paper") ||
    (player === "Paper" && computer === "Rock")
  );
}

let playerScore = 0;
let computerScore = 0;
let roundsPlayed = 0;

// Get emoji for choices
function getChoiceEmoji(choice) {
  const emojis = {
    "Rock": "🗿",
    "Paper": "📄", 
    "Scissors": "✂️"
  };
  return emojis[choice] || "❓";
}

// DOM Elements
const playerScoreElement = document.getElementById("player-score");
const computerScoreElement = document.getElementById("computer-score");
const roundResultsMsg = document.getElementById("results-msg");
const winnerMsgElement = document.getElementById("winner-msg");
const playerChoiceElement = document.getElementById("player-choice");
const computerChoiceElement = document.getElementById("computer-choice");
const resetGameBtn = document.getElementById("reset-game-btn");
const statusElement = document.getElementById("status");
const roundsPlayedElement = document.getElementById("rounds-played");
const connectionStatus = document.querySelector("#connection-status");

// Update status display
function updateStatus(message, color = 'var(--accent-success)') {
    statusElement.textContent = message;
    statusElement.style.color = color;
}

function showResults(userOption) {
    // Update status
    updateStatus('PROCESSING...', 'var(--accent-info)');
    
    // Show loading state
    playerChoiceElement.querySelector('.choice-icon').textContent = "⏳";
    computerChoiceElement.querySelector('.choice-icon').textContent = "⏳";
    playerChoiceElement.classList.add('active');
    computerChoiceElement.classList.add('thinking');
    
    const computerResult = getRandomComputerResult();
    
    // Simulate "thinking" delay for better UX
    setTimeout(() => {
        // Remove thinking animation
        computerChoiceElement.classList.remove('thinking');
        
        // Update choices display
        playerChoiceElement.querySelector('.choice-icon').textContent = getChoiceEmoji(userOption);
        computerChoiceElement.querySelector('.choice-icon').textContent = getChoiceEmoji(computerResult);
        computerChoiceElement.classList.add('active');
        
        // Add animations
        playerChoiceElement.classList.add('pulse');
        computerChoiceElement.classList.add('pulse');
        
        // Remove animations after they complete
        setTimeout(() => {
            playerChoiceElement.classList.remove('pulse');
            computerChoiceElement.classList.remove('pulse');
        }, 500);
        
        // Determine round result
        let resultMessage = "";
        if (hasPlayerWonTheRound(userOption, computerResult)) {
            playerScore++;
            resultMessage = `🎉 PLAYER_WINS! ${getChoiceEmoji(userOption)} BEATS ${getChoiceEmoji(computerResult)}`;
            updateStatus('PLAYER_WINS_ROUND', 'var(--accent-success)');
            playerScoreElement.classList.add('bounce');
        } else if (computerResult === userOption) {
            resultMessage = `🤝 TIE_GAME! BOTH_CHOSE ${getChoiceEmoji(userOption)}`;
            updateStatus('ROUND_TIED', 'var(--accent-info)');
        } else {
            computerScore++;
            resultMessage = `💻 COMPUTER_WINS! ${getChoiceEmoji(computerResult)} BEATS ${getChoiceEmoji(userOption)}`;
            updateStatus('COMPUTER_WINS_ROUND', 'var(--accent-warning)');
            computerScoreElement.classList.add('bounce');
        }
        
        // Update displays
        roundResultsMsg.innerText = resultMessage;
        computerScoreElement.innerText = computerScore;
        playerScoreElement.innerText = playerScore;
        
        roundsPlayed++;
        roundsPlayedElement.textContent = roundsPlayed;
        
        // Remove score animation after completion
        setTimeout(() => {
            playerScoreElement.classList.remove('bounce');
            computerScoreElement.classList.remove('bounce');
        }, 600);
        
        // Check for game winner
        if (playerScore === 3 || computerScore === 3) {
            const winner = playerScore === 3 ? "PLAYER" : "COMPUTER";
            winnerMsgElement.innerText = `🏆 ${winner}_WINS_THE_GAME!`;
            winnerMsgElement.classList.add('pulse');
            
            updateStatus('GAME_OVER', winner === "PLAYER" ? 'var(--accent-success)' : 'var(--accent-warning)');
            
            resetGameBtn.style.display = "inline-flex";
        }
    }, 800);
}

function resetGame() {
    playerScore = 0;
    computerScore = 0;
    roundsPlayed = 0;

    playerScoreElement.innerText = playerScore;
    computerScoreElement.innerText = computerScore;
    roundsPlayedElement.textContent = roundsPlayed;

    resetGameBtn.style.display = "none";

    winnerMsgElement.innerText = "";
    winnerMsgElement.classList.remove('pulse');
    roundResultsMsg.innerText = "AWAITING_PLAYER_INPUT...";
    
    // Reset choice displays
    playerChoiceElement.querySelector('.choice-icon').textContent = "?";
    computerChoiceElement.querySelector('.choice-icon').textContent = "?";
    playerChoiceElement.classList.remove('active');
    computerChoiceElement.classList.remove('active');
    
    updateStatus('READY');
}

// Event Listeners
resetGameBtn.addEventListener("click", resetGame);

const rockBtn = document.getElementById("rock-btn");
const paperBtn = document.getElementById("paper-btn");
const scissorsBtn = document.getElementById("scissors-btn");

rockBtn.addEventListener("click", function () {
    if (playerScore < 3 && computerScore < 3) {
        showResults("Rock");
    }
});

paperBtn.addEventListener("click", function () {
    if (playerScore < 3 && computerScore < 3) {
        showResults("Paper");
    }
});

scissorsBtn.addEventListener("click", function () {
    if (playerScore < 3 && computerScore < 3) {
        showResults("Scissors");
    }
});

// Add keyboard support
document.addEventListener('keydown', function(event) {
    if (playerScore < 3 && computerScore < 3) {
        switch(event.key.toLowerCase()) {
            case 'r':
                showResults("Rock");
                rockBtn.classList.add('pulse');
                setTimeout(() => rockBtn.classList.remove('pulse'), 300);
                break;
            case 'p':
                showResults("Paper");
                paperBtn.classList.add('pulse');
                setTimeout(() => paperBtn.classList.remove('pulse'), 300);
                break;
            case 's':
                showResults("Scissors");
                scissorsBtn.classList.add('pulse');
                setTimeout(() => scissorsBtn.classList.remove('pulse'), 300);
                break;
            case ' ':
                event.preventDefault();
                showResults(["Rock", "Paper", "Scissors"][Math.floor(Math.random() * 3)]);
                break;
        }
    }
});

// Initialize
function init() {
    updateStatus('READY');
    connectionStatus.textContent = 'ONLINE';
    resetGameBtn.style.display = "none";
}

// Initialize when page loads
window.onload = init;