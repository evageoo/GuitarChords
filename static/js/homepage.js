$(function () {
    const $startButton = $('#start-btn');
    if ($startButton.length) {
        $startButton.on('click', function () {
            window.location.href = '/learn/1'; // Start learning at lesson 1
        });
    }
});
