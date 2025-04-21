document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('start-btn');
    if (startButton) {
        startButton.addEventListener('click', function() {
            window.location.href = '/learn/1';  // Start learning at lesson 1
        });
    }
});
