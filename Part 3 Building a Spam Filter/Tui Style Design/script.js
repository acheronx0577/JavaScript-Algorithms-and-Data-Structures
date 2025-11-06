const messageInput = document.getElementById("message-input");
const checkMessageButton = document.getElementById("check-message-btn");
const clearButton = document.getElementById("clear-btn");
const charCount = document.getElementById("char-count");
const outputPanel = document.getElementById("output");
const resultStatus = document.getElementById("result-status");
const resultIcon = document.getElementById("result-icon");
const resultTitle = document.getElementById("result-title");
const resultMessage = document.getElementById("result-message");
const resultDetails = document.getElementById("result-details");
const patternsFound = document.getElementById("patterns-found");
const globalStatus = document.getElementById("global-status");
const messageLength = document.getElementById("message-length");

const helpRegex = /please help|assist me/i;
const dollarRegex = /[0-9]+\s*(?:hundred|thousand|million|billion)?\s+dollars/i;
const freeRegex = /(?:^|\s)fr[e3][e3] m[o0]n[e3]y(?:$|\s)/i;
const stockRegex = /(?:^|\s)[s5][t7][o0][c{[(]k [a@4]l[e3]r[t7](?:$|\s)/i;
const dearRegex = /(?:\s|^)d[3e][a@4]r fr[1i|][e3]nd(?:\s|$)/i;

const denyList = [
    { regex: helpRegex, name: "URGENT_HELP_REQUEST", description: "Patterns like 'please help' or 'assist me'" },
    { regex: dollarRegex, name: "MONEY_AMOUNTS", description: "Specific dollar amounts with numbers" },
    { regex: freeRegex, name: "FREE_OFFERS", description: "'Free money' with character substitutions" },
    { regex: stockRegex, name: "STOCK_ALERTS", description: "Stock market alerts with leet speak" },
    { regex: dearRegex, name: "DEAR_FRIEND_SCAMS", description: "'Dear friend' opening with variations" }
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

// Update character count and global stats
messageInput.addEventListener("input", () => {
    const count = messageInput.value.length;
    charCount.textContent = `${count} characters`;
    messageLength.textContent = count;
    globalStatus.textContent = "INPUT_READY";
});

// Clear button functionality
clearButton.addEventListener("click", () => {
    messageInput.value = "";
    charCount.textContent = "0 characters";
    messageLength.textContent = "0";
    resetResult();
    messageInput.focus();
});

// Reset result display
const resetResult = () => {
    outputPanel.className = "output-panel";
    resultStatus.textContent = "READY";
    resultStatus.style.color = "var(--accent-cyan)";
    resultIcon.textContent = "⏳";
    resultTitle.textContent = "READY_FOR_ANALYSIS";
    resultMessage.textContent = "Enter a message above to check for spam patterns.";
    resultDetails.style.display = "none";
    globalStatus.textContent = "READY";
};

// Check message button functionality
checkMessageButton.addEventListener("click", () => {
    if (messageInput.value === "") {
        showAlert("Please enter a message before analyzing.");
        return;
    }

    // Show analyzing state
    outputPanel.className = "output-panel analyzing";
    resultStatus.textContent = "ANALYZING";
    resultStatus.style.color = "var(--accent-info)";
    resultIcon.textContent = "🔍";
    resultTitle.textContent = "ANALYZING_MESSAGE";
    resultMessage.textContent = "Checking your message for spam patterns...";
    resultDetails.style.display = "none";
    globalStatus.textContent = "ANALYZING";
    checkMessageButton.disabled = true;

    // Simulate processing delay for better UX
    setTimeout(() => {
        const { isSpam: spamDetected, detectedPatterns } = isSpam(messageInput.value);
        
        if (spamDetected) {
            outputPanel.className = "output-panel spam";
            resultStatus.textContent = "SPAM_DETECTED";
            resultStatus.style.color = "var(--accent-error)";
            resultIcon.textContent = "🚫";
            resultTitle.textContent = "SPAM_DETECTED!";
            resultMessage.textContent = "This message contains patterns commonly found in spam.";
            
            // Show detected patterns
            patternsFound.innerHTML = `
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
            globalStatus.textContent = "SPAM_FOUND";
        } else {
            outputPanel.className = "output-panel safe";
            resultStatus.textContent = "SAFE";
            resultStatus.style.color = "var(--accent-success)";
            resultIcon.textContent = "✅";
            resultTitle.textContent = "NO_SPAM_FOUND";
            resultMessage.textContent = "This message appears to be safe and doesn't contain common spam patterns.";
            resultDetails.style.display = "none";
            globalStatus.textContent = "SAFE";
        }
        checkMessageButton.disabled = false;
    }, 800);
});

// Alert function
const showAlert = (message) => {
    alert("ALERT: " + message);
};

// Allow Enter key to trigger analysis (but not in textarea)
document.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && e.target !== messageInput) {
        checkMessageButton.click();
    }
});

// Initialize
resetResult();
messageInput.focus();