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
    document.body.classList.toggle('sidebar-open');
    if (!isMobile()) {
        mainContent.style.marginLeft = sidebar.classList.contains('show') ? '250px' : '0';
    } else {
        mainContent.style.marginLeft = '0';
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
            <p class="fw-bold fs-5 text-center">${subject.replace(/([A-Z])/g, ' $1').trim()}: ${progress}% complete</p>
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
    lessonTimes.innerHTML = '<h4 class="mt-5 text-center">Lesson History</h4>';
    let hasHistory = false;
    subjects.forEach(subject => {
        for (let u = 1; u <= 4; u++) {
            const start = localStorage.getItem(`${subject}-unit${u