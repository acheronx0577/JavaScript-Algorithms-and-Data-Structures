const currentDateElement = document.getElementById("current-date");
const dateOptionsSelect = document.getElementById("date-options");
const timezoneSelect = document.getElementById("timezone-select");
const timezoneElement = document.getElementById("timezone");
const timestampElement = document.getElementById("timestamp");
const dayOfYearElement = document.getElementById("day-of-year");
const weekNumberElement = document.getElementById("week-number");
const formatHistoryElement = document.getElementById("format-history");
const copyDateBtn = document.getElementById("copy-date-btn");
const refreshBtn = document.getElementById("refresh-btn");
const themeToggle = document.getElementById("theme-toggle");
const footerStatus = document.getElementById("footer-status");
const uptimeElement = document.getElementById("uptime");
const formatsUsedElement = document.getElementById("formats-used");

let formatHistory = [];
let formatsUsed = 0;
let startTime = new Date();
let currentTheme = 'dark';

// Theme definitions
const themes = {
    dark: {
        '--bg-primary': '#0a0a0f',
        '--bg-secondary': '#151520',
        '--bg-tertiary': '#1e1e2e',
        '--bg-card': '#252536',
        '--text-primary': '#e8e8f0',
        '--text-secondary': '#b8b8c8',
        '--text-dim': '#6c6c8a',
        '--border-primary': '#2a2a3a',
        '--border-active': '#4a4a6a',
        '--accent-primary': '#7e6ca8',
        '--accent-secondary': '#5d8bb0',
        '--time-color': '#b86ad4' // Add this - current time display color
    },
    darker: {
        '--bg-primary': '#050508',
        '--bg-secondary': '#0c0c14',
        '--bg-tertiary': '#141420',
        '--bg-card': '#1c1c2c',
        '--text-primary': '#d8d8e8',
        '--text-secondary': '#9898a8',
        '--text-dim': '#5c5c7a',
        '--border-primary': '#202030',
        '--border-active': '#404060',
        '--accent-primary': '#6a5c8c',
        '--accent-secondary': '#4a7b9c',
        '--time-color': '#6a5c8c' // Add this
    },
    blue: {
        '--bg-primary': '#0a0f1a',
        '--bg-secondary': '#151a2a',
        '--bg-tertiary': '#1e2436',
        '--bg-card': '#252b40',
        '--text-primary': '#e8f0f8',
        '--text-secondary': '#b8c8d8',
        '--text-dim': '#6c7a8a',
        '--border-primary': '#2a364a',
        '--border-active': '#4a5a6a',
        '--accent-primary': '#4a6ca8',
        '--accent-secondary': '#5d8bb0',
        '--time-color': '#6a8cd4' // Add this - different color for blue theme
    },
        green: {
        '--bg-primary': '#0a0f0a',
        '--bg-secondary': '#151a15',
        '--bg-tertiary': '#1e241e',
        '--bg-card': '#252b25',
        '--text-primary': '#e8f0e8',
        '--text-secondary': '#b8c8b8',
        '--text-dim': '#6c7a6c',
        '--border-primary': '#2a362a',
        '--border-active': '#4a5a4a',
        '--accent-primary': '#4a8c6a',
        '--accent-secondary': '#5dbb8b',
        '--time-color': '#67c29c' // Green time display
    },
    purple: {
        '--bg-primary': '#0f0a1a',
        '--bg-secondary': '#1a152a',
        '--bg-tertiary': '#241e36',
        '--bg-card': '#2b2540',
        '--text-primary': '#f0e8f8',
        '--text-secondary': '#c8b8d8',
        '--text-dim': '#7a6c8a',
        '--border-primary': '#362a4a',
        '--border-active': '#5a4a6a',
        '--accent-primary': '#8c6ca8',
        '--accent-secondary': '#bb8bd0',
        '--time-color': '#b86ad4' // Purple time display
    },
    orange: {
        '--bg-primary': '#1a0f0a',
        '--bg-secondary': '#2a1a15',
        '--bg-tertiary': '#36241e',
        '--bg-card': '#402b25',
        '--text-primary': '#f8e8e8',
        '--text-secondary': '#d8c8b8',
        '--text-dim': '#8a7a6c',
        '--border-primary': '#4a362a',
        '--border-active': '#6a5a4a',
        '--accent-primary': '#a86c4a',
        '--accent-secondary': '#d08b5d',
        '--time-color': '#d4a86a' // Orange time display
    },
    red: {
        '--bg-primary': '#1a0a0a',
        '--bg-secondary': '#2a1515',
        '--bg-tertiary': '#361e1e',
        '--bg-card': '#402525',
        '--text-primary': '#f8e8e8',
        '--text-secondary': '#d8b8b8',
        '--text-dim': '#8a6c6c',
        '--border-primary': '#4a2a2a',
        '--border-active': '#6a4a4a',
        '--accent-primary': '#a84a4a',
        '--accent-secondary': '#d05d5d',
        '--time-color': '#d46a6a'
    },
    cyan: {
        '--bg-primary': '#0a1a1a',
        '--bg-secondary': '#152a2a',
        '--bg-tertiary': '#1e3636',
        '--bg-card': '#254040',
        '--text-primary': '#e8f8f8',
        '--text-secondary': '#b8d8d8',
        '--text-dim': '#6c8a8a',
        '--border-primary': '#2a4a4a',
        '--border-active': '#4a6a6a',
        '--accent-primary': '#4a8c8c',
        '--accent-secondary': '#5dbbbb',
        '--time-color': '#6ad4d4'
    },
    pink: {
        '--bg-primary': '#1a0a1a',
        '--bg-secondary': '#2a152a',
        '--bg-tertiary': '#361e36',
        '--bg-card': '#402540',
        '--text-primary': '#f8e8f8',
        '--text-secondary': '#d8b8d8',
        '--text-dim': '#8a6c8a',
        '--border-primary': '#4a2a4a',
        '--border-active': '#6a4a6a',
        '--accent-primary': '#a84aa8',
        '--accent-secondary': '#d05dd0',
        '--time-color': '#d46ad4'
    },
    amber: {
        '--bg-primary': '#1a140a',
        '--bg-secondary': '#2a1f15',
        '--bg-tertiary': '#36291e',
        '--bg-card': '#403225',
        '--text-primary': '#f8f4e8',
        '--text-secondary': '#d8d0b8',
        '--text-dim': '#8a826c',
        '--border-primary': '#4a3e2a',
        '--border-active': '#6a5c4a',
        '--accent-primary': '#a88c4a',
        '--accent-secondary': '#d0b35d',
        '--time-color': '#d4c26a'
    },
    teal: {
        '--bg-primary': '#0a1a16',
        '--bg-secondary': '#152a24',
        '--bg-tertiary': '#1e362e',
        '--bg-card': '#254038',
        '--text-primary': '#e8f8f4',
        '--text-secondary': '#b8d8d0',
        '--text-dim': '#6c8a82',
        '--border-primary': '#2a4a40',
        '--border-active': '#4a6a60',
        '--accent-primary': '#4a8c7a',
        '--accent-secondary': '#5dbb9d',
        '--time-color': '#6ad4b8'
    }
};

