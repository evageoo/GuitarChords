$(function () {
    $('#quiz-form').on('submit', function (event) {
        event.preventDefault();
        this.submit();
    });

    $('#play-quiz-audio').on('click', function () {
        $('#quiz-audio')[0].play();
    });
});
