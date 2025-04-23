$(function () {
    const $nextButton = $('#next-btn');
    if ($nextButton.length) {
        $nextButton.on('click', function () {
            const currentLesson = parseInt($(this).data('lesson-id'));
            const nextLesson = currentLesson + 1;
            window.location.href = '/learn/' + nextLesson;
        });
    }

    const $playAudioButton = $('#play-audio');
    if ($playAudioButton.length) {
        $playAudioButton.on('click', function () {
            const audio = $('#lesson-audio')[0];
            if (audio) {
                audio.play();
            }
        });
    }
});
