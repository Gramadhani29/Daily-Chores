from flask import Flask, request, jsonify, render_template
from models import db, Chore

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chores.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chores', methods=['POST'])
def add_chore():
    data = request.json
    chore = Chore(
        name=data['name'],
        assigned_to=data.get('assigned_to', '')
    )
    db.session.add(chore)
    db.session.commit()
    return jsonify(chore.to_dict()), 201

@app.route('/chores', methods=['GET'])
def get_chores():
    chores = Chore.query.all()
    return jsonify([c.to_dict() for c in chores])

@app.route('/chores/<int:chore_id>', methods=['PUT'])
def update_chore(chore_id):
    chore = Chore.query.get_or_404(chore_id)
    data = request.json
    chore.name = data.get('name', chore.name)
    chore.assigned_to = data.get('assigned_to', chore.assigned_to)
    chore.is_done = data.get('is_done', chore.is_done)
    db.session.commit()
    return jsonify(chore.to_dict())

@app.route('/chores/<int:chore_id>', methods=['DELETE'])
def delete_chore(chore_id):
    chore = Chore.query.get_or_404(chore_id)
    db.session.delete(chore)
    db.session.commit()
    return jsonify({"message": "Chore deleted!"})

if __name__ == '__main__':
    app.run(debug=True)
