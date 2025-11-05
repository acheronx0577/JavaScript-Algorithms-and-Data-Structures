const darkColorsArr = [
    "#2C3E50", "#34495E", "#2C2C2C", "#616A6B", "#4A235A",
    "#2F4F4F", "#0E4B5A", "#36454F", "#2C3E50", "#800020",
    "#1A1A2E", "#16213E", "#0F3460", "#533483", "#E94560",
    "#1B1B2F", "#1F4068", "#1C0C5B", "#3D2C8D", "#916BBF"
];

// DOM Elements
const body = document.querySelector("body");
const bgHexCodeElement = document.querySelector("#bg-hex-code");
const colorRgbElement = document.querySelector("#color-rgb");
const colorPreview = document.querySelector("#color-preview");
const btn = document.querySelector("#btn");
const copyBtn = document.querySelector("#copy-btn");
const lockBtn = document.querySelector("#lock-btn");
const statusElement = document.querySelector("#status");
const lastActionElement = document.querySelector("#last-action");
const totalGeneratedElement = document.querySelector("#total-generated");
const colorsAvailableElement = document.querySelector("#colors-available");
const colorHistoryElement = document.querySelector("#color-history");
const connectionStatus = document.querySelector("#connection-status");

// Game State
let totalGenerated = 0;
let currentColor = "#110815";
let isLocked = false;
let colorHistory = [];

function getRandomIndex() {
    return Math.floor(darkColorsArr.length * Math.random());
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function updateColorHistory(color) {
    if (!colorHistory.includes(color)) {
        colorHistory.unshift(color);
        if (colorHistory.length > 8) {
            colorHistory.pop();
        }
        
        colorHistoryElement.innerHTML = '';
        colorHistory.forEach(historyColor => {
            const colorElement = document.createElement('div');
            colorElement.className = 'history-color';
            colorElement.style.backgroundColor = historyColor;
            colorElement.title = historyColor;
            colorElement.addEventListener('click', () => {
                if (!isLocked) {
                    setColor(historyColor);
                    updateStatus('HISTORY_LOADED', 'var(--accent-info)');
                }
            });
            colorHistoryElement.appendChild(colorElement);
        });
    }
}

function setColor(color) {
    currentColor = color;
    
    // Update background with smooth transition
    body.style.backgroundColor = color;
    
    // Update color preview
    colorPreview.style.backgroundColor = color;
    colorPreview.classList.add('color-change');
    setTimeout(() => colorPreview.classList.remove('color-change'), 500);
    
    // Update text displays
    bgHexCodeElement.textContent = color.toUpperCase();
    
    const rgb = hexToRgb(color);
    if (rgb) {
        colorRgbElement.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }
    
    // Update history
    updateColorHistory(color);
}

function changeBackgroundColor() {
    if (isLocked) {
        updateStatus('COLOR_LOCKED', 'var(--accent-warning)');
        return;
    }
    
    const color = darkColorsArr[getRandomIndex()];
    setColor(color);
    
    totalGenerated++;
    totalGeneratedElement.textContent = totalGenerated;
    
    updateStatus('COLOR_GENERATED', 'var(--accent-success)');
    lastActionElement.textContent = 'GENERATED';
}

function copyToClipboard() {
    navigator.clipboard.writeText(currentColor).then(() => {
        updateStatus('COPIED_TO_CLIPBOARD', 'var(--accent-primary)');
        lastActionElement.textContent = 'COPIED';
        
        // Visual feedback
        bgHexCodeElement.classList.add('copy-pulse');
        setTimeout(() => bgHexCodeElement.classList.remove('copy-pulse'), 500);
    }).catch(err => {
        updateStatus('COPY_FAILED', 'var(--accent-warning)');
        console.error('Failed to copy: ', err);
    });
}

function toggleLock() {
    isLocked = !isLocked;
    if (isLocked) {
        lockBtn.innerHTML = '<span class="btn-text">UNLOCK_COLOR</span><span class="btn-shortcut">[L]</span>';
        lockBtn.style.background = 'linear-gradient(135deg, var(--accent-warning) 0%, #ff3b30 100%)';
        updateStatus('COLOR_LOCKED', 'var(--accent-warning)');
        lastActionElement.textContent = 'LOCKED';
    } else {
        lockBtn.innerHTML = '<span class="btn-text">LOCK_COLOR</span><span class="btn-shortcut">[L]</span>';
        lockBtn.style.background = 'linear-gradient(135deg, var(--accent-info) 0%, #8be9fd 100%)';
        updateStatus('COLOR_UNLOCKED', 'var(--accent-info)');
        lastActionElement.textContent = 'UNLOCKED';
    }
}

function updateStatus(message, color) {
    statusElement.textContent = message;
    statusElement.style.color = color;
}

// Event Listeners
btn.onclick = changeBackgroundColor;

copyBtn.addEventListener('click', copyToClipboard);
lockBtn.addEventListener('click', toggleLock);

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        changeBackgroundColor();
    } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        copyToClipboard();
    } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        toggleLock();
    }
});

// Initialize
function init() {
    colorsAvailableElement.textContent = darkColorsArr.length;
    updateStatus('AWAITING_INPUT', 'var(--accent-success)');
    connectionStatus.textContent = 'ONLINE';
    
    // Add initial color to history
    updateColorHistory(currentColor);
}

// Initialize when page loads
window.onload = init;