// Game state
let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

// DOM elements
const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const monsterHealthBar = document.querySelector("#monsterHealthBar");
const playerHealthBar = document.querySelector("#playerHealthBar");
const playerHealthText = document.querySelector("#playerHealthText");
const inventoryDisplay = document.querySelector("#inventoryDisplay");
const locationText = document.querySelector("#locationText");
const statusElement = document.querySelector("#status");
const weaponPowerElement = document.querySelector("#weaponPower");

// Game data
const weapons = [
  { name: 'stick', power: 5 },
  { name: 'dagger', power: 30 },
  { name: 'claw hammer', power: 50 },
  { name: 'sword', power: 100 }
];

const monsters = [
  {
    name: "SLIME",
    level: 2,
    health: 15
  },
  {
    name: "FANGED_BEAST",
    level: 8,
    health: 60
  },
  {
    name: "DRAGON",
    level: 20,
    health: 300
  }
];

const locations = [
  {
    name: "TOWN_SQUARE",
    "button text": ["Go to store", "Go to cave", "Fight dragon"],
    "button functions": [goStore, goCave, fightDragon],
    text: "You are in the town square. You see a sign that says \"Store\". The cave entrance looms in the distance, and rumors say the dragon has been spotted nearby."
  },
  {
    name: "STORE",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store. A friendly merchant offers health potions and weapons for sale."
  },
  {
    name: "CAVE",
    "button text": ["Fight slime", "Fight fanged beast", "Go to town square"],
    "button functions": [fightSlime, fightBeast, goTown],
    text: "You enter the dark cave. Strange noises echo in the distance. Monsters lurk in the shadows."
  },
  {
    name: "COMBAT",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster. Choose your action carefully!"
  },
  {
    name: "VICTORY",
    "button text": ["Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goTown, goTown, easterEgg],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.'
  },
  {
    name: "GAME_OVER",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You have been defeated. The town remains under the dragon's threat. 💀"
  },
  { 
    name: "WIN", 
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"], 
    "button functions": [restart, restart, restart], 
    text: "With a final mighty blow, you defeat the dragon! The town is safe at last! YOU WIN THE GAME! 🎉" 
  },
  {
    name: "SECRET",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
  }
];

// Initialize game
function init() {
  button1.onclick = goStore;
  button2.onclick = goCave;
  button3.onclick = fightDragon;
  updatePlayerHealth();
  updateInventory();
  updateWeaponPower();
  statusElement.textContent = "READY";
}

// Update location
function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
  locationText.textContent = location.name;
  
  // Add visual feedback
  text.parentElement.classList.add('combat-shake');
  setTimeout(() => {
    text.parentElement.classList.remove('combat-shake');
  }, 400);
  
  // Update status
  statusElement.textContent = location.name;
}

// Update player health display
function updatePlayerHealth() {
  healthText.innerText = health;
  const healthPercent = Math.min(health, 100);
  playerHealthBar.style.width = `${healthPercent}%`;
  playerHealthText.textContent = `${health}`;
  
  // Change color based on health level
  if (health > 100) {
    playerHealthBar.style.background = "linear-gradient(90deg, #f1fa8c 0%, #ffb86c 100%)";
  } else if (health > 60) {
    playerHealthBar.style.background = "linear-gradient(90deg, #50fa7b 0%, #27ca3f 100%)";
  } else if (health > 30) {
    playerHealthBar.style.background = "linear-gradient(90deg, #ffb86c 0%, #ff9500 100%)";
  } else {
    playerHealthBar.style.background = "linear-gradient(90deg, #ff5555 0%, #ff3b30 100%)";
  }
}

// Update inventory display
function updateInventory() {
  inventoryDisplay.innerHTML = '';
  inventory.forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.className = `inventory-item ${index === currentWeapon ? 'active' : ''}`;
    itemElement.textContent = item;
    inventoryDisplay.appendChild(itemElement);
  });
}

