from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import db, Question, QuizSession, QuizAttempt
import random

api_bp = Blueprint('api', __name__)

@api_bp.route('/questions', methods=['GET'])
@jwt_required()
def get_all_questions():
    questions = Question.query.all()
    output = []
    for q in questions:
        shuffled_options = q.options.copy()
        random.shuffle(shuffled_options)
        output.append({
            "id": q.id,
            "question_type": q.question_type,
            "question": q.question,
            "options": shuffled_options,
            "correct_answer": q.correct_answer
        })
    return jsonify(output), 200

# backend/app/routes.py
@api_bp.route('/quiz/random', methods=['GET'])
@jwt_required()
def get_random_quiz():
    # Get 20 questions from each category
    signs_questions = Question.query.filter_by(question_type="Traffic Signs")\
        .order_by(db.func.random())\
        .limit(20).all()
    
    rules_questions = Question.query.filter_by(question_type="Rules of the Road")\
        .order_by(db.func.random())\
        .limit(20).all()
    
    # Combine and shuffle questions
    all_questions = signs_questions + rules_questions
    random.shuffle(all_questions)
    
    output = []
    for q in all_questions:
        shuffled_options = q.options.copy()
        random.shuffle(shuffled_options)
        question_data = {
            "id": q.id,
            "question_type": q.question_type,
            "question": q.question,
            "options": shuffled_options,
            "correct_answer": q.correct_answer
        }
        
        # For signs questions, add the image URL
        if q.question_type == "Traffic Signs":
            question_data["image_url"] = f"/static/images/{q.image_path}"
            
        output.append(question_data)
    
    return jsonify(output), 200


@api_bp.route('/quiz/submit', methods=['POST'])
@jwt_required()
def submit_quiz():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    # Create new quiz session
    session = QuizSession(
        user_id=user_id,
        total_questions=len(data['answers']),
        total_score=sum(1 for a in data['answers'] if a['is_correct']),
        end_time=db.func.current_timestamp()
    )
    db.session.add(session)
    db.session.flush()  # Get session ID
    
    # Add attempts
    for answer in data['answers']:
        attempt = QuizAttempt(
            session_id=session.id,
            question_id=answer['question_id'],
            user_answer=answer['user_answer'],
            is_correct=answer['is_correct']
        )
        db.session.add(attempt)
    
    db.session.commit()
    return jsonify({'msg': 'Quiz submitted successfully', 'session_id': session.id}), 200

@api_bp.route('/quiz/history', methods=['GET'])
@jwt_required()
def get_quiz_history():
    user_id = get_jwt_identity()
    sessions = QuizSession.query.filter_by(user_id=user_id).all()
    
    return jsonify([{
        'id': s.id,
        'date': s.start_time,
        'score': s.total_score,
        'total': s.total_questions,
        'percentage': (s.total_score / s.total_questions) * 100 if s.total_questions else 0
    } for s in sessions]), 200

@api_bp.route('/quiz/session/<int:session_id>', methods=['GET'])
@jwt_required()
def get_quiz_session_details(session_id):
    user_id = get_jwt_identity()
    session = QuizSession.query.filter_by(id=session_id, user_id=user_id).first()
    
    if not session:
        return jsonify({"msg": "Session not found"}), 404
    
    attempts = QuizAttempt.query.filter_by(session_id=session_id).all()
    
    details = {
        'id': session.id,
        'date': session.start_time,
        'total_questions': session.total_questions,
        'total_score': session.total_score,
        'attempts': [{
            'question_id': attempt.question_id,
            'user_answer': attempt.user_answer,
            'is_correct': attempt.is_correct,
            'question': Question.query.get(attempt.question_id).question,
            'correct_answer': Question.query.get(attempt.question_id).correct_answer,
            'options': Question.query.get(attempt.question_id).options,
            'question_type': Question.query.get(attempt.question_id).question_type,
            'image_path': Question.query.get(attempt.question_id).image_path
        } for attempt in attempts]
    }
    
    return jsonify(details)