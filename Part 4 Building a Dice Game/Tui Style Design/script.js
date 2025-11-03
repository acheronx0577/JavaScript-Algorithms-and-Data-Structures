const listOfAllDice = document.querySelectorAll(".die");
const scoreInputs = document.querySelectorAll("#score-options input");
const scoreOptionItems = document.querySelectorAll(".option-item");
const scoreSpans = document.querySelectorAll(".option-score");
const roundElement = document.getElementById("current-round");
const rollsElement = document.getElementById("current-round-rolls");
const totalScoreElement = document.getElementById("total-score");
const scoreHistory = document.getElementById("score-history");
const rollDiceBtn = document.getElementById("roll-dice-btn");
const keepScoreBtn = document.getElementById("keep-score-btn");
const newGameBtn = document.getElementById("new-game-btn");
const rulesBtn = document.getElementById("rules-btn");
const rulesContent = document.getElementById("rules-content");
const gameStatus = document.getElementById("game-status");
const footerStatus = document.getElementById("footer-status");
const heldCount = document.getElementById("held-count");
const bestScore = document.getElementById("best-score");

let diceValuesArr = [0, 0, 0, 0, 0];
let heldDice = [false, false, false, false, false];
let isModalShowing = false;
let score = 0;
let round = 1;
let rolls = 3;
let bestScoreValue = 0;

// Initialize game
function initGame() {
    diceValuesArr = [0, 0, 0, 0, 0];
    heldDice = [false, false, false, false, false];
    score = 0;
    round = 1;
    rolls = 3;

    listOfAllDice.forEach((dice, index) => {
        dice.textContent = diceValuesArr[index];
        dice.classList.remove("active", "rolling");
    });

    totalScoreElement.textContent = score;
    scoreHistory.innerHTML = "";
    updateStats();
    resetRadioOptions();
    updateGameStatus("READY");
    updateHeldCount();
}

const rollDice = () => {
    diceValuesArr = [];

    for (let i = 0; i < 5; i++) {
        if (heldDice[i]) {
            diceValuesArr.push(parseInt(listOfAllDice[i].textContent));
        } else {
            const randomDice = Math.floor(Math.random() * 6) + 1;
            diceValuesArr.push(randomDice);
        }
    }

    // Add rolling animation
    listOfAllDice.forEach((dice, index) => {
        if (!heldDice[index]) {
            dice.classList.add("rolling");
            setTimeout(() => {
                dice.textContent = diceValuesArr[index];
                dice.classList.remove("rolling");
            }, 500);
        } else {
            dice.textContent = diceValuesArr[index];
        }
    });
};

const updateStats = () => {
    rollsElement.textContent = rolls;
    roundElement.textContent = round;
    totalScoreElement.textContent = score;
    
    if (score > bestScoreValue) {
        bestScoreValue = score;
        bestScore.textContent = bestScoreValue;
    }
};

const updateGameStatus = (status) => {
    gameStatus.textContent = status;
    footerStatus.textContent = status;
    
    // Update status color based on game state
    const statusElement = gameStatus;
    statusElement.style.color = 
        status === "READY" ? "var(--accent-success)" :
        status === "ROLLING" ? "var(--accent-warning)" :
        status === "SCORING" ? "var(--accent-info)" :
        "var(--text-primary)";
};

const updateHeldCount = () => {
    const count = heldDice.filter(held => held).length;
    heldCount.textContent = count;
};

const updateRadioOption = (index, scoreValue) => {
    scoreInputs[index].disabled = false;
    scoreInputs[index].value = scoreValue;
    scoreSpans[index].textContent = scoreValue;
    scoreOptionItems[index].classList.add("enabled");
    
    if (scoreValue > 0) {
        scoreSpans[index].style.color = "var(--accent-success)";
    }
};

const updateScore = (selectedValue, achieved) => {
    const points = parseInt(selectedValue);
    score += points;
    totalScoreElement.textContent = score;

    const historyItem = document.createElement("li");
    historyItem.className = "history-item";
    historyItem.innerHTML = `
        <span class="history-round">Round ${round}</span>
        <span class="history-score">${achieved}: +${points}</span>
    `;
    scoreHistory.appendChild(historyItem);
    scoreHistory.scrollTop = scoreHistory.scrollHeight;
};

