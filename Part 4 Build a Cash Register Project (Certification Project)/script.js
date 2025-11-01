let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

// Currency units and their values in descending order
const currencyUnits = [
  ["ONE HUNDRED", 100],
  ["TWENTY", 20],
  ["TEN", 10],
  ["FIVE", 5],
  ["ONE", 1],
  ["QUARTER", 0.25],
  ["DIME", 0.1],
  ["NICKEL", 0.05],
  ["PENNY", 0.01]
];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
  // Set initial price value
  document.getElementById('price').value = price;
  
  // Display initial cash in drawer
  displayCID();
  
  // Add event listener to purchase button
  document.getElementById('purchase-btn').addEventListener('click', handlePurchase);
});

// Display cash in drawer
function displayCID() {
  const cidDisplay = document.getElementById('cid-display');
  cidDisplay.innerHTML = '';
  
  cid.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cid-item';
    div.innerHTML = `
      <span class="currency">${item[0]}:</span>
      <span class="amount">$${item[1].toFixed(2)}</span>
    `;
    cidDisplay.appendChild(div);
  });
}

// Handle purchase button click
function handlePurchase() {
  const cashInput = document.getElementById('cash');
  const cash = parseFloat(cashInput.value);
  const changeDueElement = document.getElementById('change-due');
  
  // Validate inputs
  if (isNaN(cash)) {
    alert("Please enter a valid cash amount");
    return;
  }
  
  if (cash < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  }
  
  if (cash === price) {
    changeDueElement.textContent = "No change due - customer paid with exact cash";
    changeDueElement.className = '';
    return;
  }
  
  // Calculate change
  const changeDue = cash - price;
  const result = checkCashRegister(price, cash, cid);
  
  // Display result
  displayResult(result, changeDueElement);
}

// Main cash register function
function checkCashRegister(price, cash, cid) {
  let changeDue = cash - price;
  let totalCID = 0;
  
  // Calculate total cash in drawer
  for (let i = 0; i < cid.length; i++) {
    totalCID += cid[i][1];
  }
  totalCID = Math.round(totalCID * 100) / 100;
  
  // Create a copy of CID for processing
  let cidCopy = JSON.parse(JSON.stringify(cid));
  
  if (changeDue > totalCID) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }
  
  if (changeDue === totalCID) {
    return { status: "CLOSED", change: cid.slice().reverse() };
  }

  
  // Calculate change
  const change = [];
  let remainingChange = changeDue;
  
  for (let i = 0; i < currencyUnits.length; i++) {
    const [unit, value] = currencyUnits[i];
    const cidIndex = findCIDIndex(cidCopy, unit);
    
    if (cidIndex === -1) continue;
    
    const availableAmount = cidCopy[cidIndex][1];
    const maxUnits = Math.floor(availableAmount / value);
    const neededUnits = Math.floor(remainingChange / value);
    const unitsToUse = Math.min(maxUnits, neededUnits);
    
    if (unitsToUse > 0) {
      const amount = unitsToUse * value;
      change.push([unit, amount]);
      remainingChange = Math.round((remainingChange - amount) * 100) / 100;
      cidCopy[cidIndex][1] = Math.round((availableAmount - amount) * 100) / 100;
    }
  }
  
  if (remainingChange > 0) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }
  
  return { status: "OPEN", change: change };
}

// Helper function to find index in CID array
function findCIDIndex(cid, currency) {
  for (let i = 0; i < cid.length; i++) {
    if (cid[i][0] === currency) {
      return i;
    }
  }
  return -1;
}

// Display the result
function displayResult(result, element) {
  element.innerHTML = '';
  
  const statusDiv = document.createElement('div');
  statusDiv.textContent = `Status: ${result.status}`;
  
  if (result.status === "INSUFFICIENT_FUNDS") {
    statusDiv.className = 'status-insufficient';
    element.appendChild(statusDiv);
  } else if (result.status === "CLOSED") {
    statusDiv.className = 'status-closed';
    element.appendChild(statusDiv);
    
    result.change.forEach(item => {
      if (item[1] > 0) {
        const changeItem = document.createElement('div');
        changeItem.textContent = `${item[0]}: $${item[1].toFixed(2)}`;
        element.appendChild(changeItem);
      }
    });
  } else if (result.status === "OPEN") {
    statusDiv.className = 'status-open';
    element.appendChild(statusDiv);
    
    result.change.forEach(item => {
      const changeItem = document.createElement('div');
      changeItem.textContent = `${item[0]}: $${item[1].toFixed(2)}`;
      element.appendChild(changeItem);
    });
  }
  
  // Update the displayed cash drawer
  displayCID();
}