# Add import
from flask_restful import Resource
from backend.models import Workout
from backend import db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime


class WorkoutList(Resource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        workouts = Workout.query.filter_by(user_id=current_user['id']).all()
        return [
            {
                'id': workout.id,
                'date': workout.date.isoformat(),
                'exercise_type': workout.exercise_type,
                'duration': workout.duration,
                'details': workout.details,
                'notes': workout.notes
            }
            for workout in workouts
        ], 200

class WorkoutDetail(Resource):
    @jwt_required()
    def get(self, id):
        current_user = get_jwt_identity()
        workout = Workout.query.filter_by(id=id, user_id=current_user['id']).first()
        if not workout:
            return {'message': 'Workout not found'}, 404
        return {
            'id': workout.id,
            'date': workout.date.isoformat(),
            'exercise_type': workout.exercise_type,
            'duration': workout.duration,
            'details': workout.details,
            'notes': workout.notes
        }, 200

    @jwt_required()
    def put(self, id):
        data = request.get_json()
        current_user = get_jwt_identity()
        workout = Workout.query.filter_by(id=id, user_id=current_user['id']).first()
        if not workout:
            return {'message': 'Workout not found'}, 404

        workout.date = datetime.strptime(data['date'], '%Y-%m-%d')
        workout.exercise_type = data['exercise_type']
        workout.duration = data['duration']
        workout.details = data.get('details')
        workout.notes = data.get('notes')
        db.session.commit()
        return {'message': 'Workout updated'}, 200

    @jwt_required()
    def delete(self, id):
        current_user = get_jwt_identity()
        workout = Workout.query.filter_by(id=id, user_id=current_user['id']).first()
        if not workout:
            return {'message': 'Workout not found'}, 404
        db.session.delete(workout)
        db.session.commit()
        return {'message': 'Workout deleted'}, 200
