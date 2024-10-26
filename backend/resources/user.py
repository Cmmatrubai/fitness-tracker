# resources/user.py
from flask import request
from flask_restful import Resource
from backend.models import User
from backend import db
from flask_jwt_extended import create_access_token


class UserRegistration(Resource):
    def post(self):
        data = request.get_json()
        if User.query.filter_by(email=data['email']).first():
            return {'message': 'User {} already exists'. format(data['email'])}, 400
        
        new_user = User(
            username=data['username'],
            email=data['email'],
            password=User.generate_hash(data['password'])
        )
        db.session.add(new_user)
        db.session.commit()
        return {'message': 'User {} was created'.format(data['email'])}, 201

class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        current_user = User.query.filter_by(email=data['email']).first()
        if not current_user:
            return {'message': 'User {} doesn\'t exist'.format(data['email'])}, 404
        
        if User.verify_hash(data['password'], current_user.password):
            access_token = create_access_token(identity={'id': current_user.id, 'email': current_user.email})
            return {'message': 'Logged in as {}'.format(current_user.email), 'access_token': access_token}, 200
        else:
            return {'message': 'Wrong credentials'}, 401
