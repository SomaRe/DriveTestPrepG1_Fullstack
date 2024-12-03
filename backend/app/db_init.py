# backend/app/db_init.py
import json
import os
from .database import db
from .models import Question

def init_db(app):
    """Initialize database and create tables"""
    db.init_app(app)
    
    with app.app_context():
        # Create tables if they don't exist
        db.create_all()
        
        # Load questions if table is empty
        if Question.query.count() == 0:
            load_sample_questions()

def load_sample_questions():
    """Load sample questions if none exist"""
    file_path = os.path.join(os.path.dirname(__file__), 'questions.json')
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        for qtype, questions in data.items():
            for q in questions:
                # For signs, the question is a number that corresponds to image filename
                image_path = f"{q['question']}.png" if qtype == "signs_questions" else None
                
                question = Question(
                    question_type=q.get('question_type', qtype),
                    question=str(q['question']),
                    options=q['options'],
                    correct_answer=q['correct_answer'],
                    image_path=image_path
                )
                db.session.add(question)
        
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print(f"Error loading questions: {e}")