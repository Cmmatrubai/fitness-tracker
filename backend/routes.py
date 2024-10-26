# routes.py
from flask import request, jsonify
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity
)
from passlib.hash import pbkdf2_sha256 as sha256
from app import app, mysql
from datetime import datetime


# User Registration
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data['username']
    email = data['email']
    password = data['password']

    # Hash the password
    password_hash = sha256.hash(password)

    cur = mysql.connection.cursor()
    # Check if user exists
    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    existing_user = cur.fetchone()

    if existing_user:
        return jsonify({'message': 'User already exists'}), 400

    # Insert new user
    cur.execute(
        "INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
        (username, email, password_hash)
    )
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'User created successfully'}), 201

# User Login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    password = data['password']

    connection = get_db_connection()
    cur = connection.cursor()
    cur.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cur.fetchone()
    cur.close()

    if not user or not sha256.verify(password, user[3]):
        return jsonify({'message': 'Invalid credentials'}), 401

    access_token = create_access_token(identity={'id': user[0], 'username': user[1], 'email': user[2]})
    return jsonify({'access_token': access_token}), 200

# Get All Workouts
@app.route('/workouts', methods=['GET'])
@jwt_required()
def get_workouts():
    current_user = get_jwt_identity()
    user_id = current_user['id']

    connection = get_db_connection()
    cur = connection.cursor()
    cur.execute("SELECT * FROM workouts WHERE user_id = %s", (user_id,))
    workouts = cur.fetchall()
    cur.close()

    workouts_list = []
    for workout in workouts:
        workouts_list.append({
            'id': workout[0],
            'user_id': workout[1],
            'date': workout[2].isoformat(),
            'exercise_type': workout[3],
            'duration': workout[4],
            'details': workout[5],
            'notes': workout[6]
        })

    return jsonify(workouts_list), 200

# Add a New Workout
@app.route('/workouts', methods=['POST'])
@jwt_required()
def add_workout():
    data = request.get_json()
    current_user = get_jwt_identity()
    user_id = current_user['id']

    date = data['date']
    exercise_type = data['exercise_type']
    duration = data['duration']
    details = data.get('details')
    notes = data.get('notes')

    connection = get_db_connection()
    cur = connection.cursor()
    cur.execute(
        "INSERT INTO workouts (user_id, date, exercise_type, duration, details, notes) VALUES (%s, %s, %s, %s, %s, %s)",
        (user_id, date, exercise_type, duration, details, notes)
    )
    mysql.connection.commit()
    cur.close()

    return jsonify({'message': 'Workout added'}), 201

# Get, Update, Delete a Single Workout
@app.route('/workouts/<int:id>', methods=['GET', 'PUT', 'DELETE'])
@jwt_required()
def manage_workout(id):
    current_user = get_jwt_identity()
    user_id = current_user['id']

    connection = get_db_connection()
    cur = connection.cursor()

    if request.method == 'GET':
        cur.execute("SELECT * FROM workouts WHERE id = %s AND user_id = %s", (id, user_id))
        workout = cur.fetchone()
        cur.close()

        if not workout:
            return jsonify({'message': 'Workout not found'}), 404

        workout_data = {
            'id': workout[0],
            'user_id': workout[1],
            'date': workout[2].isoformat(),
            'exercise_type': workout[3],
            'duration': workout[4],
            'details': workout[5],
            'notes': workout[6]
        }

        return jsonify(workout_data), 200

    elif request.method == 'PUT':
        data = request.get_json()
        date = data['date']
        exercise_type = data['exercise_type']
        duration = data['duration']
        details = data.get('details')
        notes = data.get('notes')

        cur.execute(
            "UPDATE workouts SET date = %s, exercise_type = %s, duration = %s, details = %s, notes = %s WHERE id = %s AND user_id = %s",
            (date, exercise_type, duration, details, notes, id, user_id)
        )
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Workout updated'}), 200

    elif request.method == 'DELETE':
        cur.execute("DELETE FROM workouts WHERE id = %s AND user_id = %s", (id, user_id))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Workout deleted'}), 200
