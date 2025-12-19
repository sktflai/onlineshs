const subjects = ['PreCalculus', 'GeneralBiology1', 'GeneralChemistry1', 'GeneralPhysics1', 'EarthScience'];

const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebarToggle');
const mainContent = document.querySelector('.main-content');

function isMobile() {
    return window.innerWidth <= 768;
}

function setInitialSidebarState() {
    if (isMobile()) {
        sidebar.classList.remove('show');
        mainContent.style.marginLeft = '0';
    } else {
        sidebar.classList.add('show');
        mainContent.style.marginLeft = '250px';
    }
}

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('show');
    if (!isMobile()) {
        mainContent.style.marginLeft = sidebar.classList.contains('show') ? '250px' : '0';
    }
});

window.addEventListener('resize', setInitialSidebarState);
setInitialSidebarState();

function showTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
    if (isMobile()) {
        sidebar.classList.remove('show');
    }
    if (tabId === 'myPage') loadProgress();
}

// Rest of your original script.js code remains the same below (loadProgress, studyTimer, loadUnits, loadLesson, etc.)
// I've omitted repeating it here for brevity, but copy your full original script.js and insert this new toggle logic at the top.

function loadProgress() {
    const progressCharts = document.getElementById('progress-charts');
    progressCharts.innerHTML = '';
    let totalPoints = 0;
    subjects.forEach(subject => {
        const progress = localStorage.getItem(`${subject}-progress`) || 0;
        const div = document.createElement('div');
        div.classList.add('col-md-6');
        div.innerHTML = `
            <p>${subject}: ${progress}% complete</p>
            <div class="progress">
                <div class="progress-bar" style="width: ${progress}%"></div>
            </div>
        `;
        progressCharts.appendChild(div);
        totalPoints += parseInt(localStorage.getItem(`${subject}-score`) || 0);
    });
    document.getElementById('points').textContent = `Points: ${totalPoints} / 1000 (Aim for 800 to pass)`;
    document.getElementById('study-time').textContent = `Study Time: ${localStorage.getItem('studyTime') || 0} minutes`;
    const lessonTimes = document.getElementById('lesson-times');
    lessonTimes.innerHTML = '';
    subjects.forEach(subject => {
        for (let u = 1; u <= 4; u++) {
            const start = localStorage.getItem(`${subject}-unit${u}-start`);
            const finish = localStorage.getItem(`${subject}-unit${u}-finish`);
            if (start) {
                lessonTimes.innerHTML += `<p>${subject} Unit${u}: Started ${start}, Finished ${finish || 'Not yet'}</p>`;
            }
        }
    });
}

let studyTimer;
function startStudyTimer(subject, unit) {
    localStorage.setItem(`${subject}-${unit}-start`, new Date().toLocaleString());
    studyTimer = setInterval(() => {
        let time = parseInt(localStorage.getItem('studyTime') || 0);
        time++;
        localStorage.setItem('studyTime', time);
    }, 60000);
}

function stopStudyTimer(subject, unit) {
    clearInterval(studyTimer);
    localStorage.setItem(`${subject}-${unit}-finish`, new Date().toLocaleString());
    loadProgress();
}

function loadUnits(subject) {
    const lessonContent = document.getElementById('lesson-content');
    const unitList = document.getElementById('unit-list');
    
    // Try to load the subject index first
    fetch(`lessons/${subject}/index.html`)
        .then(response => {
            if (response.ok) {
                return response.text();
            }
            throw new Error('No index');
        })
        .then(data => {
            lessonContent.innerHTML = data;
            unitList.innerHTML = ''; // Hide unit buttons since index has its own
        })
        .catch(() => {
            // If no index.html, fall back to showing unit buttons
            unitList.innerHTML = '';
            for (let i = 1; i <= 4; i++) {
                const btn = document.createElement('button');
                btn.textContent = `Unit ${i}`;
                btn.classList.add('btn', 'btn-primary', 'me-2', 'mb-2');
                btn.onclick = () => loadLesson(subject, i);
                unitList.appendChild(btn);
            }
            lessonContent.innerHTML = '<p>Select a unit above to begin.</p>';
        });
    }
}

function loadLesson(subject, unit) {
    const lessonContent = document.getElementById('lesson-content');
    fetch(`lessons/${subject}/unit${unit}.html`)
        .then(response => response.text())
        .then(data => {
            lessonContent.innerHTML = data;
            startStudyTimer(subject, `unit${unit}`);
            const completeBtn = document.createElement('button');
            completeBtn.textContent = 'Mark Complete';
            completeBtn.classList.add('btn', 'btn-success', 'mt-3');
            completeBtn.onclick = () => {
                stopStudyTimer(subject, `unit${unit}`);
                let progress = parseInt(localStorage.getItem(`${subject}-progress`) || 0);
                progress += 25;
                localStorage.setItem(`${subject}-progress`, progress);
                loadProgress();
            };
            lessonContent.appendChild(completeBtn);
        });
}

function loadQuizUnits(subject) {
    const quizList = document.getElementById('quiz-list');
    quizList.innerHTML = '';
    for (let i = 1; i <= 4; i++) {
        const btn = document.createElement('button');
        btn.textContent = `Quiz ${i} (Unit ${i})`;
        btn.classList.add('btn', 'btn-primary', 'me-2', 'mb-2');
        btn.onclick = () => loadQuiz(subject, i);
        quizList.appendChild(btn);
    }
}

