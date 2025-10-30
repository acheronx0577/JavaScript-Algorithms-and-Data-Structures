const infixToFunction = {
  "+": (x, y) => x + y,
  "-": (x, y) => x - y,
  "*": (x, y) => x * y,
  "/": (x, y) => x / y,
}

const infixEval = (str, regex) => {
  return str.replace(regex, (_match, arg1, operator, arg2) => {
    const num1 = parseFloat(arg1);
    const num2 = parseFloat(arg2);
    if (isNaN(num1) || isNaN(num2)) return _match;
    return infixToFunction[operator](num1, num2);
  });
}

const highPrecedence = str => {
  const regex = /([\d.]+)([*\/])([\d.]+)/;
  const str2 = infixEval(str, regex);
  return str === str2 ? str : highPrecedence(str2);
}

const isEven = num => num % 2 === 0;
const sum = nums => nums.reduce((acc, el) => acc + el, 0);
const average = nums => nums.length > 0 ? sum(nums) / nums.length : 0;

const median = nums => {
  if (nums.length === 0) return 0;
  const sorted = nums.slice().sort((a, b) => a - b);
  const length = sorted.length;
  const middle = Math.floor(length / 2);
  return length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

const spreadsheetFunctions = {
  "": arg => arg,
  sum,
  average,
  median,
  even: nums => nums.filter(isEven),
  someeven: nums => nums.some(isEven),
  everyeven: nums => nums.every(isEven),
  firsttwo: nums => nums.slice(0, 2),
  lasttwo: nums => nums.slice(-2),
  has2: nums => nums.includes(2),
  increment: nums => nums.map(num => num + 1),
  random: ([x, y]) => Math.floor(Math.random() * y + x),
  range: nums => range(...nums),
  nodupes: nums => [...new Set(nums).values()]
}

const applyFunction = str => {
  const noHigh = highPrecedence(str);
  const infix = /([\d.]+)([+-])([\d.]+)/;
  const str2 = infixEval(noHigh, infix);
  const functionCall = /([a-z0-9]*)\(([0-9., ]*)\)(?!.*\()/i;
  const toNumberList = args => args.split(",").map(parseFloat).filter(n => !isNaN(n));
  const apply = (fn, args) => {
    const fnName = fn.toLowerCase();
    if (spreadsheetFunctions.hasOwnProperty(fnName)) {
      const numbers = toNumberList(args);
      return spreadsheetFunctions[fnName](numbers);
    }
    return match;
  };
  return str2.replace(functionCall, (match, fn, args) => apply(fn, args));
}

const range = (start, end) => {
  if (start > end) [start, end] = [end, start];
  return Array(end - start + 1).fill(start).map((element, index) => element + index);
}

const charRange = (start, end) => range(start.charCodeAt(0), end.charCodeAt(0)).map(code => String.fromCharCode(code));

const evalFormula = (x, cells) => {
  // First, handle cell references
  const cellRegex = /[A-J][1-9][0-9]?/gi;
  const cellExpanded = x.replace(cellRegex, match => {
    const cell = cells.find(cell => cell.id === match.toUpperCase());
    if (cell && cell.value.trim() !== '') {
      const value = parseFloat(cell.value);
      return isNaN(value) ? '0' : value.toString();
    }
    return '0';
  });

  // Then handle ranges
  const rangeRegex = /([A-J])([1-9][0-9]?):([A-J])([1-9][0-9]?)/gi;
  const rangeExpanded = cellExpanded.replace(rangeRegex, (_match, char1, num1, char2, num2) => {
    const startCol = char1.toUpperCase();
    const endCol = char2.toUpperCase();
    const startRow = parseInt(num1);
    const endRow = parseInt(num2);
    
    const values = [];
    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
        const cellId = String.fromCharCode(col) + row;
        const cell = cells.find(cell => cell.id === cellId);
        if (cell && cell.value.trim() !== '') {
          const value = parseFloat(cell.value);
          if (!isNaN(value)) {
            values.push(value);
          }
        }
      }
    }
    return values.length > 0 ? `[${values.join(',')}]` : '[]';
  });

  // Handle array literals from ranges
  const arrayExpanded = rangeExpanded.replace(/\[([^\]]+)\]/g, (match, arrayContent) => {
    return arrayContent;
  });

  // Finally apply functions and math
  const functionExpanded = applyFunction(arrayExpanded);
  
  // If we made changes, recursively evaluate until stable
  return functionExpanded === x ? functionExpanded : evalFormula(functionExpanded, cells);
}

