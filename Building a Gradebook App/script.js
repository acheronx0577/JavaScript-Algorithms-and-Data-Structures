// Steps 4 only on https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8

function getAverage(scores) {
  let sum = 0;

  for (const score of scores) {
    sum += score;
  }

  return sum / scores.length;
}

function getGrade(score) {
  if (score === 100) return "A++";
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function hasPassingGrade(score) {
  return getGrade(score) !== "F";
}

function studentMsg(totalScores, studentScore) {
  const average = getAverage(totalScores);
  const grade = getGrade(studentScore);
  const passed = hasPassingGrade(studentScore);
  
  if (passed) {
    return "Class average: " + average + ". Your grade: " + grade + ". You passed the course.";
  } else {
    return "Class average: " + average + ". Your grade: " + grade + ". You failed the course.";
  }
}

// DOM Interaction
document.addEventListener('DOMContentLoaded', function() {
  const calculateBtn = document.getElementById('calculate');
  const scoresInput = document.getElementById('scores');
  const studentScoreInput = document.getElementById('studentScore');
  const output = document.getElementById('output');
  const resultDiv = document.getElementById('result');
  const studentCount = document.getElementById('student-count');
  const avgDisplay = document.getElementById('avg-display');

  function updateStats() {
    try {
      const scoresArray = scoresInput.value.split(',').map(score => parseInt(score.trim())).filter(score => !isNaN(score));
      studentCount.textContent = scoresArray.length;
      
      if (scoresArray.length > 0) {
        const avg = getAverage(scoresArray);
        avgDisplay.textContent = avg.toFixed(1);
      } else {
        avgDisplay.textContent = '-';
      }
    } catch (error) {
      studentCount.textContent = '0';
      avgDisplay.textContent = '-';
    }
  }

  calculateBtn.addEventListener('click', function() {
    const scoresText = scoresInput.value;
    const studentScore = parseInt(studentScoreInput.value);
    
    if (!scoresText.trim()) {
      alert("Please enter class scores!");
      return;
    }
    
    if (isNaN(studentScore)) {
      alert("Please enter a valid student score!");
      return;
    }

    // Show loading state
    output.classList.remove('hide');
    resultDiv.innerHTML = '<div style="text-align: center; color: var(--text-dim);">PROCESSING...</div>';
    calculateBtn.disabled = true;

    // Simulate processing delay
    setTimeout(() => {
      try {
        const scoresArray = scoresText.split(',').map(score => parseInt(score.trim())).filter(score => !isNaN(score));
        const message = studentMsg(scoresArray, studentScore);
        
        const passed = hasPassingGrade(studentScore);
        const gradeClass = passed ? 'grade-pass' : 'grade-fail';
        
        resultDiv.innerHTML = `
          <div class="${gradeClass}">${message}</div>
          <div style="margin-top: 12px; color: var(--text-dim); font-size: 0.9em;">
            SCORES_PROCESSED: ${scoresArray.length}<br>
            STUDENT_SCORE: ${studentScore}<br>
            GRADE: ${getGrade(studentScore)}
          </div>
        `;

        // Update output status
        const outputStatus = output.querySelector('.output-status');
        outputStatus.textContent = 'COMPLETED';
        outputStatus.style.color = passed ? 'var(--accent-success)' : 'var(--accent-error)';

      } catch (error) {
        resultDiv.innerHTML = `<div style="color: var(--accent-error);">ERROR: ${error.message}</div>`;
      } finally {
        calculateBtn.disabled = false;
      }
    }, 600);
  });

  // Update stats when scores change
  scoresInput.addEventListener('input', updateStats);
  studentScoreInput.addEventListener('input', updateStats);

  // Initialize stats
  updateStats();

  // Add Enter key support
  studentScoreInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      calculateBtn.click();
    }
  });
});

// Keep the original console log for testing
console.log(studentMsg([92, 88, 12, 77, 57, 100, 67, 38, 97, 89], 37));