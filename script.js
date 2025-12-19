function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    const body = document.body;
    
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
    body.classList.toggle('sidebar-open');
}

// Close sidebar when tapping overlay
document.querySelector('.overlay').addEventListener('click', toggleSidebar);

function showTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    toggleSidebar(); // Auto-close after choosing tab
}

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

setInterval(() => {
    totalTime++;
    localStorage.setItem('totalStudyTime', totalTime);
    document.getElementById('total-time').textContent = totalTime;
}, 60000);

updateMyPage();