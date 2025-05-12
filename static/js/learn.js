// $(function () {
//     const $nextButton = $('#next-btn');
//     if ($nextButton.length) {
//         $nextButton.on('click', function () {
//             const currentLesson = parseInt($(this).data('lesson-id'));
//             const nextLesson = currentLesson + 1;
//             window.location.href = '/learn/' + nextLesson;
//         });
//     }

//     const $playAudioButton = $('#play-audio');
//     if ($playAudioButton.length) {
//         $playAudioButton.on('click', function () {
//             const audio = $('#lesson-audio')[0];
//             if (audio) {
//                 audio.play();
//             }
//         });
//     }
// });

$(function () {
    $('#next-btn').on('click', function () {
      const nextLesson = parseInt($(this).data('lesson-id')) + 1;
      window.location.href = '/learn/' + nextLesson;
    });
  
    $('#play-audio').on('click', function () {
      const audio = $('#lesson-audio')[0];
      if (audio) audio.play();
    });
  });

  $(function () {
    $('#quiz-form').on('submit', function (e) {
      e.preventDefault();
      this.submit();
    });
  
    $('#play-quiz-audio').on('click', function () {
      $('#quiz-audio')[0].play();
    });
  });
  