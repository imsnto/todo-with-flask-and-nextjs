from flask import Blueprint, jsonify, request
from .models import Task
from .app import db 

bp = Blueprint('main', __name__)

@bp.route('/tasks', methods=['GET'])
def list_task():

    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    task_pagination = Task.query.paginate(page=page, per_page=per_page, error_out=False) # if page out of range then return empty list
    tasks = task_pagination.items

    task_list = [
        {
            "id": task.id,
            "name": task.name,
            "status": task.status
        }
        for task in tasks
    ]

    response = {
        "tasks": task_list,
        "pagination": {
            "total": task_pagination.total,
            "pages": task_pagination.pages,
            "page": task_pagination.page,
            "per_page": task_pagination.per_page,
            "has_next": task_pagination.has_next,
            "has_prev": task_pagination.has_prev,
            "next_num": task_pagination.next_num,
            "prev_num": task_pagination.prev_num
        }
    }

    return jsonify(response), 200

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

@bp.route("/tasks/<int:pk>", methods=["PATCH"])
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

