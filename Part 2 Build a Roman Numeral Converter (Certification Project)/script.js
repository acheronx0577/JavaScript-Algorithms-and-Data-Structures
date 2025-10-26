// script.js
const convertBtn = document.getElementById("convert-btn");
const numberInput = document.getElementById("number");
const output = document.getElementById("output");

// Roman numeral conversion algorithm
function convertToRoman(num) {
    const romanNumerals = [
        { value: 1000, numeral: 'M' },
        { value: 900, numeral: 'CM' },
        { value: 500, numeral: 'D' },
        { value: 400, numeral: 'CD' },
        { value: 100, numeral: 'C' },
        { value: 90, numeral: 'XC' },
        { value: 50, numeral: 'L' },
        { value: 40, numeral: 'XL' },
        { value: 10, numeral: 'X' },
        { value: 9, numeral: 'IX' },
        { value: 5, numeral: 'V' },
        { value: 4, numeral: 'IV' },
        { value: 1, numeral: 'I' }
    ];

    let result = '';
    
    for (const { value, numeral } of romanNumerals) {
        while (num >= value) {
            result += numeral;
            num -= value;
        }
    }
    
    return result;
}

function setOutputStyle(type) {
    output.className = '';
    if (type === 'error') {
        output.classList.add('error');
    } else if (type === 'success') {
        output.classList.add('success');
    }
}

// Add keyboard support (Enter key)
numberInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        convertBtn.click();
    }
});

convertBtn.addEventListener("click", () => {
    const inputValue = numberInput.value.trim();
    
    if (inputValue === "") {
        output.textContent = "Please enter a valid number";
        setOutputStyle('error');
        return;
    }

    const number = parseInt(inputValue);
    
    if (isNaN(number)) {
        output.textContent = "Please enter a valid number";
        setOutputStyle('error');
        return;
    }
    
    if (number < 1) {
        output.textContent = "Please enter a number greater than or equal to 1";
        setOutputStyle('error');
        return;
    } else if (number >= 4000) {
        output.textContent = "Please enter a number less than or equal to 3999";
        setOutputStyle('error');
        return;
    }
    
    // Convert any number using the algorithm
    const romanNumeral = convertToRoman(number);
    output.textContent = romanNumeral;
    setOutputStyle('success');
});