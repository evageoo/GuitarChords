// document.addEventListener('DOMContentLoaded', function () {
//   const quizForm = document.getElementById('quizForm');
//   const feedback = document.getElementById('feedback');
//   const submitBtn = document.getElementById('submitBtn');
//   const nextBtn = document.getElementById('nextBtn');

//   if (!quizForm) return;

//   const questionType = quizForm.elements['question_type']?.value || null;

//   if (questionType === 'string_input') {
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

//       feedback.innerHTML = correctCount === 2
//         ? '✅ Correct! Great job!<br>' + feedbackMsg
//         : '❌ Not quite!<br>' + feedbackMsg;

//       feedback.style.color = correctCount === 2 ? '#28a745' : '#dc3545';

//       if (submitBtn) submitBtn.style.display = 'none';
//       if (nextBtn) nextBtn.style.display = 'inline-block';
//     });

//     if (nextBtn) {
//       nextBtn.addEventListener('click', function () {
//         quizForm.submit();  // Submit to server to count score
//       });
//     }

//     return;
//   }

//   // For multiple choice and drag/drop
//   let correctAnswer = null;
//   const correctInput = document.querySelector('input[name="correct"]');
//   if (correctInput) {
//     correctAnswer = correctInput.value;
//   }

//   let nextUrl = window.next_url || (typeof NEXT_URL !== 'undefined' ? NEXT_URL : '/result');

//   quizForm.addEventListener('submit', function (e) {
//     e.preventDefault();

//     let selected = quizForm.querySelector('input[name="answer"]:checked');
//     if (!selected) return;

//     const isCorrect = (selected.value === correctAnswer);

//     feedback.innerHTML = isCorrect
//       ? '✅ Correct! Great job!'
//       : `❌ Not quite!<br>Correct answer: ${correctAnswer || ''}`;
//     feedback.style.color = isCorrect ? '#28a745' : '#dc3545';

//     if (submitBtn) submitBtn.style.display = 'none';
//     if (nextBtn) nextBtn.style.display = 'inline-block';
//   });

//   if (nextBtn) {
//     nextBtn.addEventListener('click', function () {
//       quizForm.submit(); // Submit to server to count score
//     });
//   }
// });


$(function () {
  const $quizForm = $('#quizForm');
  const $feedback = $('#feedback');
  const $submitBtn = $('#submitBtn');
  const $nextBtn = $('#nextBtn');

  if (!$quizForm.length) return;

  const questionType = $quizForm.find('[name="question_type"]').val();

  if (questionType === 'string_input') {
    $quizForm.on('submit', function (e) {
      e.preventDefault();

      const correct0 = $quizForm.find('[name="correct_0"]').val().trim().toUpperCase();
      const correct1 = $quizForm.find('[name="correct_1"]').val().trim().toUpperCase();
      const answer0 = $quizForm.find('[name="string_0"]').val().trim().toUpperCase();
      const answer1 = $quizForm.find('[name="string_1"]').val().trim().toUpperCase();

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

      $feedback
        .html((correctCount === 2 ? '✅ Correct! Great job!<br>' : '❌ Not quite!<br>') + feedbackMsg)
        .css('color', correctCount === 2 ? '#28a745' : '#dc3545');

      $submitBtn.hide();
      $nextBtn.show();
    });

    $nextBtn.on('click', function () {
      $quizForm[0].submit(); // submit to server for scoring
    });

    return;
  }

  // multiple choice or drag-drop
  const correctAnswer = $quizForm.find('[name="correct"]').val();

  $quizForm.on('submit', function (e) {
    e.preventDefault();

    const selected = $quizForm.find('input[name="answer"]:checked').val();
    if (!selected) return;

    const isCorrect = selected === correctAnswer;

    $feedback
      .html(isCorrect
        ? '✅ Correct! Great job!'
        : `❌ Not quite!<br>Correct answer: ${correctAnswer}`)
      .css('color', isCorrect ? '#28a745' : '#dc3545');

    $submitBtn.hide();
    $nextBtn.show();
  });

  $nextBtn.on('click', function () {
    $quizForm[0].submit();
  });
});