let quizData, currentQuestion = 0, score = 0, quizTimer;
function loadQuiz(subject, quizNum) {
    const quizContent = document.getElementById('quiz-content');
    quizContent.innerHTML = '<p class="timer" id="quiz-timer">15:00</p>';
    fetch(`quizzes/${subject}/quiz${quizNum}.js`)
        .then(response => response.text())
        .then(data => {
            eval(data);
            quizData = quizQuestions;
            score = 0;
            currentQuestion = 0;
            showQuestion();
            startTimer(15 * 60, 'quiz-timer', () => submitQuiz(subject));
        });
}

function showQuestion() {
    const quizContent = document.getElementById('quiz-content');
    const q = quizData[currentQuestion];
    let html = `<div class="question"><p>${q.question}</p>`;
    q.options.forEach((opt, idx) => {
        html += `<label class="d-block"><input type="radio" name="answer" value="${idx}">${opt}</label>`;
    });
    html += `<button class="btn btn-primary mt-2" onclick="nextQuestion()">Next</button></div>`;
    quizContent.innerHTML += html;
}

function nextQuestion() {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (selected) {
        const feedbackDiv = document.createElement('div');
        if (parseInt(selected.value) === quizData[currentQuestion].correct) {
            score++;
            feedbackDiv.innerHTML = `<p class="feedback">Correct! Explanation: ${quizData[currentQuestion].explanation}</p>`;
        } else {
            feedbackDiv.innerHTML = `<p class="error">Wrong. Correct is ${quizData[currentQuestion].options[quizData[currentQuestion].correct]}. Explanation: ${quizData[currentQuestion].explanation}</p>`;
        }
        document.getElementById('quiz-content').appendChild(feedbackDiv);
        currentQuestion++;
        if (currentQuestion < quizData.length) {
            showQuestion();
        } else {
            submitQuiz();
        }
    }
}

function submitQuiz(subject) {
    clearInterval(quizTimer);
    const quizContent = document.getElementById('quiz-content');
    quizContent.innerHTML += `<p class="mt-3 fw-bold">Score: ${score} / ${quizData.length}</p>`;
    let totalScore = parseInt(localStorage.getItem(`${subject}-score`) || 0);
    totalScore += score * 10;
    localStorage.setItem(`${subject}-score`, totalScore);
    loadProgress();
}

function startTimer(seconds, timerId, callback) {
    let time = seconds;
    const timerElem = document.getElementById(timerId);
    quizTimer = setInterval(() => {
        time--;
        timerElem.textContent = `${Math.floor(time/60)}:${time%60 < 10 ? '0' : ''}${time%60}`;
        if (time <= 0) callback();
    }, 1000);
}

// Similar logic for tests (adapt as in original)
function loadTestUnits(subject) {
    const testList = document.getElementById('test-list');
    testList.innerHTML = '';
    for (let i = 1; i <= 2; i++) {
        const btn = document.createElement('button');
        btn.textContent = `Test ${i} (Units ${i*2-1}-${i*2})`;
        btn.classList.add('btn', 'btn-primary', 'me-2', 'mb-2');
        btn.onclick = () => loadTest(subject, i);
        testList.appendChild(btn);
    }
}

let testData, testCurrent = 0, testScore = 0, testTimer;
function loadTest(subject, testNum) {
    const testContent = document.getElementById('test-content');
    testContent.innerHTML = '<p class="timer" id="test-timer">90:00</p>';
    fetch(`tests/${subject}/test${testNum}.js`)
        .then(response => response.text())
        .then(data => {
            eval(data);
            testData = testQuestions;
            testScore = 0;
            testCurrent = 0;
            showTestQuestion();
            startTimer(90 * 60, 'test-timer', () => submitTest(subject));
        });
}

function showTestQuestion() {
    const testContent = document.getElementById('test-content');
    const q = testData[testCurrent];
    let html = `<div class="question"><p>${q.question}</p>`;
    q.options.forEach((opt, idx) => {
        html += `<label class="d-block"><input type="radio" name="answer" value="${idx}">${opt}</label>`;
    });
    html += `<button class="btn btn-primary mt-2" onclick="nextTestQuestion()">Next</button></div>`;
    testContent.innerHTML += html;
}

function nextTestQuestion() {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (selected) {
        const feedbackDiv = document.createElement('div');
        if (parseInt(selected.value) === testData[testCurrent].correct) {
            testScore++;
            feedbackDiv.innerHTML = `<p class="feedback">Correct! Explanation: ${testData[testCurrent].explanation}</p>`;
        } else {
            feedbackDiv.innerHTML = `<p class="error">Wrong. Correct is ${testData[testCurrent].options[testData[testCurrent].correct]}. Explanation: ${testData[testCurrent].explanation}</p>`;
        }
        document.getElementById('test-content').appendChild(feedbackDiv);
        testCurrent++;
        if (testCurrent < testData.length) {
            showTestQuestion();
        } else {
            submitTest();
        }
    }
}

function submitTest(subject) {
    clearInterval(testTimer);
    const testContent = document.getElementById('test-content');
    testContent.innerHTML += `<p class="mt-3 fw-bold">Score: ${testScore} / ${testData.length}</p>`;
    let totalScore = parseInt(localStorage.getItem(`${subject}-score`) || 0);
    totalScore += testScore * 2;
    localStorage.setItem(`${subject}-score`, totalScore);
    loadProgress();
}

showTab('myPage');