from src.app import db

    
class Task(db.Model):
    __tablename__ = 'task'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    status = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f'<Task {self.name}>'
