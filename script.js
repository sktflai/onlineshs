// Get DOM elements
const lessonTitle = document.getElementById("lessonTitle");
const lessonContent = document.getElementById("lessonContent");
const summaryContent = document.getElementById("summaryContent");
const videoLink = document.getElementById("videoLink");
const quizContainer = document.getElementById("quizContainer");
const progressText = document.getElementById("progressText");
const navItems = document.querySelectorAll(".nav-item");
const activityContent = document.getElementById("activityContent");

let currentLesson = null;
let userProgress = {};

// Initialize all lessons progress to 0
for (let key in lessons) {
  userProgress[key] = {
    completed: false,
    score: 0
  };
}

// Switch tabs
navItems.forEach(item => {
  item.addEventListener("click", () => {
    const tab = item.dataset.tab;
    document.querySelectorAll(".tab").forEach(t => t.style.display = "none");
    document.getElementById(tab).style.display = "block";

    if(tab === "progressTab") updateProgress();
  });
});

// Load lesson
function loadLesson(key) {
  currentLesson = key;
  const lesson = lessons[key];
  lessonTitle.textContent = lesson.title;
  lessonContent.innerHTML = lesson.lesson;
  summaryContent.innerHTML = lesson.summary;
  videoLink.href = lesson.video;
  loadQuiz(lesson.quiz);
}

// Load quiz
function loadQuiz(quizArray) {
  quizContainer.innerHTML = "";
  quizArray.forEach((q, index) => {
    const qDiv = document.createElement("div");
    qDiv.classList.add("quiz-question");
    qDiv.innerHTML = `<p>${index+1}. ${q.question}</p>`;
    q.choices.forEach((choice, i) => {
      const btn = document.createElement("button");
      btn.textContent = choice;
      btn.addEventListener("click", () => checkAnswer(index, i, q));
      qDiv.appendChild(btn);
    });
    quizContainer.appendChild(qDiv);
  });
}

// Check answer
function checkAnswer(index, choiceIndex, quizItem) {
  if(choiceIndex === quizItem.answer) {
    alert(`Correct! ✅\n${quizItem.explanation}`);
    userProgress[currentLesson].score++;
  } else {
    alert(`Incorrect ❌\n${quizItem.explanation}`);
  }

  // Mark lesson completed if all questions answered
  const totalQuestions = lessons[currentLesson].quiz.length;
  const currentScore = userProgress[currentLesson].score;
  if(currentScore >= totalQuestions) userProgress[currentLesson].completed = true;
  updateProgress();
}

// Update progress
function updateProgress() {
  let totalLessons = Object.keys(lessons).length;
  let completedLessons = 0;
  let totalScore = 0;
  for(let key in userProgress) {
    if(userProgress[key].completed) completedLessons++;
    totalScore += userProgress[key].score;
  }
  let percent = Math.round((completedLessons/totalLessons)*100);
  progressText.textContent = `Lessons completed: ${completedLessons}/${totalLessons} (${percent}%)\nTotal quiz score: ${totalScore}`;
}

// Load activity content (placeholder)
function loadActivity(content) {
  activityContent.innerHTML = content;
}

// Initially load first lesson
loadLesson(Object.keys(lessons)[0]);
