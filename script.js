const subjects = ['PreCalculus', 'GeneralBiology1', 'GeneralChemistry1', 'GeneralPhysics1', 'EarthScience'];

function showTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
    if (tabId === 'myPage') loadProgress();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hidden');
    document.getElementById('content').style.marginLeft = sidebar.classList.contains('hidden') ? '0' : '200px';
}

function loadProgress() {
    const progressCharts = document.getElementById('progress-charts');
    progressCharts.innerHTML = '';
    let totalPoints = 0;
    subjects.forEach(subject => {
        const progress = localStorage.getItem(`${subject}-progress`) || 0;
        const div = document.createElement('div');
        div.innerHTML = `<p>${subject}: ${progress}% complete</p><div class="progress-bar"><div class="progress-fill" style="width: ${progress}%"></div></div>`;
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
    }, 60000); // per minute
}

function stopStudyTimer(subject, unit) {
    clearInterval(studyTimer);
    localStorage.setItem(`${subject}-${unit}-finish`, new Date().toLocaleString());
    loadProgress();
}

function loadUnits(subject) {
    const unitList = document.getElementById('unit-list');
    unitList.innerHTML = '';
    for (let i = 1; i <= 4; i++) {
        const btn = document.createElement('button');
        btn.textContent = `Unit ${i}`;
        btn.onclick = () => loadLesson(subject, i);
        unitList.appendChild(btn);
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
            completeBtn.onclick = () => {
                stopStudyTimer(subject, `unit${unit}`);
                let progress = parseInt(localStorage.getItem(`${subject}-progress`) || 0);
                progress += 25; // 4 units = 100%
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
            eval(data); // loads quizQuestions
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
    let html = `<p>${q.question}</p>`;
    q.options.forEach((opt, idx) => {
        html += `<label><input type="radio" name="answer" value="${idx}">${opt}</label><br>`;
    });
    html += `<button onclick="nextQuestion()">Next</button>`;
    quizContent.innerHTML += html;
}

function nextQuestion() {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (selected) {
        if (parseInt(selected.value) === quizData[currentQuestion].correct) {
            score++;
            document.getElementById('quiz-content').innerHTML += `<p class="feedback">Correct! Explanation: ${quizData[currentQuestion].explanation}</p>`;
        } else {
            document.getElementById('quiz-content').innerHTML += `<p class="error">Wrong. Correct is ${quizData[currentQuestion].options[quizData[currentQuestion].correct]}. Explanation: ${quizData[currentQuestion].explanation}</p>`;
        }
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
    quizContent.innerHTML += `<p>Score: ${score} / ${quizData.length}</p>`;
    let totalScore = parseInt(localStorage.getItem(`${subject}-score`) || 0);
    totalScore += score * 10; // points
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

// Similar for tests, with 90 min = 90*60 sec, 2 tests, loadTestUnits, loadTest, etc.

function loadTestUnits(subject) {
    const testList = document.getElementById('test-list');
    testList.innerHTML = '';
    for (let i = 1; i <= 2; i++) {
        const btn = document.createElement('button');
        btn.textContent = `Test ${i} (Units ${i*2-1}-${i*2})`;
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
            eval(data); // loads testQuestions
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
    let html = `<p>${q.question}</p>`;
    q.options.forEach((opt, idx) => {
        html += `<label><input type="radio" name="answer" value="${idx}">${opt}</label><br>`;
    });
    html += `<button onclick="nextTestQuestion()">Next</button>`;
    testContent.innerHTML += html;
}

function nextTestQuestion() {
    const selected = document.querySelector('input[name="answer"]:checked');
    if (selected) {
        if (parseInt(selected.value) === testData[testCurrent].correct) {
            testScore++;
            document.getElementById('test-content').innerHTML += `<p class="feedback">Correct! Explanation: ${testData[testCurrent].explanation}</p>`;
        } else {
            document.getElementById('test-content').innerHTML += `<p class="error">Wrong. Correct is ${testData[testCurrent].options[testData[testCurrent].correct]}. Explanation: ${testData[testCurrent].explanation}</p>`;
        }
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
    testContent.innerHTML += `<p>Score: ${testScore} / ${testData.length}</p>`;
    let totalScore = parseInt(localStorage.getItem(`${subject}-score`) || 0);
    totalScore += testScore * 2; // points
    localStorage.setItem(`${subject}-score`, totalScore);
    loadProgress();
}

showTab('myPage');