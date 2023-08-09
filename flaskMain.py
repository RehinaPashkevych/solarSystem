from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import psycopg2


app = Flask(__name__, static_folder="static")

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:0000@localhost:5432/solarsystem '
db = SQLAlchemy(app)

def get_db_connection():
    # Implement your database connection code here
    conn = psycopg2.connect(
        host='localhost',
        port='5432',
        database='solarsystem',
        user='postgres',
        password='0000'
    )
    return conn

"""class Planet(db.Model):
    id_planet = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(32), nullable=False)
    size = db.Column(db.SmallInteger, nullable=False)
    position = db.Column(db.SmallInteger, nullable=False)
    rotation_speed = db.Column(db.Numeric(5, 4), nullable=False)
    orbit_speed = db.Column(db.Numeric(5, 4), nullable=False)
    num_moons = db.Column(db.SmallInteger, nullable=False)
    inner_radius = db.Column(db.SmallInteger)
    outer_radius = db.Column(db.SmallInteger)
"""

@app.route("/")
def index():
    return render_template('index.html')


@app.route("/redirect")
def object():
     return render_template('object.html')

# Route to retrieve planet data in JSON format
@app.route('/api')
def planet():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM planetsData;')
    planetsdata = cur.fetchall()
    cur.execute('SELECT * FROM moonsData;')
    moonsdata = cur.fetchall()
    cur.close()
    conn.close()
    return render_template('main-api.html', planetsdata=planetsdata, moonsdata=moonsdata)


@app.route("/redirectAPI")
def objectApi():
     return render_template('object-api.html')


"""
def object_api():
    if request.method == 'POST':
        data = request.get_json()
        # Process the received data as needed

        # Return a JSON response
        response_data = {'message': 'Data received and processed successfully'}
        return jsonify(response_data)
    
    # If the request method is not POST, return an error response
    return jsonify({'error': 'Invalid request method'})

"""

if __name__ == '__main__':
    app.run(debug=True)