// Convert 24h to 12h with AM/PM
function to12Hour(hours, minutes, seconds = null) {
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const twelveHour = hours % 12 || 12;
    
    if (seconds !== null) {
        return `${twelveHour}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${ampm}`;
    }
    return `${twelveHour}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

// Get date in specific timezone
function getDateInTimezone(timezone) {
    const date = new Date();
    if (timezone === 'auto') {
        return date;
    }
    
    const options = { 
        timeZone: timezone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
    };
    
    const formatter = new Intl.DateTimeFormat('en-US', options);
    const parts = formatter.formatToParts(date);
    
    const getPart = (type) => parts.find(part => part.type === type)?.value;
    
    return new Date(
        parseInt(getPart('year')),
        parseInt(getPart('month')) - 1,
        parseInt(getPart('day')),
        parseInt(getPart('hour')),
        parseInt(getPart('minute')),
        parseInt(getPart('second'))
    );
}

function updateDate() {
    const selectedTimezone = timezoneSelect.value;
    const date = selectedTimezone === 'auto' ? new Date() : getDateInTimezone(selectedTimezone);
    
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    // Add leading zeros
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    const dayName = dayNames[date.getDay()];
    const monthName = monthNames[date.getMonth()];
    
    const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;
    
    let displayText = "";
    
    switch (dateOptionsSelect.value) {
        case "yyyy-mm-dd":
            displayText = formattedDate.split("-").reverse().join("-");
            break;
        case "mm-dd-yyyy-h-mm":
            displayText = `${formattedMonth}-${formattedDay}-${year} ${to12Hour(hours, minutes)}`;
            break;
        case "mm-dd-yyyy-h-mm-ss":
            displayText = `${formattedMonth}-${formattedDay}-${year} ${to12Hour(hours, minutes, seconds)}`;
            break;
        case "full-date":
            displayText = `${dayName}, ${monthName} ${formattedDay}, ${year}`;
            break;
        case "full-date-time":
            displayText = `${dayName}, ${monthName} ${formattedDay}, ${year} ${to12Hour(hours, minutes, seconds)}`;
            break;
        case "relative":
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const diffTime = date - today;
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            
            if (diffHours < 1) {
                displayText = "Today";
            } else if (diffHours < 24) {
                displayText = `Today, ${to12Hour(hours, minutes)}`;
            } else {
                displayText = `${monthName} ${formattedDay}`;
            }
            break;
        case "unix":
            displayText = Math.floor(date.getTime() / 1000).toString();
            break;
        default:
            displayText = formattedDate;
    }
    
    currentDateElement.textContent = displayText;
    
    // Update additional info
    updateAdditionalInfo(date, selectedTimezone);
}

function updateAdditionalInfo(date, timezone) {
    // Update timezone display
    if (timezone === 'auto') {
        const detectedTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        timezoneElement.textContent = detectedTimezone;
    } else {
        timezoneElement.textContent = timezoneSelect.options[timezoneSelect.selectedIndex].text;
    }
    
    // Timestamp - update every second
    timestampElement.textContent = Math.floor(date.getTime() / 1000);
    
    // Day of year - update once per day
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    
    // Only update if it changed (new day)
    if (dayOfYearElement.textContent !== dayOfYear.toString()) {
        dayOfYearElement.textContent = dayOfYear;
    }
    
    // Week number
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    weekNumberElement.textContent = weekNumber;
}

function updateUptime() {
    const now = new Date();
    const diff = now - startTime;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    uptimeElement.textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function addToHistory(format, value) {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    
    formatHistory.unshift({
        time: timeString,
        format: format,
        value: value
    });
    
    // Keep only last 10 items
    if (formatHistory.length > 10) {
        formatHistory.pop();
    }
    
    formatsUsed++;
    formatsUsedElement.textContent = formatsUsed;
    
    // Update history display
    formatHistoryElement.innerHTML = '';
    formatHistory.forEach(item => {
        const historyItem = document.createElement('li');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <span class="history-time">${item.time}</span>
            <span class="history-format">${item.format}</span>
            <span class="history-value">${item.value}</span>
        `;
        formatHistoryElement.appendChild(historyItem);
    });
}

