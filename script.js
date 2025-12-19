// script.js - Core functionality for Online SHS

// Initialize data from localStorage or create default
let appData = {
  totalStudyTime: 0,        // in seconds
  lastVisit: null,          // timestamp
  memos: "",                // your personal bulletin board text
  progress: {},             // future: subject -> units -> lessons/quizzes/tests
  scores: {}                // future: quiz/test scores
};

function loadData() {
  const saved = localStorage.getItem('onlineSHS_data');
  if (saved) {
    appData = JSON.parse(saved);
  }
}

function saveData() {
  localStorage.setItem('onlineSHS_data', JSON.stringify(appData));
}

// Study time tracking
let studyInterval;

function startStudyTimer() {
  studyInterval = setInterval(() => {
    appData.totalStudyTime++;
    updateStudyTimeDisplay();
    saveData();
  }, 1000); // update every second
}

function stopStudyTimer() {
  if (studyInterval) {
    clearInterval(studyInterval);
  }
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateStudyTimeDisplay() {
  const timeDisplay = document.getElementById('studyTimeDisplay');
  if (timeDisplay) {
    timeDisplay.textContent = formatTime(appData.totalStudyTime);
  }
}

// Bulletin board (memos)
function setupBulletinBoard() {
  const textarea = document.getElementById('memosTextarea');
  const saveBtn = document.getElementById('saveMemosBtn');

  if (textarea && saveBtn) {
    textarea.value = appData.memos;

    saveBtn.addEventListener('click', () => {
      appData.memos = textarea.value;
      saveData();
      alert('Memos saved!');
    });

    // Auto-save on blur (when you click away)
    textarea.addEventListener('blur', () => {
      appData.memos = textarea.value;
      saveData();
    });
  }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  updateStudyTimeDisplay();
  setupBulletinBoard();
  startStudyTimer();

  // Update last visit
  appData.lastVisit = new Date().toISOString();
  saveData();
});

// Stop timer when page is hidden (e.g., switch tab or close browser)
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopStudyTimer();
  } else {
    startStudyTimer();
  }
});

// Stop timer when window is closed/unloaded
window.addEventListener('beforeunload', () => {
  stopStudyTimer();
  saveData();
});