// Update weapon power display
function updateWeaponPower() {
  weaponPowerElement.textContent = weapons[currentWeapon].power;
}

// Location functions
function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    
    updatePlayerHealth();
    
    // Add healing animation
    playerHealthBar.parentElement.classList.add('heal-glow');
    setTimeout(() => {
      playerHealthBar.parentElement.classList.remove('heal-glow');
    }, 800);
    
    text.innerText = `You purchased a health potion and restored 10 health points! Your health is now ${health}. 💚`;
  } else {
    text.innerText = "You do not have enough gold to buy health. You need 10 gold.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = `You purchased a ${newWeapon}! Your attack power has increased! ⚔️`;
      inventory.push(newWeapon);
      updateInventory();
      updateWeaponPower();
    } else {
      text.innerText = "You do not have enough gold to buy this weapon. You need 30 gold.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeaponName = inventory.shift();
    currentWeapon = Math.max(0, currentWeapon - 1);
    
    text.innerText = "You sold a " + currentWeaponName + " for 15 gold. 💰";
    updateInventory();
    updateWeaponPower();
  } else {
    text.innerText = "Don't sell your only weapon! You need it to fight!";
  }
}

// Combat functions
function fightSlime() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightDragon() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  
  monsterStats.style.display = "flex";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = `${monsterHealth}/${monsters[fighting].health}`;
  
  // Update monster health bar
  const monsterHealthPercent = (monsterHealth / monsters[fighting].health) * 100;
  monsterHealthBar.style.width = `${monsterHealthPercent}%`;
}

function attack() {
  // Player attacks monster
  text.innerText = "You attack the " + monsters[fighting].name + " with your " + weapons[currentWeapon].name + ".";
  
  let playerDamage = weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
  if (isMonsterHit()) {
    monsterHealth -= playerDamage;
    text.innerText += " You hit the " + monsters[fighting].name + " for " + playerDamage + " damage! 💥";
  } else {
    text.innerText += " You miss! ❌";
  }
  
  // Monster attacks player
  if (monsterHealth > 0) {
    let monsterDamage = getMonsterAttackValue(monsters[fighting].level);
    health -= monsterDamage;
    text.innerText += " The " + monsters[fighting].name + " attacks you for " + monsterDamage + " damage! 💔";
    
    // Visual feedback for damage
    document.querySelector('.health-display').classList.add('damage-pulse');
    setTimeout(() => {
      document.querySelector('.health-display').classList.remove('damage-pulse');
    }, 300);
  }
  
  // Update displays
  updatePlayerHealth();
  monsterHealthText.innerText = `${Math.max(0, monsterHealth)}/${monsters[fighting].health}`;
  
  // Update monster health bar
  const monsterHealthPercent = (monsterHealth / monsters[fighting].health) * 100;
  monsterHealthBar.style.width = `${Math.max(0, monsterHealthPercent)}%`;
  
  // Check game state
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  
  // Chance of weapon breaking
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks! 🔨";
    currentWeapon--;
    updateInventory();
    updateWeaponPower();
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name + "! 🛡️";
}

function defeatMonster() {
  const goldEarned = Math.floor(monsters[fighting].level * 6.7);
  gold += goldEarned;
  xp += monsters[fighting].level;
  
  goldText.innerText = gold;
  xpText.innerText = xp;
  
  text.innerHTML = `The ${monsters[fighting].name} is defeated! You gained ${monsters[fighting].level} XP and found ${goldEarned} gold! 🎉`;
  
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  
  goldText.innerText = gold;
  xpText.innerText = xp;
  
  updatePlayerHealth();
  updateInventory();
  updateWeaponPower();
  goTown();
}

// Easter egg functions
function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold! 🎊";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health! 💔";
    health -= 10;
    updatePlayerHealth();
    
    if (health <= 0) {
      lose();
    }
  }
}

// Initialize the game when page loads
window.onload = init;