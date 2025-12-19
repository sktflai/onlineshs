function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.left = sidebar.style.left === '0px' ? '-300px' : '0px';
}

function showTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    toggleSidebar();
    if (tabId === 'my-page') updateMyPage();
}

let sessionStart = new Date();
let totalTime = parseInt(localStorage.getItem('totalStudyTime') || '0');

function updateMyPage() {
    document.getElementById('total-time').textContent = totalTime;

    const progressList = document.getElementById('subject-progress');
    progressList.innerHTML = '';
    const subjects = ['Pre-Calculus', 'General Biology 1', 'General Chemistry 1', 'General Physics 1', 'Earth Science'];
    subjects.forEach(subject => {
        const completed = localStorage.getItem(subject + '-progress') || '0';
        const li = document.createElement('li');
        li.innerHTML = `<strong>${subject}:</strong> ${completed}% complete`;
        progressList.appendChild(li);
    });
}

// Update total time every minute
setInterval(() => {
    totalTime++;
    localStorage.setItem('totalStudyTime', totalTime);
    if (document.querySelector('#my-page').classList.contains('active')) {
        document.getElementById('total-time').textContent = totalTime;
    }
}, 60000);

// Run on load
updateMyPage();