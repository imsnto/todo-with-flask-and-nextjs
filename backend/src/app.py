from flask import Flask
from flask_sqlalchemy import SQLAlchemy

import os 
from dotenv import load_dotenv
load_dotenv()


db = SQLAlchemy()

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['SQLALCHEMY_DATABASE_URI']
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.environ['SQLALCHEMY_TRACK_MODIFICATIONS']

    db.init_app(app)

    with app.app_context():
        from .models import Task
        db.create_all()


        from src.routes import bp
        app.register_blueprint(bp)

    return app 


