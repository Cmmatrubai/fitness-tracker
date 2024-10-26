from flask import request
from flask_restful import Resource
from backend.models import Workout
from backend import db
from flask_jwt_extended import jwt_required, get_jwt_identity


class WorkoutList(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        workouts = Workout.query.filter_by(user_id=current_user['id']).all()
        return [workout.serialize() for workout in workouts], 200

    @jwt_required()
    def post(self):
        data = request.get_json()
        current_user = get_jwt_identity()
        new_workout = Workout(
            user_id=current_user['id'],
            date=datetime.strptime(data['date'], '%Y-%m-%d'),
            exercise_type=data['exercise_type'],
            duration=data['duration'],
            details=data.get('details'),
            notes=data.get('notes')
        )
        db.session.add(new_workout)
        db.session.commit()
        return {'message': 'Workout added'}, 201

# Implement WorkoutDetail for PUT and DELETE operations
