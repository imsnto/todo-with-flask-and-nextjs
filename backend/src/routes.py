from flask import Blueprint, jsonify, request
from .models import Task
from .app import db 

bp = Blueprint('main', __name__)

@bp.route('/tasks', methods=['GET'])
def list_task():
    tasks = Task.query.all()
    return jsonify([
        {
            "id": task.id,
            "name": task.name,
            "status": task.status
        }
        for task in tasks
    ]), 200

@bp.route('/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    task = Task(name=data['name'], status=data['status'])
    db.session.add(task)
    db.session.commit()

    return jsonify({
        "message": "Task created",
        "task": {
            "id": task.id,
            "name": task.name,
            "status": task.status
        }
    }), 201

@bp.route("/tasks/<int:pk>", methods=["GET"])
def task_detail(pk):
    task = Task.query.get(pk)

    if not task:
        return jsonify({
            "error":  "Task not found"
        }), 404
    
    return jsonify({
        "id": task.id,
        "name": task.name,
        "status": task.status
    }), 200

@bp.route("/tasks/<int:pk>", methods=["PUT"])
def update_task(pk):
    task = Task.query.get(pk)
    if not task:
        return jsonify({
            "error": "invalid task id provided"
        }), 404

    fields = ['status']
    data = request.get_json()

    for field in data:
        if field in fields:
            setattr(task, field, data[field])
    
    db.session.commit()

    return jsonify({
        "id": task.id,
        "name": task.name,
        "status": task.status
    }), 200

@bp.route("/tasks/<int:pk>", methods=["DELETE"])
def delete_task(pk):
    task = Task.query.get(pk)
    if not task:
        return jsonify({
            "error": "invalid task id provided"
        }), 404

    db.session.delete(task)
    db.session.commit()

    return jsonify({
        "message": "Task deleted."
    }), 200

