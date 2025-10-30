const infixToFunction = {
  "+": (x, y) => x + y,
  "-": (x, y) => x - y,
  "*": (x, y) => x * y,
  "/": (x, y) => x / y,
}

const infixEval = (str, regex) => str.replace(regex, (_match, arg1, operator, arg2) => infixToFunction[operator](parseFloat(arg1), parseFloat(arg2)));

const highPrecedence = str => {
  const regex = /([\d.]+)([*\/])([\d.]+)/;
  const str2 = infixEval(str, regex);
  return str === str2 ? str : highPrecedence(str2);
}

const isEven = num => num % 2 === 0;
const sum = nums => nums.reduce((acc, el) => acc + el, 0);
const average = nums => sum(nums) / nums.length;

const median = nums => {
  const sorted = nums.slice().sort((a, b) => a - b);
  const length = sorted.length;
  const middle = length / 2 - 1;
  return isEven(length)
    ? average([sorted[middle], sorted[middle + 1]])
    : sorted[Math.ceil(middle)];
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
  const toNumberList = args => args.split(",").map(parseFloat);
  const apply = (fn, args) => spreadsheetFunctions[fn.toLowerCase()](toNumberList(args));
  return str2.replace(functionCall, (match, fn, args) => spreadsheetFunctions.hasOwnProperty(fn.toLowerCase()) ? apply(fn, args) : match);
}

const range = (start, end) => Array(end - start + 1).fill(start).map((element, index) => element + index);
const charRange = (start, end) => range(start.charCodeAt(0), end.charCodeAt(0)).map(code => String.fromCharCode(code));

const evalFormula = (x, cells) => {
  const idToText = id => cells.find(cell => cell.id === id).value;
  const rangeRegex = /([A-J])([1-9][0-9]?):([A-J])([1-9][0-9]?)/gi;
  const rangeFromString = (num1, num2) => range(parseInt(num1), parseInt(num2));
  const elemValue = num => character => idToText(character + num);
  const addCharacters = character1 => character2 => num => charRange(character1, character2).map(elemValue(num));
  const rangeExpanded = x.replace(rangeRegex, (_match, char1, num1, char2, num2) => rangeFromString(num1, num2).map(addCharacters(char1)(char2)));
  const cellRegex = /[A-J][1-9][0-9]?/gi;
  const cellExpanded = rangeExpanded.replace(cellRegex, match => idToText(match.toUpperCase()));
  const functionExpanded = applyFunction(cellExpanded);
  return functionExpanded === x ? functionExpanded : evalFormula(functionExpanded, cells);
}

// Update statistics
function updateStats() {
  const cellCount = document.getElementById('cell-count');
  const cells = Array.from(document.getElementById("container").children).filter(el => el.tagName === 'INPUT');
  const filledCells = cells.filter(cell => cell.value.trim() !== '').length;
  cellCount.textContent = filledCells;
}

// Enhanced update function
const update = event => {
  const element = event.target;
  const value = element.value.replace(/\s/g, "");
  if (!value.includes(element.id) && value.startsWith('=')) {
    element.value = evalFormula(value.slice(1), Array.from(document.getElementById("container").children));
  }
  updateStats();
}

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

  applyFormulaBtn.addEventListener('click', function() {
    const formula = formulaInput.value.trim();
    if (formula && formula.startsWith('=')) {
      try {
        // For demo purposes - in a real app, you'd apply this to selected cells
        formulaStatus.textContent = 'APPLIED';
        formulaStatus.style.color = 'var(--accent-green)';
        formulaStatus.style.borderColor = 'var(--accent-green)';
        editMode.textContent = 'FORMULA_APPLIED';
        formulaInput.value = '';
        
        // Reset status after delay
        setTimeout(() => {
          formulaStatus.textContent = 'READY';
          formulaStatus.style.color = 'var(--accent-green)';
          formulaStatus.style.borderColor = 'var(--accent-green)';
          editMode.textContent = 'READY';
        }, 2000);
      } catch (error) {
        formulaStatus.textContent = 'ERROR';
        formulaStatus.style.color = 'var(--accent-red)';
        formulaStatus.style.borderColor = 'var(--accent-red)';
        editMode.textContent = 'ERROR';
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
      formulaStatus.textContent = 'CANCELLED';
      formulaStatus.style.color = 'var(--accent-orange)';
      formulaStatus.style.borderColor = 'var(--accent-orange)';
      setTimeout(() => {
        formulaStatus.textContent = 'READY';
        formulaStatus.style.color = 'var(--accent-green)';
        formulaStatus.style.borderColor = 'var(--accent-green)';
      }, 1000);
    }
  });
}