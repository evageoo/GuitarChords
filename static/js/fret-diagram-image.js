document.addEventListener('DOMContentLoaded', function () {
    const overlay = document.getElementById('fingerCirclesOverlay');
    const quizForm = document.getElementById('quizForm');
    const fingerPositions = document.getElementById('fingerPositions');
    const feedback = document.getElementById('feedback');
    const fingers = ['1', '2', '3'];
    const startContainer = document.getElementById('fingerCirclesStart');
    const submitBtn = document.getElementById('submitBtn');
    const nextBtn = document.getElementById('nextBtn');
  
    // Updated x-coords for 4th, 3rd, 2nd strings (A Major: D, G, B)
    const stringXs = [128, 192, 256]; // D, G, B (from left to right)
    // y-coords for the region between the 2nd and 3rd fret
    const fretY1 = 100; // top of 2nd fret
    const fretY2 = 160; // top of 3rd fret
    const margin = 16; // allowable margin for x
  
    // Create draggable finger circles in the start container above the diagram
    fingers.forEach((finger, idx) => {
      const circle = document.createElement('div');
      circle.className = 'finger-circle';
      circle.draggable = true;
      // Only set position and left/top when moved to overlay
      // Add margin for spacing in the start container
      circle.style.margin = '0 16px';
      circle.dataset.finger = finger;
      circle.dataset.idx = idx;
      circle.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', idx);
      });
      startContainer.appendChild(circle);
    });
  
    // Drag and drop logic (no snap)
    overlay.addEventListener('dragover', e => e.preventDefault());
  
    overlay.addEventListener('drop', e => {
      e.preventDefault();
      const idx = e.dataTransfer.getData('text/plain');
      const rect = overlay.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      // Find the circle in either startContainer or overlay
      let circle = overlay.querySelector(`.finger-circle[data-idx='${idx}']`);
      if (!circle) {
        circle = startContainer.querySelector(`.finger-circle[data-idx='${idx}']`);
        if (circle) {
          overlay.appendChild(circle);
          // Set absolute positioning and left/top when moved to overlay
          circle.style.position = 'absolute';
          circle.style.left = `${x - 12}px`;
          circle.style.top = `${y - 12}px`;
          circle.style.margin = '0'; // Remove margin when on overlay
        }
      }
      if (circle) {
        circle.style.left = `${x - 12}px`;
        circle.style.top = `${y - 12}px`;
        circle.dataset.x = x;
        circle.dataset.y = y;
        updateFingerPositions();
      }
    });
  
    function updateFingerPositions() {
      const positions = [];
      const circles = overlay.querySelectorAll('.finger-circle');
      circles.forEach(circle => {
        positions.push({
          finger: circle.dataset.finger,
          x: circle.dataset.x || null,
          y: circle.dataset.y || null,
          left: circle.style.left,
          top: circle.style.top
        });
      });
      fingerPositions.value = JSON.stringify(positions);
    }
  
    if (quizForm) {
      quizForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Always prevent form submission
        updateFingerPositions();
        const circles = overlay.querySelectorAll('.finger-circle');
        let correctCount = 0;
        let used = [false, false, false];
        let feedbackMsg = '';
        let correctMsg = '';
  
        circles.forEach(circle => {
          circle.style.border = '';
          circle.style.backgroundColor = '#3498db';
          const x = parseInt(circle.dataset.x);
          const y = parseInt(circle.dataset.y);
          let found = false;
          for (let i = 0; i < 3; i++) {
            if (!used[i] &&
              Math.abs(x - stringXs[i]) <= margin &&
              y >= fretY1 && y <= fretY2) {
              found = true;
              used[i] = true;
              break;
            }
          }
          if (found) {
            circle.style.border = '2px solid #28a745';
            correctCount++;
            correctMsg += '<span style="color:#28a745;">• Correct placement</span><br>';
          } else {
            circle.style.border = '2px solid #dc3545';
            circle.style.backgroundColor = '#dc3545';
            feedbackMsg += '<span style="color:#dc3545;">• Incorrect placement</span><br>';
          }
        });
  
        if (feedback) {
          if (correctCount === 3) {
            feedback.innerHTML = '✅ Correct! Great job!';
            feedback.style.color = '#28a745';
            // Mark this question as correct in sessionStorage for score tracking
            sessionStorage.setItem('dragDropCorrect', 'true');
          } else {
            feedback.innerHTML = '❌ Not quite!<br>' + correctMsg + feedbackMsg;
            feedback.style.color = '#dc3545';
            sessionStorage.setItem('dragDropCorrect', 'false');
          }
          if (submitBtn) submitBtn.style.display = 'none';
          if (nextBtn) nextBtn.style.display = 'inline-block';
        }
      });
    }
  
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        window.location.href = '/result';
      });
    }
  });
  