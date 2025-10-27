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

// Get emoji for choices
function getChoiceEmoji(choice) {
  const emojis = {
    "Rock": "🗿",
    "Paper": "📄", 
    "Scissors": "✂️"
  };
  return emojis[choice] || "❓";
}

function getRoundResults(userOption) {
  const computerResult = getRandomComputerResult();

  if (hasPlayerWonTheRound(userOption, computerResult)) {
    playerScore++;
    return `🎉 You win! ${getChoiceEmoji(userOption)} ${userOption} beats ${getChoiceEmoji(computerResult)} ${computerResult}`;
  } else if (computerResult === userOption) {
    return `🤝 It's a tie! Both chose ${getChoiceEmoji(userOption)} ${userOption}`;
  } else {
    computerScore++;
    return `💻 Computer wins! ${getChoiceEmoji(computerResult)} ${computerResult} beats ${getChoiceEmoji(userOption)} ${userOption}`;
  }
}

const playerScoreSpanElement = document.getElementById("player-score");
const computerScoreSpanElement = document.getElementById("computer-score");
const roundResultsMsg = document.getElementById("results-msg");
const winnerMsgElement = document.getElementById("winner-msg");
const optionsContainer = document.querySelector(".options-container");
const resetGameBtn = document.getElementById("reset-game-btn");
const playerChoiceElement = document.getElementById("player-choice");
const computerChoiceElement = document.getElementById("computer-choice");

function showResults(userOption) {
  // Show loading state
  playerChoiceElement.querySelector('.choice-icon').textContent = "⏳";
  computerChoiceElement.querySelector('.choice-icon').textContent = "⏳";
  playerChoiceElement.classList.add('active');
  
  const computerResult = getRandomComputerResult();
  
  // Simulate "thinking" delay for better UX
  setTimeout(() => {
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
    
    // Get and display results
    roundResultsMsg.innerText = getRoundResults(userOption, computerResult);
    computerScoreSpanElement.innerText = computerScore;
    playerScoreSpanElement.innerText = playerScore;
    
    // Add score animation
    if (hasPlayerWonTheRound(userOption, computerResult)) {
      playerScoreSpanElement.classList.add('bounce');
    } else if (userOption !== computerResult) {
      computerScoreSpanElement.classList.add('bounce');
    }
    
    // Remove score animation after completion
    setTimeout(() => {
      playerScoreSpanElement.classList.remove('bounce');
      computerScoreSpanElement.classList.remove('bounce');
    }, 600);
    
    // Check for game winner
    if (playerScore === 3 || computerScore === 3) {
      const winner = playerScore === 3 ? "Player" : "Computer";
      winnerMsgElement.innerText = `🏆 ${winner} has won the game!`;
      winnerMsgElement.classList.add('pulse');
      
      resetGameBtn.style.display = "flex";
      optionsContainer.style.display = "none";
    }
  }, 800);
}

function resetGame() {
  playerScore = 0;
  computerScore = 0;

  playerScoreSpanElement.innerText = playerScore;
  computerScoreSpanElement.innerText = computerScore;

  resetGameBtn.style.display = "none";
  optionsContainer.style.display = "block";

  winnerMsgElement.innerText = "";
  winnerMsgElement.classList.remove('pulse');
  roundResultsMsg.innerText = "Make your move to start the game!";
  
  // Reset choice displays
  playerChoiceElement.querySelector('.choice-icon').textContent = "?";
  computerChoiceElement.querySelector('.choice-icon').textContent = "?";
  playerChoiceElement.classList.remove('active');
  computerChoiceElement.classList.remove('active');
}

// Event Listeners
resetGameBtn.addEventListener("click", resetGame);

const rockBtn = document.getElementById("rock-btn");
const paperBtn = document.getElementById("paper-btn");
const scissorsBtn = document.getElementById("scissors-btn");

rockBtn.addEventListener("click", function () {
  showResults("Rock");
});

paperBtn.addEventListener("click", function () {
  showResults("Paper");
});

scissorsBtn.addEventListener("click", function () {
  showResults("Scissors");
});

// Add keyboard support
document.addEventListener('keydown', function(event) {
  if (optionsContainer.style.display !== 'none') {
    switch(event.key.toLowerCase()) {
      case 'r':
        showResults("Rock");
        break;
      case 'p':
        showResults("Paper");
        break;
      case 's':
        showResults("Scissors");
        break;
    }
  }
});