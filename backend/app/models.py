# backend/app/models.py
from .database import db, bcrypt

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

class Question(db.Model):
    __tablename__ = 'questions'
    id = db.Column(db.Integer, primary_key=True)
    question_type = db.Column(db.String(50), nullable=False)
    question = db.Column(db.Text, nullable=False)
    options = db.Column(db.JSON, nullable=False)  # Using JSON instead of PickleType
    correct_answer = db.Column(db.String(200), nullable=False)
    image_path = db.Column(db.String(200), nullable=True)

class QuizSession(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    start_time = db.Column(db.DateTime, default=db.func.current_timestamp())
    end_time = db.Column(db.DateTime)
    total_score = db.Column(db.Integer)
    total_questions = db.Column(db.Integer)
    attempts = db.relationship('QuizAttempt', backref='session', lazy=True)

class QuizAttempt(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.Integer, db.ForeignKey('quiz_session.id'))
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'))
    user_answer = db.Column(db.String(200))
    is_correct = db.Column(db.Boolean)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())