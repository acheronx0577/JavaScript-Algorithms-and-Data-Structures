const getMean = (array) => array.reduce((acc, el) => acc + el, 0) / array.length;

const getMedian = (array) => {
  const sorted = array.slice().sort((a, b) => a - b);
  const median =
    sorted.length % 2 === 0
      ? getMean([sorted[sorted.length / 2], sorted[sorted.length / 2 - 1]])
      : sorted[Math.floor(sorted.length / 2)];
  return median;
}

const getMode = (array) => {
  if (array.length === 0) return null;
  
  const counts = {};
  array.forEach(el => counts[el] = counts[el] ? counts[el] + 1 : 1);

  if (new Set(Object.values(counts)).size === 1) {
    return null;
  }
  
  const highest = Object.keys(counts).sort(
    (a, b) => counts[b] - counts[a]
  )[0];
  const mode = Object.keys(counts).filter(
    (el) => counts[el] === counts[highest]
  );
  return mode.join(", ");
}

const getRange = (array) => {
  return Math.max(...array) - Math.min(...array);
}

const getVariance = (array) => {
  const mean = getMean(array);
  const variance = array.reduce((acc, el) => {
    const difference = el - mean;
    const squared = difference ** 2;
    return acc + squared;
  }, 0) / array.length;
  return variance;
}

const getStandardDeviation = (array) => {
  const variance = getVariance(array);
  const standardDeviation = Math.sqrt(variance);
  return standardDeviation;
}

// Global variables for tracking
let calculationsCount = 0;

const calculate = () => {
  const value = document.querySelector("#numbers").value;
  
  if (!value.trim()) {
    alert("ERROR: Please enter some numbers!");
    return;
  }
  
  const array = value.split(/,\s*/g);
  const numbers = array.map(el => Number(el)).filter(el => !isNaN(el));
  
  if (numbers.length === 0) {
    alert("ERROR: Please enter valid numbers!");
    return;
  }

  // Update UI states
  const button = document.querySelector(".terminal-btn.primary");
  const outputStatus = document.querySelector("#output-status");
  const globalStatus = document.querySelector("#global-status");
  const dataPoints = document.querySelector("#data-points");
  
  const originalText = button.querySelector(".btn-text").textContent;
  button.querySelector(".btn-text").textContent = "[CALCULATING...]";
  button.disabled = true;
  outputStatus.textContent = "PROCESSING";
  outputStatus.style.color = "var(--accent-warning)";
  globalStatus.textContent = "CALCULATING";
  dataPoints.textContent = numbers.length;

  // Simulate slight delay for better UX
  setTimeout(() => {
    try {
      const mean = getMean(numbers);
      const median = getMedian(numbers);
      const mode = getMode(numbers);
      const range = getRange(numbers);
      const variance = getVariance(numbers);
      const standardDeviation = getStandardDeviation(numbers);

      // Update UI with results
      document.querySelector("#mean").textContent = mean.toFixed(2);
      document.querySelector("#median").textContent = median.toFixed(2);
      document.querySelector("#mode").textContent = mode || "No mode";
      document.querySelector("#range").textContent = range.toFixed(2);
      document.querySelector("#variance").textContent = variance.toFixed(2);
      document.querySelector("#standardDeviation").textContent = standardDeviation.toFixed(2);

      // Update counters and status
      calculationsCount++;
      document.querySelector("#calculations-count").textContent = calculationsCount;
      outputStatus.textContent = "COMPLETED";
      outputStatus.style.color = "var(--accent-success)";
      globalStatus.textContent = "READY";
      
    } catch (error) {
      alert("ERROR: An error occurred during calculation. Please check your input.");
      console.error(error);
      outputStatus.textContent = "ERROR";
      outputStatus.style.color = "var(--accent-error)";
      globalStatus.textContent = "ERROR";
    } finally {
      // Reset button
      button.querySelector(".btn-text").textContent = originalText;
      button.disabled = false;
    }
  }, 500);
}

// Add event listener for Enter key and input validation
document.addEventListener('DOMContentLoaded', function() {
  const input = document.querySelector("#numbers");
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      calculate();
    }
  });
  
  // Clear results when input changes
  input.addEventListener('input', function() {
    if (!this.value.trim()) {
      clearResults();
    }
    document.querySelector("#data-points").textContent = 
      this.value.split(/,\s*/g).filter(el => !isNaN(Number(el)) && el.trim() !== '').length;
  });
});

function clearResults() {
  const elements = ['#mean', '#median', '#mode', '#range', '#variance', '#standardDeviation'];
  elements.forEach(selector => {
    document.querySelector(selector).textContent = '-';
  });
  document.querySelector("#output-status").textContent = "READY";
  document.querySelector("#output-status").style.color = "var(--accent-teal)";
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  document.querySelector("#data-points").textContent = "0";
  document.querySelector("#calculations-count").textContent = "0";
});