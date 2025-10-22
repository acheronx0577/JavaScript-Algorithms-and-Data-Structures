const currentDateParagraph = document.getElementById("current-date");
const dateOptionsSelectElement = document.getElementById("date-options");

function updateDate() {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  
  // Add leading zeros if needed
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
  
  // Apply highlight animation
  currentDateParagraph.classList.remove('highlight');
  void currentDateParagraph.offsetWidth; // Trigger reflow
  currentDateParagraph.classList.add('highlight');
  
  switch (dateOptionsSelectElement.value) {
    case "yyyy-mm-dd":
      currentDateParagraph.textContent = formattedDate
        .split("-")
        .reverse()
        .join("-");
      break;
    case "mm-dd-yyyy-h-mm":
      currentDateParagraph.textContent = `${formattedMonth}-${formattedDay}-${year} ${formattedHours}:${formattedMinutes}`;
      break;
    case "full-date":
      currentDateParagraph.textContent = `${dayName}, ${monthName} ${formattedDay}, ${year}`;
      break;
    case "relative":
      // Simple relative time (you could enhance this further)
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const diffTime = date - today;
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      
      if (diffHours < 1) {
        currentDateParagraph.textContent = "Today";
      } else if (diffHours < 24) {
        currentDateParagraph.textContent = `Today, ${formattedHours}:${formattedMinutes}`;
      } else {
        currentDateParagraph.textContent = `${monthName} ${formattedDay}`;
      }
      break;
    default:
      currentDateParagraph.textContent = formattedDate;
  }
}

// Initialize with current date
updateDate();

// Update date every second to show live time
setInterval(updateDate, 1000);

// Add event listener for format changes
dateOptionsSelectElement.addEventListener("change", updateDate);

// Add a subtle hover effect to the dropdown
dateOptionsSelectElement.addEventListener("mouseenter", function() {
  this.style.borderColor = "var(--green)";
});

dateOptionsSelectElement.addEventListener("mouseleave", function() {
  if (document.activeElement !== this) {
    this.style.borderColor = "var(--blue)";
  }
});