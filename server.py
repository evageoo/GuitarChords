from flask import Flask, render_template, request, redirect, url_for, session

app = Flask(__name__)
app.secret_key = 'supersecretkey'

# Learning content
learning_data = {
    "1": {
        "title": "Learn Basic Strumming",
        "instruction": "Try strumming all the strings downward!",
        "audio": "/static/media/strumming_audio.mp3"
    },
    "2": {
        "title": "Learn A Major Chord",
        "instruction": "Place three fingers on the second fret above the bottom string and strum!",
        "audio": "/static/media/a_major_chord_audio.mp3",
        "image": "/static/media/chord_images/a_major.png"
    },
    "3": {
        "title": "Learn D Chord",
        "instruction": "Use the specified fingers and strum only the bottom 4 strings.",
        "audio": "/static/media/d_chord_audio.mp3",
        "image": "/static/media/chord_images/d_chord.png"
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
        "question": "Which chord matches this sound?",
        "options": ["A", "D", "E", "G"],
        "correct": "D",
        "audio": "/static/media/d_chord_audio.mp3"
    }
}

@app.route('/')
def home():
    return render_template('homepage.html')

@app.route('/learn/<int:lesson_id>')
def learn(lesson_id):
    if lesson_id > len(learning_data):
        return redirect(url_for('quiz', quiz_id=1))
    lesson = learning_data[str(lesson_id)]
    return render_template('learn.html', lesson=lesson, lesson_id=lesson_id)

@app.route('/quiz/<int:quiz_id>')
def quiz(quiz_id):
    if quiz_id > len(quiz_data):
        return redirect(url_for('result'))
    question = quiz_data[str(quiz_id)]
    return render_template('quiz.html', question=question, quiz_id=quiz_id)

@app.route('/submit_quiz', methods=['POST'])
def submit_quiz():
    answer = request.form['answer']
    correct = request.form['correct']
    if 'score' not in session:
        session['score'] = 0
    if answer == correct:
        session['score'] += 1
    return redirect(url_for('quiz', quiz_id=int(request.form['quiz_id']) + 1))

@app.route('/result')
def result():
    score = session.get('score', 0)
    total = len(quiz_data)
    session.clear()
    return render_template('result.html', score=score, total=total)

if __name__ == '__main__':
    app.run(debug=True)
