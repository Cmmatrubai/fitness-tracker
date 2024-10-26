# backend/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()
api = Api()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'your_secret_key'  # Replace with a secure key
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///fitness.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)
    api.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # Import and register blueprints or resources
    from backend.resources.user import UserRegistration, UserLogin
    from backend.resources.workout import WorkoutList

    # Register API resources
    api.add_resource(UserRegistration, '/signup')
    api.add_resource(UserLogin, '/login')
    api.add_resource(WorkoutList, '/workouts')

    return app
