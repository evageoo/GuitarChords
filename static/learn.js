document.addEventListener('DOMContentLoaded', function() {
    const nextButton = document.getElementById('next-btn');
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            const currentLesson = parseInt(nextButton.dataset.lessonId);
            const nextLesson = currentLesson + 1;
            window.location.href = '/learn/' + nextLesson;
        });
    }

    const playAudioButton = document.getElementById('play-audio');
    if (playAudioButton) {
        playAudioButton.addEventListener('click', function() {
            const audio = document.getElementById('lesson-audio');
            if (audio) {
                audio.play();
            }
        });
    }
});
