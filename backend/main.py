# backend/main.py
from flask import Flask, send_from_directory
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
from datetime import timedelta
import os

from app.database import db, bcrypt
from app.db_init import init_db
from app.auth import auth_bp
from app.routes import api_bp

load_dotenv()

def create_app():
    app = Flask(__name__,
                static_folder='../frontend/dist',
                static_url_path='')

    # Configure app
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    bcrypt.init_app(app)
    init_db(app)
    JWTManager(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(api_bp, url_prefix='/api')


    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    @app.errorhandler(404)
    def catch_all(path):
        return send_from_directory(app.static_folder, 'index.html')
    
    # static files
    @app.route('/static/images/<path:path>')
    def send_image(path):
        return send_from_directory('static/images', path)



    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)