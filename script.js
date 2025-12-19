// Main subjects object - add more later as you build them
const subjects = {
    precalc: { name: "Pre-Calculus", folder: "precalc", units: 4 },
    biology: { name: "General Biology 1", folder: "biology", units: 0 },
    chemistry: { name: "General Chemistry 1", folder: "chemistry", units: 0 },
    physics: { name: "General Physics 1", folder: "physics", units: 0 },
    earthscience: { name: "Earth Science", folder: "earthscience", units: 0 }
};

// Progress storage
let progress = JSON.parse(localStorage.getItem('progress')) || {
    points: 0,
    studyTime: 0,
    studyStart: null,
    history: [],
    completed: {}  // e.g., completed.precalc = {unit1: true, unit2: true}
};

let charts = {};
let studyInterval;

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('progress', JSON.stringify(progress));
}

// Update My Page with charts, points, time, history
function updateMyPage() {
    document.getElementById('totalPoints').textContent = progress.points;
    document.getElementById('studyTime').textContent = progress.studyTime;

    // Lesson History (last 10)
    const historyList = document.getElementById('lessonHistory');
    historyList.innerHTML = '';
    progress.history.slice(-10).reverse().forEach(entry => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = entry;
        historyList.appendChild(li);
    });

    // Progress Charts
    const container = document.getElementById('progressCharts');
    container.innerHTML = '';
    Object.keys(subjects).forEach(key => {
        const sub = subjects[key];
        const completedCount = progress.completed[key] ? Object.keys(progress.completed[key]).length : 0;
        const percent = sub.units > 0 ? Math.round((completedCount / sub.units) * 100) : 0;

        const div = document.createElement('div');
        div.className = 'mb-4';
        div.innerHTML = `<h5>${sub.name}: ${percent}% complete</h5>
                         <canvas id="chart-${key}"></canvas>`;
        container.appendChild(div);

        const ctx = document.getElementById(`chart-${key}`).getContext('2d');
        if (charts[key]) charts[key].destroy();

        charts[key] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Remaining'],
                datasets: [{
                    data: [completedCount, sub.units - completedCount],
                    backgroundColor: ['#28a745', '#e9ecef']
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    });
}

// Study timer - accumulates minutes
function startStudyTimer() {
    if (progress.studyStart) return; // already running
    progress.studyStart = Date.now();

    studyInterval = setInterval(() => {
        const additionalMinutes = Math.floor((Date.now() - progress.studyStart) / 60000);
        if (additionalMinutes > 0) {
            progress.studyTime += additionalMinutes;
            progress.studyStart = Date.now(); // reset to avoid overlap
            saveProgress();
            document.getElementById('studyTime').textContent = progress.studyTime;
        }
    }, 10000); // check every 10 seconds
}

// Record lesson open
function recordLessonOpen(subjectName, unitName) {
    const entry = `${new Date().toLocaleString()} - Opened ${subjectName}: ${unitName}`;
    progress.history.push(entry);

    if (!progress.completed.precalc) progress.completed.precalc = {};
    progress.completed.precalc[unitName] = true;

    progress.points += 15; // points for opening a lesson unit
    saveProgress();
    updateMyPage();
}

// Sidebar navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        document.querySelectorAll('.tab-content').forEach(t => t.classList.add('d-none'));
        const tab = link.dataset.tab;
        document.getElementById(tab).classList.remove('d-none');

        if (tab === 'mypage') updateMyPage();
        if (tab === 'lessons') loadSubjectSelector('lessons');
        if (tab === 'quiz') loadSubjectSelector('quiz');
        if (tab === 'tests') loadSubjectSelector('tests');
    });
});

// Toggle sidebar (mobile)
document.getElementById('toggleSidebar').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('collapsed');
    document.getElementById('mainContent').classList.toggle('expanded');
});

// Load subject buttons for Lessons / Quiz / Tests
function loadSubjectSelector(tab) {
    const area = document.getElementById(tab);
    area.innerHTML = `<h3 class="mt-4">Select Subject</h3><div class="row mt-4"></div>`;

    const row = area.querySelector('.row');
    Object.keys(subjects).forEach(key => {
        const sub = subjects[key];
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4 mb-4';

        const btn = document.createElement('button');
        btn.className = 'btn btn-primary w-100 py-4 shadow-sm';
        btn.style.fontSize = '1.2rem';
        btn.textContent = sub.name;
        btn.onclick = () => {
            if (tab === 'lessons') loadLessonsContent(key);
            if (tab === 'quiz') loadQuizContent(key);
            if (tab === 'tests') loadTestsContent(key);
        };

        col.appendChild(btn);
        row.appendChild(col);
    });
}

// Load Lessons - special handling for Pre-Calculus
function loadLessonsContent(subject) {
    const area = document.getElementById('lessons');
    if (subject === 'precalc') {
        area.innerHTML = `
            <iframe src="lessons/precalc/index.html" 
                    width="100%" 
                    height="900px" 
                    frameborder="0" 
                    style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"
                    onload="startStudyTimer()">
            </iframe>`;
    } else {
        area.innerHTML = `<h3 class="text-center mt-5">${subjects[subject].name}<br><small>Lessons coming soon!</small></h3>`;
    }
}

// Placeholder for Quizzes and Tests (we'll expand when you add .js files)
function loadQuizContent(subject) {
    const area = document.getElementById('quiz');
    if (subject === 'precalc') {
        area.innerHTML = `
            <h3>Pre-Calculus Quizzes</h3>
            <p class="lead text-center mt-4">Quiz system loading soon — your 4 unit quizzes will appear here automatically!</p>
        `;
    } else {
        area.innerHTML = `<h3>${subjects[subject].name} Quizzes<br><small>Coming soon</small></h3>`;
    }
    startStudyTimer();
}

function loadTestsContent(subject) {
    const area = document.getElementById('tests');
    area.innerHTML = `<h3>${subjects[subject].name} Tests<br><small>Coming soon</small></h3>`;
    startStudyTimer();
}

// Initialize on page load
window.onload = () => {
    updateMyPage();
    startStudyTimer();
    // Auto-open My Page on start
    document.querySelector('.nav-link[data-tab="mypage"]').click();
// Your existing code here (progress, charts, load functions, etc.) - keep it all

// === FIXED SIDEBAR TOGGLE (add this at the very end) ===
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebarOverlay');
const toggleBtn = document.getElementById('toggleSidebar');

function toggleSidebar() {
    sidebar.classList.toggle('show');
    overlay.classList.toggle('show');
}

toggleBtn.addEventListener('click', toggleSidebar);
overlay.addEventListener('click', toggleSidebar);

// Close on link click (mobile only)
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 768) {
            sidebar.classList.remove('show');
            overlay.classList.remove('show');
        }

});


};