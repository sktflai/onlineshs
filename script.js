// script.js - Updated: Fixed Sidebar Stuck on Mobile + Better Mobile Support
const subjects = ['PreCalculus', 'GeneralBiology1', 'GeneralChemistry1', 'GeneralPhysics1', 'EarthScience'];

const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebarToggle');
const mainContent = document.querySelector('.main-content');

function isMobile() {
    return window.innerWidth <= 992;
}

function setInitialSidebarState() {
    sidebar.classList.remove('show');
    document.body.classList.remove('sidebar-open');
    mainContent.style.marginLeft = '0';
}

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('show');
    document.body.classList.toggle('sidebar-open'); // Prevents background scroll on mobile
    if (!isMobile()) {
        mainContent.style.marginLeft = sidebar.classList.contains('show') ? '250px' : '0';
    } else {
        mainContent.style.marginLeft = '0'; // Always overlay on mobile
    }
});

window.addEventListener('resize', setInitialSidebarState);
setInitialSidebarState();

function showTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');
    document.getElementById(tabId).style.display = 'block';
    if (isMobile()) {
        sidebar.classList.remove('show');
        document.body.classList.remove('sidebar-open');
    }
    if (tabId === 'myPage') loadProgress();
}

function loadProgress() {
    const progressCharts = document.getElementById('progress-charts');
    progressCharts.innerHTML = '';
    let totalPoints = 0;
    subjects.forEach(subject => {
        const progress = parseInt(localStorage.getItem(`${subject}-progress`) || 0);
        const div = document.createElement('div');
        div.classList.add('col-md-6', 'mb-4');
        div.innerHTML = `
            <p class="fw-bold fs-5">${subject.replace(/([A-Z])/g, ' $1').trim()}: ${progress}% complete</p>
            <div class="progress" style="height: 35px;">
                <div class="progress-bar bg-success" style="width: ${progress}%; font-size: 1.2rem;">${progress}%</div>
            </div>
        `;
        progressCharts.appendChild(div);
        totalPoints += parseInt(localStorage.getItem(`${subject}-score`) || 0);
    });
    document.getElementById('points').textContent = `Points: ${totalPoints} / 1000 (Aim for 800 to pass)`;
    const studyTime = parseInt(localStorage.getItem('studyTime') || 0);
    document.getElementById('study-time').textContent = `Study Time: ${studyTime} minutes`;
    
    const lessonTimes = document.getElementById('lesson-times');
    lessonTimes.innerHTML = '<h4 class="mt-5">Lesson History</h4>';
    let hasHistory = false;
    subjects.forEach(subject => {
        for (let u = 1; u <= 4; u++) {
            const start = localStorage.getItem(`${subject}-unit${u}-start`);
            const finish = localStorage.getItem(`${subject}-unit${u}-finish`);
            if (start) {
                hasHistory = true;
                lessonTimes.innerHTML += `<p class="border-bottom pb-2"><strong>${subject.replace(/([A-Z])/g, ' $1').trim()} Unit ${u}</strong><br>Started: ${start}<br>Finished: ${finish || 'In progress'}</p>`;
            }
        }
    });
    if (!hasHistory) lessonTimes.innerHTML += '<p>No history yet — start a lesson!</p>';
}

let studyTimer;
function startStudyTimer(subject, unit) {
    localStorage.setItem(`${subject}-${unit}-start`, new Date().toLocaleString());
    studyTimer = setInterval(() => {
        let time = parseInt(localStorage.getItem('studyTime') || 0);
        time++;
        localStorage.setItem('studyTime', time);
        if (document.getElementById('study-time')) {
            document.getElementById('study-time').textContent = `Study Time: ${time} minutes`;
        }
    }, 60000);
}

function stopStudyTimer(subject, unit) {
    clearInterval(studyTimer);
    localStorage.setItem(`${subject}-${unit}-finish`, new Date().toLocaleString());
    loadProgress();
}

function loadUnits(subject) {
    if (!subject) return;
    const lessonContent = document.getElementById('lesson-content');
    const unitList = document.getElementById('unit-list');
    
    const folder = (subject === 'PreCalculus') ? 'precalc' : subject;
    
    fetch(`lessons/${folder}/index.html`)
        .then(response => response.ok ? response.text() : throwError())
        .then(data => {
            lessonContent.innerHTML = data;
            unitList.innerHTML = '';
        })
        .catch(() => {
            unitList.innerHTML = '';
            const unitNames = [
                'Unit 1: Introduction & Circle',
                'Unit 2: Parabola & Ellipse',
                'Unit 3: Hyperbola',
                'Unit 4: Review & Applications'
            ];
            for (let i = 1; i <= 4; i++) {
                const btn = document.createElement('button');
                btn.textContent = unitNames[i-1];
                btn.classList.add('btn', 'btn-success', 'me-3', 'mb-3', 'px-4', 'py-3', 'fs-5');
                btn.onclick = () => loadLesson(subject, i);
                unitList.appendChild(btn);
            }
            lessonContent.innerHTML = '<p class="text-center fs-4 mt-5">Select a unit above to begin.</p>';
        });
}

function loadLesson(subject, unit) {
    const lessonContent = document.getElementById('lesson-content');
    
    const folder = (subject === 'PreCalculus') ? 'precalc' : subject;
    
    let fileName = '';
    if (unit === 1) fileName = 'unit1-conic.html';
    else if (unit === 2) fileName = 'unit2-parabola.html';
    else if (unit === 3) fileName = 'unit3-hyperbola.html';
    else if (unit === 4) fileName = 'unit4-review.html';
    
    fetch(`lessons/${folder}/${fileName}`)
        .then(response => response.ok ? response.text() : throwError())
        .then(data => {
            lessonContent.innerHTML = data;
            startStudyTimer(subject, `unit${unit}`);
            const completeBtn = document.createElement('button');
            completeBtn.textContent = 'Mark as Complete';
            completeBtn.classList.add('btn', 'btn-success', 'mt-5', 'fs-4', 'px-5', 'py-3');
            completeBtn.onclick = () => {
                stopStudyTimer(subject, `unit${unit}`);
                let progress = parseInt(localStorage.getItem(`${subject}-progress`) || 0);
                progress += 25;
                if (progress > 100) progress = 100;
                localStorage.setItem(`${subject}-progress`, progress);
                alert(`Unit ${unit} completed! Subject progress: ${progress}%`);
                loadProgress();
            };
            lessonContent.appendChild(completeBtn);
        })
        .catch(() => {
            lessonContent.innerHTML = '<p class="text-danger fs-4">Lesson file not found.</p>';
        });
}

function throwError() { throw new Error(); }

// Quiz and Test functions (add your previous ones here if needed)

showTab('myPage');