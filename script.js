// DOM elements
const lessonTitle = document.getElementById("lessonTitle");
const lessonContent = document.getElementById("lessonContent");
const summaryContent = document.getElementById("summaryContent");
const videoLink = document.getElementById("videoLink");
const quizContainer = document.getElementById("quizContainer");
const testContainer = document.getElementById("testContainer");
const progressText = document.getElementById("progressText");
const navItems = document.querySelectorAll(".nav-item");
const activityContent = document.getElementById("activityContent");

const lessonSelector = document.getElementById("lessonSelector");
const quizSelector = document.getElementById("quizSelector");
const testSelector = document.getElementById("testSelector");

let currentLesson = null;
let currentQuiz = 0;
let currentTest = 0;
let userProgress = {};

// Initialize lessons
for (let key in lessons) {
  userProgress[key] = { completed: false, score: 0 };
  const option = document.createElement("option");
  option.value = key;
  option.textContent = lessons[key].title;
  lessonSelector.appendChild(option);
}

// Navigation tab switch
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
  lessonSelector.value = key;
  const lesson = lessons[key];
  lessonTitle.textContent = lesson.title;
  lessonContent.innerHTML = lesson.lesson;
  summaryContent.innerHTML = lesson.summary;
  videoLink.href = lesson.video;

  loadQuizDropdown();
  loadTestDropdown();
  loadQuiz(0);
  loadTest(0);
}

// Quiz Dropdown
function loadQuizDropdown() {
  quizSelector.innerHTML = "";
  lessons[currentLesson].quizzes.forEach((q, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = q.name;
    quizSelector.appendChild(opt);
  });
  quizSelector.addEventListener("change", e => loadQuiz(parseInt(e.target.value)));
}

// Load quiz
function loadQuiz(index) {
  currentQuiz = index;
  const quiz = lessons[currentLesson].quizzes[index];
  quizContainer.innerHTML = "";
  quiz.questions.forEach((q, i) => {
    const div = document.createElement("div");
    div.classList.add("quiz-question");
    div.innerHTML = `<p>${i+1}. ${q.question}</p>`;
    q.choices.forEach((c, j) => {
      const btn = document.createElement("button");
      btn.textContent = c;
      btn.addEventListener("click", () => checkQuizAnswer(i,j,q));
      div.appendChild(btn);
    });
    quizContainer.appendChild(div);
  });
}

// Check quiz answer
function checkQuizAnswer(qIndex, choiceIndex, quizItem) {
  if(choiceIndex === quizItem.answer){
    alert(`Correct! ✅\n${quizItem.explanation}`);
    userProgress[currentLesson].score++;
  } else {
    alert(`Incorrect ❌\n${quizItem.explanation}`);
  }
  updateProgress();
}

// Test Dropdown
function loadTestDropdown() {
  testSelector.innerHTML = "";
  lessons[currentLesson].tests.forEach((t,i)=>{
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = t.name;
    testSelector.appendChild(opt);
  });
  testSelector.addEventListener("change", e => loadTest(parseInt(e.target.value)));
}

// Load test
function loadTest(index){
  currentTest = index;
  const test = lessons[currentLesson].tests[index];
  testContainer.innerHTML = "";
  test.questions.forEach((q,i)=>{
    const div = document.createElement("div");
    div.classList.add("test-question");
    div.innerHTML = `<p>${i+1}. ${q.question}</p>`;
    q.choices.forEach((c,j)=>{
      const btn = document.createElement("button");
      btn.textContent = c;
      btn.addEventListener("click", ()=>checkTestAnswer(i,j,q));
      div.appendChild(btn);
    });
    testContainer.appendChild(div);
  });
}

// Check test answer
function checkTestAnswer(qIndex, choiceIndex, testItem){
  if(choiceIndex === testItem.answer){
    alert(`Correct! ✅\n${testItem.explanation}`);
    userProgress[currentLesson].score++;
  } else {
    alert(`Incorrect ❌\n${testItem.explanation}`);
  }
  updateProgress();
}

// Update progress
function updateProgress(){
  let totalLessons = Object.keys(lessons).length;
  let completedLessons = 0;
  let totalScore = 0;
  for(let key in userProgress){
    if(userProgress[key].completed) completedLessons++;
    totalScore += userProgress[key].score;
  }
  let percent = Math.round((completedLessons/totalLessons)*100);
  progressText.textContent = `Lessons completed: ${completedLessons}/${totalLessons} (${percent}%)\nTotal quiz/test score: ${totalScore}`;
}

// Lesson selector
lessonSelector.addEventListener("change", e => loadLesson(e.target.value));

// Load first lesson
loadLesson(Object.keys(lessons)[0]);
