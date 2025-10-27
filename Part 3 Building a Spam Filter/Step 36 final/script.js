const messageInput = document.getElementById("message-input");
const result = document.getElementById("result");
const checkMessageButton = document.getElementById("check-message-btn");
const clearButton = document.getElementById("clear-btn");
const charCount = document.getElementById("char-count");
const resultCard = document.getElementById("result-card");
const resultIcon = document.getElementById("result-icon");
const resultTitle = document.getElementById("result-title");
const resultMessage = document.getElementById("result-message");
const resultDetails = document.getElementById("result-details");
const patternsFound = document.getElementById("patterns-found");

const helpRegex = /please help|assist me/i;
const dollarRegex = /[0-9]+\s*(?:hundred|thousand|million|billion)?\s+dollars/i;
const freeRegex = /(?:^|\s)fr[e3][e3] m[o0]n[e3]y(?:$|\s)/i;
const stockRegex = /(?:^|\s)[s5][t7][o0][c{[(]k [a@4]l[e3]r[t7](?:$|\s)/i;
const dearRegex = /(?:\s|^)d[3e][a@4]r fr[1i|][e3]nd(?:\s|$)/i;

const denyList = [
    { regex: helpRegex, name: "Urgent Help Request", description: "Patterns like 'please help' or 'assist me'" },
    { regex: dollarRegex, name: "Money Amounts", description: "Specific dollar amounts with numbers" },
    { regex: freeRegex, name: "Free Offers", description: "'Free money' with character substitutions" },
    { regex: stockRegex, name: "Stock Alerts", description: "Stock market alerts with leet speak" },
    { regex: dearRegex, name: "Dear Friend Scams", description: "'Dear friend' opening with variations" }
];

const isSpam = (msg) => {
    const detectedPatterns = [];
    const isSpam = denyList.some((item) => {
        if (item.regex.test(msg)) {
            detectedPatterns.push(item);
            return true;
        }
        return false;
    });
    return { isSpam, detectedPatterns };
};

// Update character count
messageInput.addEventListener("input", () => {
    const count = messageInput.value.length;
    charCount.textContent = `${count} character${count !== 1 ? 's' : ''}`;
});

// Clear button functionality
clearButton.addEventListener("click", () => {
    messageInput.value = "";
    charCount.textContent = "0 characters";
    resetResult();
    messageInput.focus();
});

// Reset result display
const resetResult = () => {
    resultCard.className = "result-card";
    resultIcon.textContent = "⏳";
    resultTitle.textContent = "Ready to Analyze";
    resultMessage.textContent = "Enter a message above and click 'Analyze Message' to check for spam patterns.";
    resultDetails.style.display = "none";
};

// Check message button functionality
checkMessageButton.addEventListener("click", () => {
    if (messageInput.value === "") {
        showAlert("Please enter a message before analyzing.");
        return;
    }

    // Show analyzing state
    resultCard.className = "result-card";
    resultIcon.textContent = "🔍";
    resultTitle.textContent = "Analyzing...";
    resultMessage.textContent = "Checking your message for spam patterns...";
    resultDetails.style.display = "none";

    // Simulate processing delay for better UX
    setTimeout(() => {
        const { isSpam: spamDetected, detectedPatterns } = isSpam(messageInput.value);
        
        if (spamDetected) {
            resultCard.className = "result-card spam";
            resultIcon.textContent = "🚫";
            resultTitle.textContent = "Spam Detected!";
            resultMessage.textContent = "This message contains patterns commonly found in spam.";
            
            // Show detected patterns
            patternsFound.innerHTML = `
                <h4>Detected Patterns:</h4>
                ${detectedPatterns.map(pattern => `
                    <div class="pattern-item">
                        <span>⚠️</span>
                        <div>
                            <strong>${pattern.name}</strong>
                            <br>
                            <small>${pattern.description}</small>
                        </div>
                    </div>
                `).join('')}
            `;
            resultDetails.style.display = "block";
        } else {
            resultCard.className = "result-card safe";
            resultIcon.textContent = "✅";
            resultTitle.textContent = "No Spam Found";
            resultMessage.textContent = "This message appears to be safe and doesn't contain common spam patterns.";
            resultDetails.style.display = "none";
        }
    }, 800);
});

// Alert function
const showAlert = (message) => {
    alert(message);
};

// Allow Enter key to trigger analysis (but not in textarea)
document.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && e.target !== messageInput) {
        checkMessageButton.click();
    }
});

// Initialize
resetResult();