function copyToClipboard() {
    const text = currentDateElement.textContent;
    navigator.clipboard.writeText(text).then(() => {
        footerStatus.textContent = 'COPIED';
        footerStatus.style.color = 'var(--accent-success)';
        setTimeout(() => {
            footerStatus.textContent = 'READY';
            footerStatus.style.color = '';
        }, 2000);
    });
}

function toggleTheme() {
    const themeNames = Object.keys(themes);
    const currentIndex = themeNames.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    currentTheme = themeNames[nextIndex];
    
    const theme = themes[currentTheme];
    Object.keys(theme).forEach(key => {
        document.documentElement.style.setProperty(key, theme[key]);
    });
    
    footerStatus.textContent = `THEME: ${currentTheme.toUpperCase()}`;
    setTimeout(() => {
        footerStatus.textContent = 'READY';
    }, 2000);
}

// Event Listeners
dateOptionsSelect.addEventListener("change", () => {
    updateDate();
    const formatName = dateOptionsSelect.options[dateOptionsSelect.selectedIndex].text;
    addToHistory(formatName, currentDateElement.textContent);
});

timezoneSelect.addEventListener("change", updateDate);

copyDateBtn.addEventListener("click", copyToClipboard);

refreshBtn.addEventListener("click", () => {
    updateDate();
    footerStatus.textContent = 'REFRESHED';
    setTimeout(() => {
        footerStatus.textContent = 'READY';
    }, 1000);
});

themeToggle.addEventListener("click", toggleTheme);

// Initialize with current date
updateDate();
updateUptime();

// Update date every second
setInterval(updateDate, 1000);

// Update uptime every second
setInterval(updateUptime, 1000);

// Add initial history entry
setTimeout(() => {
    const formatName = dateOptionsSelect.options[dateOptionsSelect.selectedIndex].text;
    addToHistory(formatName, currentDateElement.textContent);
}, 100);