const subjects = ['PreCalculus', 'GeneralBiology1', 'GeneralChemistry1', 'GeneralPhysics1', 'EarthScience'];

const sidebar = document.getElementById('sidebar');
const toggleBtn = document.getElementById('sidebarToggle');
const mainContent = document.querySelector('.main-content');

function isMobile() {
    return window.innerWidth <= 992;
}

function setInitialSidebarState() {
    sidebar.classList.remove('show');
    mainContent.style.marginLeft = '0';
}

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('show');
    if (!isMobile()) {
        mainContent.style.marginLeft = sidebar.classList.contains('show') ? '200px' : '0';
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

function loadProgress() {
    const progressCharts = document.getElementById('progress-charts');
    progressCharts.innerHTML = '';
    let totalPoints = 0;
    subjects.forEach(subject => {
        const progress = parseInt(localStorage.getItem(`${subject}-progress`) || 0);
        const div = document.createElement('div');
        div.classList.add('col-md-6', 'mb-3');
        div.innerHTML = `
            <p class="fw-bold">${subject.replace(/([A-Z])/g, ' $1').trim()}: ${progress}% complete</p>
            <div class="progress" style="height: 30px;">
                <div class="progress-bar bg-success" style="width: ${progress}%;">${progress}%</div>
            </div>
        `;
        progressCharts.appendChild(div);
        totalPoints += parseInt(localStorage.getItem(`${subject}-score`) || 0);
    });
    document.getElementById('points').textContent = `Points: ${totalPoints} / 1000 (Aim for 800 to pass)`;
    const studyTime = parseInt(localStorage.getItem('studyTime') || 0);
    document.getElementById('study-time').textContent = `Study Time: ${studyTime} minutes`;
    
    const lessonTimes = document.getElementById('lesson-times');
    lessonTimes.innerHTML = '<h5 class="mt-4">Lesson History</h5>';
    let hasHistory = false;
    subjects.forEach(subject => {
        for (let u = 1; u <= 4; u++) {
            const start = localStorage.getItem(`${subject}-unit${u}-start`);
            const finish = localStorage.getItem(`${subject}-unit${u}-finish`);
            if (start) {
                hasHistory = true;
                lessonTimes.innerHTML += `
                    <p><strong>${subject.replace(/([A-Z])/g, ' $1').trim()} Unit ${u}:</strong><br>
                    Started: ${start}<br>
                    Finished: ${finish || 'In progress'}</p>
                `;
            }
        }
    });
    if (!hasHistory) {
        lessonTimes.innerHTML += '<p>No lesson history yet. Start learning!</p>';
    }
}

let studyTimer;
function startStudyTimer(subject, unit) {
    localStorage.setItem(`${subject}-${unit}-start`, new Date().toLocaleString());
    studyTimer = setInterval(() => {
        let time = parseInt(localStorage.getItem('studyTime') || 0);
        time++;
        localStorage.setItem('studyTime', time);
        document.getElementById('study-time').textContent = `Study Time: ${time} minutes`;
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
    
    fetch(`lessons/${subject}/index.html`)
        .then(response => {
            if (response.ok) return response.text();
            throw new Error();
        })
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
                btn.classList.add('btn', 'btn-success', 'me-2', 'mb-2');
                btn.onclick = () => loadLesson(subject, i);
                unitList.appendChild(btn);
            }
            lessonContent.innerHTML = '<p class="text-center mt-4">Select a unit above to start learning.</p>';
        });
}

function loadLesson(subject, unit) {
    const lessonContent = document.getElementById('lesson-content');
    
    let fileName = '';
    if (unit === 1) fileName = 'unit1-conic.html';
    else if (unit === 2) fileName = 'unit2-parabola.html';
    else if (unit === 3) fileName = 'unit3-hyperbola.html';
    else if (unit === 4) fileName = 'unit4-review.html';
    
    fetch(`lessons/${subject}/${fileName}`)
        .then(response => {
            if (!response.ok) throw new Error();
            return response.text();
        })
        .then(data => {
            lessonContent.innerHTML = data;
            startStudyTimer(subject, `unit${unit}`);
            const completeBtn = document.createElement('button');
            completeBtn.textContent = 'Mark as Complete';
            completeBtn.classList.add('btn', 'btn-success', 'mt-4', 'fs-5');
            completeBtn.onclick = () => {
                stopStudyTimer(subject, `unit${unit}`);
                let progress = parseInt(localStorage.getItem(`${subject}-progress`) || 0);
                progress += 25;
                if (progress > 100) progress = 100;
                localStorage.setItem(`${subject}-progress`, progress);
                alert(`Unit ${unit} marked complete! Progress: ${progress}%`);
                loadProgress();
            };
            lessonContent.appendChild(completeBtn);
        })
        .catch(() => {
            lessonContent.innerHTML = '<p class="text-danger">Lesson not found. Check file name or path.</p>';
        });
}

// Quiz/Test functions (keep from previous version - omitted here for brevity but include them fully when pasting)

showTab('myPage');