const getHighestDuplicates = (arr) => {
    const counts = {};
    for (const num of arr) {
        counts[num] = (counts[num] || 0) + 1;
    }

    let highestCount = 0;
    for (const num of arr) {
        const count = counts[num];
        if (count > highestCount) {
            highestCount = count;
        }
    }

    const sumOfAllDice = arr.reduce((a, b) => a + b, 0);

    if (highestCount >= 4) {
        updateRadioOption(1, sumOfAllDice);
    }

    if (highestCount >= 3) {
        updateRadioOption(0, sumOfAllDice);
    }
};

const detectFullHouse = (arr) => {
    const counts = {};
    for (const num of arr) {
        counts[num] = (counts[num] || 0) + 1;
    }

    const values = Object.values(counts);
    const hasThreeOfAKind = values.includes(3);
    const hasPair = values.includes(2);

    if (hasThreeOfAKind && hasPair) {
        updateRadioOption(2, 25);
    }
};

const checkForStraights = (arr) => {
    const sortedNumbersArr = [...new Set(arr)].sort((a, b) => a - b);
    if (sortedNumbersArr.length < 4) return;

    const uniqueNumbersStr = sortedNumbersArr.join("");
    const smallStraightsArr = ["1234", "2345", "3456"];
    const largeStraightsArr = ["12345", "23456"];

    if (smallStraightsArr.some(straight => uniqueNumbersStr.includes(straight))) {
        updateRadioOption(3, 30);
    }

    if (largeStraightsArr.includes(uniqueNumbersStr)) {
        updateRadioOption(4, 40);
    }
};

const resetRadioOptions = () => {
    scoreInputs.forEach((input, index) => {
        input.disabled = true;
        input.checked = false;
        scoreOptionItems[index].classList.remove("enabled", "selected");
        scoreSpans[index].textContent = "";
        scoreSpans[index].style.color = "";
    });
};

// Dice click handler for holding dice
listOfAllDice.forEach((die, index) => {
    die.addEventListener("click", () => {
        if (rolls < 3 && rolls > 0) { // Can only hold dice after first roll
            heldDice[index] = !heldDice[index];
            die.classList.toggle("active", heldDice[index]);
            updateHeldCount();
        }
    });
});

// Score option click handlers
scoreOptionItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        if (scoreInputs[index].disabled) return;
        
        // Remove selection from all items
        scoreOptionItems.forEach(opt => opt.classList.remove("selected"));
        
        // Add selection to clicked item
        item.classList.add("selected");
        scoreInputs[index].checked = true;
    });
});

rollDiceBtn.addEventListener("click", () => {
    if (rolls === 0) {
        updateGameStatus("NO_ROLLS");
        setTimeout(() => updateGameStatus("SCORING"), 1500);
        return;
    }

    rolls--;
    resetRadioOptions();
    updateGameStatus("ROLLING");
    
    setTimeout(() => {
        rollDice();
        
        setTimeout(() => {
            updateStats();
            getHighestDuplicates(diceValuesArr);
            detectFullHouse(diceValuesArr);
            checkForStraights(diceValuesArr);
            updateRadioOption(5, 0);
            
            if (rolls === 0) {
                updateGameStatus("MUST_SCORE");
            } else {
                updateGameStatus("SCORING");
            }
        }, 600);
    }, 100);
});

keepScoreBtn.addEventListener("click", () => {
    let selectedValue;
    let achieved;

    for (const radioButton of scoreInputs) {
        if (radioButton.checked) {
            selectedValue = radioButton.value;
            achieved = radioButton.id.replace("-", " ");
            break;
        }
    }

    if (selectedValue !== undefined) {
        rolls = 3;
        round++;
        heldDice = [false, false, false, false, false];
        listOfAllDice.forEach(die => die.classList.remove("active"));
        updateHeldCount();
        
        updateStats();
        resetRadioOptions();
        updateScore(selectedValue, achieved);
        
        if (round > 6) {
            updateGameStatus("GAME_OVER");
            setTimeout(() => {
                alert(`Game Over! Your total score is ${score}`);
                initGame();
            }, 1000);
        } else {
            updateGameStatus("READY");
        }
    } else {
        updateGameStatus("NO_SELECTION");
        setTimeout(() => updateGameStatus("SCORING"), 1500);
    }
});

newGameBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to start a new game?")) {
        initGame();
    }
});

rulesBtn.addEventListener("click", () => {
    isModalShowing = !isModalShowing;
    rulesContent.classList.toggle("hide", !isModalShowing);
});

// Initialize the game
initGame();