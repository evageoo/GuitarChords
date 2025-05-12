// document.addEventListener('DOMContentLoaded', function () {
//   const quizForm = document.getElementById('quizForm');
//   const feedback = document.getElementById('feedback');
//   const submitBtn = document.getElementById('submitBtn');
//   const nextBtn = document.getElementById('nextBtn');

//   if (quizForm && quizForm.elements['question_type'] && quizForm.elements['question_type'].value === 'string_input') {
//     quizForm.addEventListener('submit', function (e) {
//       e.preventDefault();
//       let correct0 = quizForm.elements['correct_0'].value.trim().toUpperCase();
//       let correct1 = quizForm.elements['correct_1'].value.trim().toUpperCase();
//       let answer0 = quizForm.elements['string_0'].value.trim().toUpperCase();
//       let answer1 = quizForm.elements['string_1'].value.trim().toUpperCase();
//       let correctCount = 0;
//       let feedbackMsg = '';
//       if (answer0 === correct0) {
//         feedbackMsg += '<span style="color:#28a745;">String 1: Correct!</span><br>';
//         correctCount++;
//       } else {
//         feedbackMsg += `<span style="color:#dc3545;">String 1: Incorrect. Correct answer: ${correct0}</span><br>`;
//       }
//       if (answer1 === correct1) {
//         feedbackMsg += '<span style="color:#28a745;">String 2: Correct!</span><br>';
//         correctCount++;
//       } else {
//         feedbackMsg += `<span style="color:#dc3545;">String 2: Incorrect. Correct answer: ${correct1}</span><br>`;
//       }
//       if (correctCount === 2) {
//         feedback.innerHTML = '✅ Correct! Great job!<br>' + feedbackMsg;
//         feedback.style.color = '#28a745';
//       } else {
//         feedback.innerHTML = '❌ Not quite!<br>' + feedbackMsg;
//         feedback.style.color = '#dc3545';
//       }
//       if (submitBtn) submitBtn.style.display = 'none';
//       if (nextBtn) nextBtn.style.display = 'inline-block';
//     });
//     if (nextBtn) {
//       nextBtn.addEventListener('click', function() {
//         window.location.href = window.next_url;
//       });
//     }
//     return; // Don't run the rest of the script for this type
//   }

//   // Find the correct answer from a hidden input or data attribute
//   let correctAnswer = null;
//   const correctInput = document.querySelector('input[name="correct"]');
//   if (correctInput) {
//     correctAnswer = correctInput.value;
//   }

//   // Get next_url if present
//   let nextUrl = '/result';
//   if (window.next_url) {
//     nextUrl = window.next_url;
//   } else if (typeof NEXT_URL !== 'undefined') {
//     nextUrl = NEXT_URL;
//   }

//   if (quizForm) {
//     quizForm.addEventListener('submit', function (e) {
//       e.preventDefault();
//       let selected = quizForm.querySelector('input[name="answer"]:checked');
//       if (!selected) return;
//       let isCorrect = false;
//       if (correctAnswer !== null) {
//         isCorrect = (selected.value === correctAnswer);
//       }
//       if (isCorrect) {
//         feedback.innerHTML = '✅ Correct! Great job!';
//         feedback.style.color = '#28a745';
//         // Optionally, update score in sessionStorage
//         sessionStorage.setItem('lastQuizCorrect', 'true');
//       } else {
//         feedback.innerHTML = '❌ Not quite!<br>Correct answer: ' + (correctAnswer || '');
//         feedback.style.color = '#dc3545';
//         sessionStorage.setItem('lastQuizCorrect', 'false');
//       }
//       if (submitBtn) submitBtn.style.display = 'none';
//       if (nextBtn) nextBtn.style.display = 'inline-block';
//     });
//   }
//   if (nextBtn) {
//     nextBtn.addEventListener('click', function() {
//       window.location.href = nextUrl;
//     });
//   }
// }); 

document.addEventListener('DOMContentLoaded', function () {
  const quizForm = document.getElementById('quizForm');
  const feedback = document.getElementById('feedback');
  const submitBtn = document.getElementById('submitBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (!quizForm) return;

  const questionType = quizForm.elements['question_type']?.value || null;

  if (questionType === 'string_input') {
    quizForm.addEventListener('submit', function (e) {
      e.preventDefault();
      let correct0 = quizForm.elements['correct_0'].value.trim().toUpperCase();
      let correct1 = quizForm.elements['correct_1'].value.trim().toUpperCase();
      let answer0 = quizForm.elements['string_0'].value.trim().toUpperCase();
      let answer1 = quizForm.elements['string_1'].value.trim().toUpperCase();
      let correctCount = 0;
      let feedbackMsg = '';

      if (answer0 === correct0) {
        feedbackMsg += '<span style="color:#28a745;">String 1: Correct!</span><br>';
        correctCount++;
      } else {
        feedbackMsg += `<span style="color:#dc3545;">String 1: Incorrect. Correct answer: ${correct0}</span><br>`;
      }
      if (answer1 === correct1) {
        feedbackMsg += '<span style="color:#28a745;">String 2: Correct!</span><br>';
        correctCount++;
      } else {
        feedbackMsg += `<span style="color:#dc3545;">String 2: Incorrect. Correct answer: ${correct1}</span><br>`;
      }

      feedback.innerHTML = correctCount === 2
        ? '✅ Correct! Great job!<br>' + feedbackMsg
        : '❌ Not quite!<br>' + feedbackMsg;

      feedback.style.color = correctCount === 2 ? '#28a745' : '#dc3545';

      if (submitBtn) submitBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'inline-block';
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        quizForm.submit();  // Submit to server to count score
      });
    }

    return;
  }

  // For multiple choice and drag/drop
  let correctAnswer = null;
  const correctInput = document.querySelector('input[name="correct"]');
  if (correctInput) {
    correctAnswer = correctInput.value;
  }

  let nextUrl = window.next_url || (typeof NEXT_URL !== 'undefined' ? NEXT_URL : '/result');

  quizForm.addEventListener('submit', function (e) {
    e.preventDefault();

    let selected = quizForm.querySelector('input[name="answer"]:checked');
    if (!selected) return;

    const isCorrect = (selected.value === correctAnswer);

    feedback.innerHTML = isCorrect
      ? '✅ Correct! Great job!'
      : `❌ Not quite!<br>Correct answer: ${correctAnswer || ''}`;
    feedback.style.color = isCorrect ? '#28a745' : '#dc3545';

    if (submitBtn) submitBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'inline-block';
  });

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      quizForm.submit(); // Submit to server to count score
    });
  }
});

