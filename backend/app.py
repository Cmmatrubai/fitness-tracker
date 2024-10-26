# app.py

from flask import Flask
from flask_jwt_extended import JWTManager
from config import Config
from flask_mysqldb import MySQL

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize MySQL
mysql = MySQL(app)

# Initialize JWT
jwt = JWTManager(app)

# Import routes
from routes import *

if __name__ == '__main__':
    app.run(debug=True)
