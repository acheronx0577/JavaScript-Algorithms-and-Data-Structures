const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');
const currentTimeElement = document.getElementById('current-time');

let isError = false;

// Update current time
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    currentTimeElement.textContent = timeString;
}

setInterval(updateTime, 1000);
updateTime();

function cleanInputString(str) {
    const regex = /[+-\s]/g;
    return str.replace(regex, '');
}

function isInvalidInput(str) {
    const regex = /\d+e\d+/i;
    return str.match(regex);
}

function addEntry() {
    const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
    const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
    const HTMLString = `
    <div class="input-group">
        <label for="${entryDropdown.value}-${entryNumber}-name">ENTRY_${entryNumber}_NAME</label>
        <input type="text" class="terminal-input" id="${entryDropdown.value}-${entryNumber}-name" placeholder="Item name" />
    </div>
    <div class="input-group">
        <label for="${entryDropdown.value}-${entryNumber}-calories">ENTRY_${entryNumber}_CALORIES</label>
        <input
            type="number"
            class="terminal-input"
            min="0"
            id="${entryDropdown.value}-${entryNumber}-calories"
            placeholder="0"
        />
    </div>`;
    targetInputContainer.insertAdjacentHTML('beforeend', HTMLString);
    
    // Add visual feedback
    const mealSection = document.getElementById(entryDropdown.value);
    mealSection.style.borderColor = 'var(--terminal-green)';
    setTimeout(() => {
        mealSection.style.borderColor = 'var(--terminal-gold)';
    }, 1000);
}

function calculateCalories(e) {
    e.preventDefault();
    isError = false;

    // Show loading state
    const outputContent = output.querySelector('.output-content');
    outputContent.innerHTML = '<div style="text-align: center; color: var(--terminal-gold);">PROCESSING...</div>';
    output.classList.remove('hide');

    // Simulate processing delay for better UX
    setTimeout(() => {
        const breakfastNumberInputs = document.querySelectorAll("#breakfast input[type='number']");
        const lunchNumberInputs = document.querySelectorAll("#lunch input[type='number']");
        const dinnerNumberInputs = document.querySelectorAll("#dinner input[type='number']");
        const snacksNumberInputs = document.querySelectorAll("#snacks input[type='number']");
        const exerciseNumberInputs = document.querySelectorAll("#exercise input[type='number']");

        const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
        const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
        const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
        const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
        const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
        const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

        if (isError) {
            return;
        }

        const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories;
        const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
        
        const surplusOrDeficit = remainingCalories < 0 ? 'SURPLUS' : 'DEFICIT';
        const colorClass = remainingCalories < 0 ? 'surplus' : 'deficit';
        
        outputContent.innerHTML = `
        <div class="result-main">
            <span class="${colorClass}">${Math.abs(remainingCalories)} CALORIE ${surplusOrDeficit}</span>
        </div>
        <hr>
        <div class="result-details">
            <p>📊 ${budgetCalories} CALORIES BUDGETED</p>
            <p>🍽️ ${consumedCalories} CALORIES CONSUMED</p>
            <p>💪 ${exerciseCalories} CALORIES BURNED</p>
            <p>🎯 NET: ${remainingCalories} CALORIES</p>
        </div>
        `;

        // Update output status
        const outputStatus = output.querySelector('.output-status');
        outputStatus.textContent = 'COMPLETED';
        outputStatus.style.color = 'var(--terminal-green)';

    }, 800);
}

function getCaloriesFromInputs(list) {
    let calories = 0;

    for (const item of list) {
        const currVal = cleanInputString(item.value);
        const invalidInputMatch = isInvalidInput(currVal);

        if (invalidInputMatch) {
            alert(`🚫 INVALID INPUT: ${invalidInputMatch[0]}`);
            isError = true;
            return null;
        }
        calories += Number(currVal);
    }
    return calories;
}

function clearForm() {
    const inputContainers = Array.from(document.querySelectorAll('.input-container'));

    for (const container of inputContainers) {
        container.innerHTML = '';
    }

    budgetNumberInput.value = '';
    output.classList.add('hide');
    
    // Reset output status
    const outputStatus = output.querySelector('.output-status');
    outputStatus.textContent = 'READY';
    outputStatus.style.color = 'var(--terminal-green)';
    
    // Visual feedback
    const buttons = document.querySelectorAll('.terminal-btn');
    buttons.forEach(btn => {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);
    });
}

// Event Listeners
addEntryButton.addEventListener("click", addEntry);
calorieCounter.addEventListener("submit", calculateCalories);
clearButton.addEventListener('click', clearForm);

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        calculateCalories(new Event('submit'));
    }
    if (e.ctrlKey && e.key === 'n') {
        addEntry();
    }
    if (e.ctrlKey && e.key === 'l') {
        clearForm();
    }
});

// Initialize with some example entries
document.addEventListener('DOMContentLoaded', () => {
    // Add first entry to each section
    ['breakfast', 'lunch', 'dinner', 'snacks', 'exercise'].forEach(section => {
        const container = document.querySelector(`#${section} .input-container`);
        if (container) {
            const HTMLString = `
            <div class="input-group">
                <label for="${section}-1-name">ENTRY_1_NAME</label>
                <input type="text" class="terminal-input" id="${section}-1-name" placeholder="Item name" />
            </div>
            <div class="input-group">
                <label for="${section}-1-calories">ENTRY_1_CALORIES</label>
                <input
                    type="number"
                    class="terminal-input"
                    min="0"
                    id="${section}-1-calories"
                    placeholder="0"
                />
            </div>`;
            container.innerHTML = HTMLString;
        }
    });
    
    // Set focus to budget input
    budgetNumberInput.focus();
});