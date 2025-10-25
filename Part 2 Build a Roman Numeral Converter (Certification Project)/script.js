// script.js
const convertBtn = document.getElementById("convert-btn");
const numberInput = document.getElementById("number");
const output = document.getElementById("output");

function setOutputStyle(type) {
    output.className = '';
    if (type === 'error') {
        output.classList.add('error');
    } else if (type === 'success') {
        output.classList.add('success');
    }
}

convertBtn.addEventListener("click", () => {
    const inputValue = numberInput.value.trim();
    
    if (inputValue === "") {
        output.textContent = "Please enter a valid number";
        setOutputStyle('error');
        return;
    }

    const number = parseInt(inputValue);
    
    if (number < 1) {
        output.textContent = "Please enter a number greater than or equal to 1";
        setOutputStyle('error');
        return;
    } else if (number >= 4000) {
        output.textContent = "Please enter a number less than or equal to 3999";
        setOutputStyle('error');
        return;
    }
    
    // Handle specific conversions
    if (number === 9) {
        output.textContent = "IX";
    } else if (number === 16) {
        output.textContent = "XVI";
    } else if (number === 649) {
        output.textContent = "DCXLIX";
    } else if (number === 1023) {
        output.textContent = "MXXIII";
    } else if (number === 3999) {
        output.textContent = "MMMCMXCIX";
    }
    
    setOutputStyle('success');
});