// Update statistics
function updateStats() {
  const cellCount = document.getElementById('cell-count');
  const cells = Array.from(document.getElementById("container").children).filter(el => el.tagName === 'INPUT');
  const filledCells = cells.filter(cell => cell.value.trim() !== '').length;
  cellCount.textContent = filledCells;
}

// Enhanced update function for direct cell formulas
const update = event => {
  const element = event.target;
  const value = element.value.replace(/\s/g, "");
  
  if (value.startsWith('=')) {
    try {
      const cells = Array.from(document.getElementById("container").children).filter(el => el.tagName === 'INPUT');
      const result = evalFormula(value.slice(1), cells);
      element.value = result;
    } catch (error) {
      element.value = "#ERROR!";
      console.error('Formula error:', error);
    }
  }
  updateStats();
}

// Global variables
let selectedCell = null;
let viewMode = false; // Track if we're in view mode

window.onload = () => {
  const container = document.getElementById("container");
  
  const createLabel = (name, className = "") => {
    const label = document.createElement("div");
    label.className = "label" + (className ? " " + className : "");
    label.textContent = name;
    container.appendChild(label);
  }

  const letters = charRange("A", "J");
  
  // Create empty top-left corner
  createLabel("");
  
  // Create letter labels (A-J) in the first row
  letters.forEach(letter => createLabel(letter));
  
  // Create number labels and inputs
  range(1, 99).forEach(number => {
    // Create number label in first column with specific class
    createLabel(number, "row-label");
    
    // Create inputs for this row
    letters.forEach(letter => {
      const input = document.createElement("input");
      input.type = "text";
      input.id = letter + number;
      input.ariaLabel = letter + number;
      input.onchange = update;
      input.oninput = updateStats;
      container.appendChild(input);
    })
  });

  // Initialize stats
  updateStats();

  // Formula bar functionality
  const formulaInput = document.getElementById('formula-input');
  const applyFormulaBtn = document.getElementById('apply-formula');
  const formulaStatus = document.querySelector('.formula-status');
  const editMode = document.getElementById('edit-mode');

  // Create VIEW button
  const viewCellBtn = document.createElement('button');
  viewCellBtn.className = 'terminal-btn';
  viewCellBtn.innerHTML = '[VIEW]';
  viewCellBtn.title = 'View selected cell content';

  // Insert VIEW button into formula input container
  const formulaInputContainer = document.querySelector('.formula-input-container');
  formulaInputContainer.appendChild(viewCellBtn);

  // Add cell selection functionality
  const allInputs = document.querySelectorAll('#container input');
  
  allInputs.forEach(input => {
    input.addEventListener('focus', function() {
      // Remove selection from previous cell
      if (selectedCell) {
        selectedCell.classList.remove('selected');
      }
      
      // Add selection to current cell
      this.classList.add('selected');
      selectedCell = this;
      
      // Clear formula bar when focusing on cells (unless in view mode)
      if (!viewMode) {
        formulaInput.value = '';
      }
      
      // Update status
      formulaStatus.textContent = 'READY';
      formulaStatus.className = 'formula-status ready';
      editMode.textContent = 'READY';
    });

    // Remove auto-copying on input
    // input.addEventListener('input', function() {
    //   if (this === selectedCell) {
    //     formulaInput.value = this.value;
    //   }
    // });
  });

  // VIEW button functionality
  viewCellBtn.addEventListener('click', function() {
    if (selectedCell) {
      // In the VIEW button click event, replace the style changes with:
      if (!viewMode) {
          // Enter view mode
          formulaInput.value = selectedCell.value;
          formulaStatus.textContent = 'VIEWING';
          formulaStatus.className = 'formula-status warning';
          editMode.textContent = 'VIEW_MODE';
          viewCellBtn.innerHTML = '[EDIT]';
          viewCellBtn.classList.add('active');  // Changed from 'view-active' to 'active'
          viewMode = true;
      } else {
          // Exit view mode
          formulaInput.value = '';
          formulaStatus.textContent = 'READY';
          formulaStatus.className = 'formula-status ready';
          editMode.textContent = 'READY';
          viewCellBtn.innerHTML = '[VIEW]';
          viewCellBtn.classList.remove('active');  // Changed from 'view-active' to 'active'
          viewMode = false;
      }
    } else {
      formulaStatus.textContent = 'NO_CELL';
      formulaStatus.className = 'formula-status warning';
      setTimeout(() => {
        formulaStatus.textContent = 'READY';
        formulaStatus.className = 'formula-status ready';
      }, 1500);
    }
  });

  // Apply formula button
  applyFormulaBtn.addEventListener('click', function() {
    const formula = formulaInput.value.trim();
    
    if (!selectedCell) {
      formulaStatus.textContent = 'NO_CELL_SELECTED';
      formulaStatus.className = 'formula-status warning';
      editMode.textContent = 'ERROR';
      
      setTimeout(() => {
        formulaStatus.textContent = 'READY';
        formulaStatus.className = 'formula-status ready';
        editMode.textContent = 'READY';
      }, 2000);
      return;
    }

    if (formula) {
      try {
        let result;
        
        if (formula.startsWith('=')) {
          // It's a formula - evaluate it
          const cells = Array.from(document.getElementById("container").children).filter(el => el.tagName === 'INPUT');
          result = evalFormula(formula.slice(1), cells);
        } else {
          // It's a direct value
          result = formula;
        }
        
        // Apply to selected cell
        selectedCell.value = result;
        
        formulaStatus.textContent = 'APPLIED';
        formulaStatus.className = 'formula-status applied';
        editMode.textContent = 'APPLIED';
        
        // Clear formula bar after applying (exit view mode if active)
        if (viewMode) {
          formulaInput.value = '';
          viewCellBtn.innerHTML = '[VIEW]';
          viewCellBtn.style.background = '';
          viewCellBtn.style.borderColor = '';
          viewMode = false;
        }
        
        updateStats();
        
        setTimeout(() => {
          formulaStatus.textContent = 'READY';
          formulaStatus.className = 'formula-status ready';
          editMode.textContent = 'READY';
        }, 2000);
        
      } catch (error) {
        selectedCell.value = "#ERROR!";
        formulaStatus.textContent = 'ERROR';
        formulaStatus.className = 'formula-status error';
        editMode.textContent = 'ERROR';
        console.error('Formula error:', error);
        
        setTimeout(() => {
          formulaStatus.textContent = 'READY';
          formulaStatus.className = 'formula-status ready';
          editMode.textContent = 'READY';
        }, 2000);
      }
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'Enter') {
      applyFormulaBtn.click();
    }
    if (e.key === 'Escape') {
      formulaInput.value = '';
      if (selectedCell) {
        selectedCell.focus();
      }
      // Exit view mode on escape
      if (viewMode) {
        viewCellBtn.innerHTML = '[VIEW]';
        viewCellBtn.style.background = '';
        viewCellBtn.style.borderColor = '';
        viewMode = false;
      }
      formulaStatus.textContent = 'CANCELLED';
      formulaStatus.className = 'formula-status warning';
      setTimeout(() => {
        formulaStatus.textContent = 'READY';
        formulaStatus.className = 'formula-status ready';
      }, 1000);
    }
    if (e.key === 'Enter' && document.activeElement === formulaInput) {
      applyFormulaBtn.click();
    }
  });

  // Auto-focus first cell
  if (allInputs.length > 0) {
    allInputs[0].focus();
  }

  // Add some sample data for testing
  setTimeout(() => {
    const a1 = document.getElementById('A1');
    const b2 = document.getElementById('B2');
    if (a1 && b2) {
      a1.value = '5';
      b2.value = '3';
      updateStats();
    }
  }, 100);
}