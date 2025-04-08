from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Chore(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    assigned_to = db.Column(db.String(50))
    is_done = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "assigned_to": self.assigned_to,
            "is_done": self.is_done
        }
