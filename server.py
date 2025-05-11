from flask import Flask, render_template, request, redirect, url_for, session
import json

app = Flask(__name__)
app.secret_key = 'supersecretkey'

# Learning content
learning_data = {
    "1": {
        "title": "Learn Basic Strumming",
        "instruction": "Try strumming all the strings downward!",
        "video": "/static/media/strum_materials/strum_demo.mp4",
        "image": "/static/media/strum_materials/strum.png"
    },
    "2": {
        "title": "Learn A Major Chord",
        "instruction": "Place three fingers on the second fret above the bottom string and strum!",
        "video": "/static/media/chord_videos/AChord.mp4",
        "image": "/static/media/chord_images/a_major.png",
        "image2": "/static/media/fret_diagram.png",
        "audio": "/static/media/a_chord_audio.mp3"
    },
    "3": {
        "title": "Learn E Major Chord",
        "instruction": "Strum all 6 strings downward: 1st finger on G-string 1st fret, 2nd finger on A-string 2nd fret, 3rd finger on D-string 2nd fret.",
        "video": "/static/media/chord_videos/EChord.mp4",
        "image": "/static/media/chord_images/e_major.png",
        "audio": "/static/media/e_major_chord_audio.mp3"
    }, 
    "4": {
        "title": "Learn D Major Chord",
        "instruction": "Place your index on the 2nd fret of the G string, middle on the 2nd fret of the high E, ring on the 3rd fret of the B string, and strum the bottom 4 strings.",
        "image": "/static/media/chord_images/d_major.png",
        "audio": "/static/media/d_chord_audio.mp3"
    },
    "5": {
        "title": "Learn G Major Chord",
        "instruction": "Place your middle on the 3rd fret of the low E, index on the 2nd fret of A, ring on the 3rd fret of high E, pinky on the 3rd fret of B, and strum all 6 strings",
        "image": "/static/media/chord_images/g_major.png",
        "audio": "/static/media/g_chord_audio.mp3"
    }, 
    "6": {
        "title": "Learn C Major Chord",
        "instruction": "Place your ring on the 3rd fret of A, middle on the 2nd fret of D, index on the 1st fret of B, and strum from the A string down (skip low E)",
        "image": "/static/media/chord_images/c_major.png",
        "audio": "/static/media/c_chord_audio.mp3"
    }
}


# Quiz content
quiz_data = {
    "1": {
        "question": "Which chord is being played?",
        "options": ["A", "B", "C", "D"],
        "correct": "A",
        "image": "/static/media/chord_images/a_major.png"
    },
    "2": {
        "type": "string_input",
        "question": "Type the letter names of the highlighted guitar strings.",
        "strings": [
            {"name": "A", "index": 1},  # 5th string from left (E A D G B e)
            {"name": "B", "index": 4}   # 2nd string from left
        ],
        "image": "/static/media/Guitar-chord-diagram.jpg"
    },
    "3": {
        "type": "drag_drop",
        "question": "Place your fingers to form an A Major chord",
        "correct": {
            "positions": [
                {"finger": "1", "string": 2, "fret": 2},
                {"finger": "2", "string": 3, "fret": 2},
                {"finger": "3", "string": 4, "fret": 2}
            ]
        }
    }
}

@app.route('/')
def home():
    return render_template('homepage.html')

@app.route('/learn/<int:lesson_id>')
def learn(lesson_id):
    total_lessons = len(learning_data)

    if lesson_id > total_lessons:
        return redirect(url_for('quiz', quiz_id=1))

    lesson = learning_data.get(str(lesson_id))

    # Calculate progress percentage
    progress = int((lesson_id / total_lessons) * 100)

    # Is this the last lesson?
    is_last_lesson = (lesson_id == total_lessons)

    return render_template(
        'learn.html',
        lesson=lesson,
        lesson_id=lesson_id,
        progress=progress,
        is_last_lesson=is_last_lesson
    )


@app.route('/quiz/<int:quiz_id>')
def quiz(quiz_id):
    total_questions = len(quiz_data)

    if quiz_id > total_questions:
        return redirect(url_for('result'))

    question = quiz_data[str(quiz_id)]

    # Calculate quiz progress percentage
    progress = int((quiz_id / total_questions) * 100)

    # Determine next_url
    if quiz_id < total_questions:
        next_url = url_for('quiz', quiz_id=quiz_id + 1)
    else:
        next_url = url_for('result')

    return render_template(
        'quiz.html',
        question=question,
        quiz_id=quiz_id,
        progress=progress,
        next_url=next_url  # <-- pass this to the template
    )

def check_finger_positions(user_positions, correct_positions):
    if not user_positions:
        return False
    
    # Convert string positions to fret and string numbers
    def get_fret_and_string(x, y):
        # Assuming 6 strings and 5 frets
        string_width = 300 / 5  # 300px width divided by 5 spaces between strings
        fret_height = 200 / 5   # 200px height divided by 5 frets
        
        string = round(x / string_width)
        fret = round(y / fret_height)
        
        # Ensure values are within bounds
        string = max(0, min(5, string))
        fret = max(0, min(4, fret))
        
        return string, fret
    
    # Convert user positions to fret and string numbers
    user_positions = json.loads(user_positions)
    user_finger_positions = []
    
    for pos in user_positions:
        string, fret = get_fret_and_string(pos['x'], pos['y'])
        user_finger_positions.append({
            'finger': pos['finger'],
            'string': string,
            'fret': fret
        })
    
    # Check if all correct positions are present in user positions
    correct_positions = correct_positions['positions']
    
    # First check if we have exactly the right number of fingers
    if len(user_finger_positions) != len(correct_positions):
        return False
    
    # Then check if all correct positions are present
    for correct_pos in correct_positions:
        found = False
        for user_pos in user_finger_positions:
            if (user_pos['finger'] == correct_pos['finger'] and
                user_pos['string'] == correct_pos['string'] and
                user_pos['fret'] == correct_pos['fret']):
                found = True
                break
        if not found:
            return False
    
    return True

@app.route('/submit_quiz', methods=['POST'])
def submit_quiz():
    question_type = request.form.get('question_type', 'multiple_choice')
    quiz_id = request.form['quiz_id']
    
    if 'score' not in session:
        session['score'] = 0
    
    if question_type == 'drag_drop':
        try:
            finger_positions = request.form.get('finger_positions', '[]')
            correct_positions = json.loads(request.form['correct'])
            if check_finger_positions(finger_positions, correct_positions):
                session['score'] += 1
        except json.JSONDecodeError:
            # Handle invalid JSON
            print("Invalid JSON received:", finger_positions)
            session['score'] = session.get('score', 0)  # Keep existing score
    elif question_type == 'string_input':
        correct_0 = request.form.get('correct_0', '').strip().upper()
        correct_1 = request.form.get('correct_1', '').strip().upper()
        answer_0 = request.form.get('string_0', '').strip().upper()
        answer_1 = request.form.get('string_1', '').strip().upper()
        if answer_0 == correct_0 and answer_1 == correct_1:
            session['score'] += 1
    else:
        answer = request.form['answer']
        correct = request.form['correct']
        if answer == correct:
            session['score'] += 1
    
    return redirect(url_for('quiz', quiz_id=int(quiz_id) + 1))

@app.route('/result')
def result():
    score = session.get('score', 0)
    total = len(quiz_data)
    session.clear()
    return render_template('result.html', score=score, total=total)


if __name__ == '__main__':
    app.run(debug=True)
