let currentTab = 'lessons';

function showTab(tab) {
  currentTab = tab;
  const main = document.getElementById('main-content');
  main.innerHTML = '';

  if (tab === 'lessons') {
    for (const key in lessons) {
      const subj = lessons[key];
      const div = document.createElement('div');
      div.innerHTML = `<h2>${subj.title}</h2>
                       <p>${subj.lesson}</p>
                       <a href="${subj.video}" target="_blank">Watch Video</a>`;
      main.appendChild(div);
    }
  }

  if (tab === 'summaries') {
    for (const key in lessons) {
      const subj = lessons[key];
      const div = document.createElement('div');
      div.innerHTML = `<h2>${subj.title}</h2>
                       <p>${subj.summary}</p>
                       <a href="${subj.video}" target="_blank">Watch Video</a>`;
      main.appendChild(div);
    }
  }

  if (tab === 'quizzes') {
    for (const key in lessons) {
      const subj = lessons[key];
      const div = document.createElement('div');
      div.innerHTML = `<h2>${subj.title} Quiz</h2>`;
      subj.quiz.forEach((q, idx) => {
        const qDiv = document.createElement('div');
        qDiv.innerHTML = `<p class="quiz-question">${q.question}</p>`;
        q.choices.forEach((choice, i) => {
          qDiv.innerHTML += `<label class="quiz-choice">
                               <input type="radio" name="${key}_${idx}" value="${i}"> ${choice}
                             </label>`;
        });
        div.appendChild(qDiv);
      });
      div.innerHTML += `<button onclick="submitQuiz('${key}')">Submit Quiz</button>
                        <div id="${key}_feedback"></div>`;
      main.appendChild(div);
    }
  }

  if (tab === 'activities') {
    main.innerHTML = '<p>Interactive activities coming soon...</p>';
  }

  if (tab === 'progress') {
    const scores = Object.keys(lessons).map(key => {
      const score = localStorage.getItem(key + "_score") || 0;
      return `<p>${lessons[key].title}: ${score} / ${lessons[key].quiz.length}</p>`;
    }).join('');
    main.innerHTML = `<h2>My Progress</h2>${scores}`;
  }
}

function submitQuiz(subject) {
  const quiz = lessons[subject].quiz;
  const userAnswers = quiz.map((q, i) => {
    const radios = document.getElementsByName(subject + '_' + i);
    for (const r of radios) if (r.checked) return parseInt(r.value);
    return -1; // Not answered
  });

  let score = 0;
  let feedbackHtml = '';
  quiz.forEach((q, i) => {
    const correct = userAnswers[i] === q.answer;
    if (correct) score++;
    feedbackHtml += `<p>${q.question} - ${correct ? 'Correct' : 'Wrong'}<br>Explanation: ${q.explanation}</p>`;
  });

  localStorage.setItem(subject + "_score", score);
  document.getElementById(subject + "_feedback").innerHTML = `<p>Score: ${score} / ${quiz.length}</p>${feedbackHtml}`;
}

// Initialize first tab
showTab('lessons');
