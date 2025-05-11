document.addEventListener('DOMContentLoaded', function () {
    const fretDiagram = document.getElementById('fretDiagram');
    const fingerCircles = document.getElementById('fingerCircles');
    const fingerPositions = document.getElementById('fingerPositions');
    const quizForm = document.getElementById('quizForm');

    if (!fretDiagram || !fingerCircles) return;

    function createFretDiagram() {
        const strings = 6;
        const frets = 5;
        const width = fretDiagram.offsetWidth;
        const height = fretDiagram.offsetHeight;
        const stringSpacing = width / (strings - 1);
        const fretSpacing = height / frets;

        // Draw frets (horizontal lines)
        for (let i = 0; i <= frets; i++) {
            const fret = document.createElement('div');
            fret.className = 'fret';
            fret.style.position = 'absolute';
            fret.style.left = '0px';
            fret.style.width = '100%';
            fret.style.height = i === 0 ? '4px' : '2px'; // Nut is bold
            fret.style.backgroundColor = '#2c3e50';
            fret.style.top = `${i * fretSpacing}px`;
            fretDiagram.appendChild(fret);
        }

        // Draw strings (vertical lines)
        for (let i = 0; i < strings; i++) {
            const string = document.createElement('div');
            string.className = 'string';
            string.style.position = 'absolute';
            string.style.top = '0px';
            string.style.height = '100%';
            string.style.width = '2px';
            string.style.backgroundColor = '#2c3e50';
            string.style.left = `${i * stringSpacing}px`;
            fretDiagram.appendChild(string);
        }
    }

    function createFingerCircles() {
        const fingers = ['1', '2', '3'];
        fingers.forEach(finger => {
            const circle = document.createElement('div');
            circle.className = 'finger-circle';
            circle.draggable = true;
            circle.dataset.finger = finger;
            // No visible text
            circle.addEventListener('dragstart', handleDragStart);
            circle.addEventListener('dragend', handleDragEnd);
            fingerCircles.appendChild(circle);
        });
    }

    function handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.finger);
        e.dataTransfer.effectAllowed = 'copy';
        e.target.classList.add('dragging');
    }

    function handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function handleDrop(e) {
        e.preventDefault();
        const finger = e.dataTransfer.getData('text/plain');
        const rect = fretDiagram.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const circle = document.createElement('div');
        circle.className = 'finger-circle';
        circle.dataset.finger = finger;
        circle.style.left = `${x - 15}px`;
        circle.style.top = `${y - 15}px`;
        circle.style.position = 'absolute';
        circle.draggable = false;

        fretDiagram.appendChild(circle);
        updateFingerPositions();
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }

    function updateFingerPositions() {
        const positions = [];
        const circles = fretDiagram.querySelectorAll('.finger-circle');
        circles.forEach(circle => {
            positions.push({
                "finger": circle.dataset.finger,
                "x": parseInt(circle.style.left),
                "y": parseInt(circle.style.top)
            });
        });
        fingerPositions.value = JSON.stringify(positions);
    }

    if (quizForm) {
        quizForm.addEventListener('submit', function (e) {
            updateFingerPositions();
            checkAnswerAndFeedback();
            const feedback = document.getElementById('feedback');
            if (!feedback.innerHTML.includes('✅')) {
                e.preventDefault();
            }
        });
    }

    createFretDiagram();
    createFingerCircles();
    fretDiagram.addEventListener('dragover', handleDragOver);
    fretDiagram.addEventListener('drop', handleDrop);
});

function checkAnswerAndFeedback() {
    // Correct positions: 3rd, 4th, 5th string from the left (index 1,2,3), in the 2nd fret (between 1st and 2nd fret lines)
    const validStrings = [1, 2, 3]; // 3rd, 4th, 5th from the left (A, D, G strings)
    const validFret = 1; // 2nd fret (between 1st and 2nd fret lines)
    const fretDiagram = document.getElementById('fretDiagram');
    const width = fretDiagram.offsetWidth;
    const height = fretDiagram.offsetHeight;
    const stringSpacing = width / (6 - 1);
    const fretSpacing = height / 5;
    const circles = fretDiagram.querySelectorAll('.finger-circle');
    let correctCount = 0;
    let feedbackMsg = '';
    let foundStrings = [];

    circles.forEach(circle => {
        // Remove previous feedback
        circle.style.border = '';
        circle.style.backgroundColor = '#3498db';

        const x = parseInt(circle.style.left);
        const y = parseInt(circle.style.top);
        const string = Math.round(x / stringSpacing); // 0 = far left (low E), 5 = far right (high E)
        const fret = Math.floor(y / fretSpacing); // 0 = nut, 1 = 2nd fret, etc.

        if (validStrings.includes(string) && fret === validFret && !foundStrings.includes(string)) {
            circle.style.border = '3px solid #28a745'; // green border for correct
            correctCount++;
            foundStrings.push(string);
        } else {
            circle.style.border = '3px solid #dc3545'; // red border for incorrect
            circle.style.backgroundColor = '#dc3545';
            feedbackMsg += `• Incorrect placement on string ${string + 1}, fret ${fret + 1}<br>`;
        }
    });

    const feedback = document.getElementById('feedback');
    if (feedback) {
        if (correctCount === 3 && circles.length === 3) {
            feedback.innerHTML = '✅ Correct! Great job!';
            feedback.style.color = '#28a745';
        } else {
            feedback.innerHTML = '❌ Not quite!<br>' + feedbackMsg;
            feedback.style.color = '#dc3545';
        }
    }
}
