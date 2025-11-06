const numberInput = document.getElementById("number-input");
const convertBtn = document.getElementById("convert-btn");
const result = document.getElementById("result");
const output = document.getElementById("output");
const animationContainer = document.getElementById("animation-container");

const animationData = [
  {
    inputVal: 5,
    addElDelay: 1200,
    msg: 'decimalToBinary(5) returns "10" + 1 (5 % 2). Then it pops off the stack.',
    showMsgDelay: 8000,
    removeElDelay: 12000,
  },
  {
    inputVal: 2,
    addElDelay: 1800,
    msg: 'decimalToBinary(2) returns "1" + 0 (2 % 2) and gives that value to the stack below. Then it pops off the stack.',
    showMsgDelay: 10000,
    removeElDelay: 14000,
  },
  {
    inputVal: 1,
    addElDelay: 2400,
    msg: "decimalToBinary(1) returns '1' (base case) and gives that value to the stack below. Then it pops off the stack.",
    showMsgDelay: 12000,
    removeElDelay: 16000,
  }
];

const decimalToBinary = (input) => {
  if (input === 0 || input === 1) {
    return String(input);
  } else {
    return decimalToBinary(Math.floor(input / 2)) + (input % 2);
  }
};

const showAnimation = () => {
  // Clear previous animation
  animationContainer.innerHTML = '';
  
  // Show output panel
  output.classList.remove('hide');
  result.innerHTML = '<div style="text-align: center; color: var(--text-dim);">PROCESSING_CALL_STACK...</div>';
  
  const outputStatus = output.querySelector('.output-status');
  outputStatus.textContent = 'ANIMATING';
  outputStatus.style.color = 'var(--accent-info)';

  animationData.forEach((obj) => {
    setTimeout(() => {
      animationContainer.innerHTML += `
        <p id="${obj.inputVal}" class="animation-frame stack-frame">
          decimalToBinary(${obj.inputVal})
        </p>
      `;
    }, obj.addElDelay);

    setTimeout(() => {
      const element = document.getElementById(obj.inputVal);
      if (element) {
        element.textContent = obj.msg;
        if (obj.inputVal === 1) {
          element.classList.add('base-case');
        } else {
          element.classList.add('returning');
        }
      }
    }, obj.showMsgDelay);

    setTimeout(() => {
      const element = document.getElementById(obj.inputVal);
      if (element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(-10px)';
        setTimeout(() => {
          if (element.parentNode) {
            element.remove();
          }
        }, 300);
      }
    }, obj.removeElDelay);
  });

  setTimeout(() => {
    const binaryResult = decimalToBinary(5);
    result.innerHTML = `
      <div class="binary-result">${binaryResult}</div>
      <div style="margin-top: 12px; color: var(--text-dim); font-size: 0.9em;">
        DECIMAL_INPUT: 5<br>
        BINARY_OUTPUT: ${binaryResult}<br>
        STACK_DEPTH: 3
      </div>
    `;
    
    outputStatus.textContent = 'COMPLETED';
    outputStatus.style.color = 'var(--accent-success)';
  }, 17000);
};

const checkUserInput = () => {
  const inputInt = parseInt(numberInput.value);

  if (!numberInput.value || isNaN(inputInt) || inputInt < 0) {
    alert("Please provide a decimal number greater than or equal to 0");
    return;
  }

  if (inputInt > 4096) {
    alert("Please provide a number less than or equal to 4096");
    return;
  }

  // Show output panel
  output.classList.remove('hide');
  convertBtn.disabled = true;

  if (inputInt === 5) {
    showAnimation();
  } else {
    // Regular conversion
    result.innerHTML = '<div style="text-align: center; color: var(--text-dim);">PROCESSING...</div>';
    
    const outputStatus = output.querySelector('.output-status');
    outputStatus.textContent = 'CONVERTING';
    outputStatus.style.color = 'var(--accent-info)';

    setTimeout(() => {
      const binaryResult = decimalToBinary(inputInt);
      result.innerHTML = `
        <div class="binary-result">${binaryResult}</div>
        <div style="margin-top: 12px; color: var(--text-dim); font-size: 0.9em;">
          DECIMAL_INPUT: ${inputInt}<br>
          BINARY_OUTPUT: ${binaryResult}<br>
          BITS_REQUIRED: ${binaryResult.length}
        </div>
      `;
      
      outputStatus.textContent = 'COMPLETED';
      outputStatus.style.color = 'var(--accent-success)';
      numberInput.value = "";
      convertBtn.disabled = false;
    }, 600);
  }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
  convertBtn.addEventListener("click", checkUserInput);

  numberInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      checkUserInput();
    }
  });

  // Focus the input on load
  numberInput.focus();
});

// Keep the original console log for testing
console.log(decimalToBinary(5));