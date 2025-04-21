document.addEventListener('DOMContentLoaded', function() {
    const quizForm = document.getElementById('quiz-form');
    if (quizForm) {
        quizForm.addEventListener('submit', function(event) {
            event.preventDefault();
            quizForm.submit();
        });
    }

    const playQuizAudioButton = document.getElementById('play-quiz-audio');
    if (playQuizAudioButton) {
        playQuizAudioButton.addEventListener('click', function() {
            const audio = document.getElementById('quiz-audio');
            if (audio) {
                audio.play();
            }
        });
    }
});
