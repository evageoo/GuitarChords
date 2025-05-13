$(function () {
  const $quizForm = $('#quizForm');
  const $feedback = $('#feedback');
  const $submitBtn = $('#submitBtn');
  const $nextBtn = $('#nextBtn');
  const quizId = window.quiz_id;

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
    var extraMsg = '';
    if (quizId == 7) {
      extraMsg = '<div style="margin-top:8px; color:#444;">While we did not teach the E minor chord, it is in the same key as the C major and G major chord.</div>';
    }

    $feedback
      .html(isCorrect
        ? '✅ Correct! Great job!' + extraMsg
        : `❌ Not quite!<br>Correct answer: ${correctAnswer}` + extraMsg)
      .css('color', isCorrect ? '#28a745' : '#dc3545');

    $submitBtn.hide();
    $nextBtn.show();
  });

  $nextBtn.on('click', function () {
    $quizForm[0].submit();
  });
});
