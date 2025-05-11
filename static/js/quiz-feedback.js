document.addEventListener('DOMContentLoaded', function () {
  const quizForm = document.getElementById('quizForm');
  const feedback = document.getElementById('feedback');
  const submitBtn = document.getElementById('submitBtn');
  const nextBtn = document.getElementById('nextBtn');

  // Find the correct answer from a hidden input or data attribute
  let correctAnswer = null;
  const correctInput = document.querySelector('input[name="correct"]');
  if (correctInput) {
    correctAnswer = correctInput.value;
  }

  // Get next_url if present
  let nextUrl = '/result';
  if (window.next_url) {
    nextUrl = window.next_url;
  } else if (typeof NEXT_URL !== 'undefined') {
    nextUrl = NEXT_URL;
  }

  if (quizForm) {
    quizForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let selected = quizForm.querySelector('input[name="answer"]:checked');
      if (!selected) return;
      let isCorrect = false;
      if (correctAnswer !== null) {
        isCorrect = (selected.value === correctAnswer);
      }
      if (isCorrect) {
        feedback.innerHTML = '✅ Correct! Great job!';
        feedback.style.color = '#28a745';
        // Optionally, update score in sessionStorage
        sessionStorage.setItem('lastQuizCorrect', 'true');
      } else {
        feedback.innerHTML = '❌ Not quite!<br>Correct answer: ' + (correctAnswer || '');
        feedback.style.color = '#dc3545';
        sessionStorage.setItem('lastQuizCorrect', 'false');
      }
      if (submitBtn) submitBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'inline-block';
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      window.location.href = nextUrl;
    });
  }
}); 