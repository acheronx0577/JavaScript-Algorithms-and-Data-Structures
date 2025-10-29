// Steps 118 only on https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8

let character = "!";
let count = 10;
let inverted = false;

function padRow(rowNumber, rowCount) {
  return " ".repeat(rowCount - rowNumber) + character.repeat(2 * rowNumber - 1) + " ".repeat(rowCount - rowNumber);
}

function generatePyramid() {
  const rows = [];
  
  for (let i = 1; i <= count; i++) {
    if (inverted) {
      rows.unshift(padRow(i, count));
    } else {
      rows.push(padRow(i, count));
    }
  }

  let result = "";
  for (const row of rows) {
    result = result + row + "\n";
  }
  
  return result;
}

function updateDisplay() {
  const pyramid = generatePyramid();
  const output = document.getElementById('pyramid-output');
  const rowCount = document.getElementById('row-count');
  const charCount = document.getElementById('char-count');
  const currentChar = document.getElementById('current-char');
  const maxWidth = document.getElementById('max-width');
  const totalChars = document.getElementById('total-chars');
  const status = document.getElementById('status');
  const mode = document.getElementById('mode');
  
  // Calculate stats
  const totalCharacters = count * count; // n² pattern
  const maxRowWidth = 2 * count - 1;
  
  // Update stats
  rowCount.textContent = count;
  charCount.textContent = totalCharacters;
  currentChar.textContent = character;
  maxWidth.textContent = maxRowWidth;
  totalChars.textContent = totalCharacters;
  status.textContent = 'GENERATED';
  mode.textContent = inverted ? 'INVERTED' : 'NORMAL';
  
  // Display pyramid
  if (pyramid.trim()) {
    output.innerHTML = '';
    const rows = pyramid.split('\n').filter(row => row.trim());
    rows.forEach(row => {
      const rowElement = document.createElement('div');
      rowElement.className = 'pyramid-row';
      rowElement.textContent = row;
      output.appendChild(rowElement);
    });
  } else {
    output.innerHTML = '<div class="placeholder">NO_PATTERN_GENERATED</div>';
  }
}

// DOM Interaction
document.addEventListener('DOMContentLoaded', function() {
  const generateBtn = document.getElementById('generate');
  const clearBtn = document.getElementById('clear');
  const charInput = document.getElementById('character');
  const countInput = document.getElementById('count');
  const invertedCheckbox = document.getElementById('inverted');
  
  // Initialize with default values
  charInput.value = character;
  countInput.value = count;
  invertedCheckbox.checked = inverted;
  
  // Generate initial pyramid
  updateDisplay();
  
  // Event listeners
  generateBtn.addEventListener('click', function() {
    character = charInput.value || '!';
    count = parseInt(countInput.value) || 10;
    inverted = invertedCheckbox.checked;
    
    // Validate inputs
    if (count < 1) count = 1;
    if (count > 20) count = 20;
    countInput.value = count;
    
    if (!character) character = '!';
    charInput.value = character;
    
    updateDisplay();
  });
  
  clearBtn.addEventListener('click', function() {
    charInput.value = '!';
    countInput.value = 10;
    invertedCheckbox.checked = false;
    
    character = '!';
    count = 10;
    inverted = false;
    
    updateDisplay();
  });
  
  // Real-time updates on input change
  charInput.addEventListener('input', updateDisplay);
  countInput.addEventListener('input', updateDisplay);
  invertedCheckbox.addEventListener('change', updateDisplay);
  
  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
      generateBtn.click();
    }
    if (e.ctrlKey && e.key === 'l') {
      clearBtn.click();
    }
  });
});

// Keep original console functionality
console.log(generatePyramid());