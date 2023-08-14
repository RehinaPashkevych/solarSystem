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
outer_radius = db.Column(db.SmallInteger)

# Route to retrieve planet data in JSON format
@app.route('/api')
def planet():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT name, size, position, rotation_speed, orbit_speed, num_moons, inner_radius, outer_radius FROM planetsdata;')
    planetsdata = cur.fetchall()
    cur.execute("SELECT * FROM moonsData WHERE name = 'Moon';")
    moonsdata = cur.fetchall()
    cur.close()
    conn.close()
    return render_template('main-api.html', planetsdata=planetsdata, moonsdata=moonsdata)


@app.route("/redirectAPI")
def objectApi():
    object_name = request.args.get('object')
    print(object_name)
    if not object_name:
        return "No object name provided."
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(' SELECT name, num_moons, description, history, size_original, position_original, rotation_speed_original, orbit_speed_original FROM planetsdata WHERE name = %s;', (object_name,))
    planetsdata = cur.fetchall()
    cur.execute('SELECT * FROM moonsData WHERE extendsplanet = %s OR name = %s;', (object_name, "Moon"))
    moonsdata = cur.fetchall()
    cur.close()
    conn.close()
    return render_template('object-api.html', planetsdata=planetsdata, moonsdata=moonsdata)



@app.route("/moons")
def moons():
    planet_name = request.args.get('planet')
    conn = get_db_connection()
    cur = conn.cursor()
    if planet_name:
        cur.execute('SELECT name, extendsPlanet, sizeoriginal, positionoriginal, rotationspeedoriginal, orbitspeedoriginal, description, history  FROM moonsData WHERE extendsplanet = %s;', (planet_name,))
    moonsdata = cur.fetchall()
    if not moonsdata:
        no_planets_message = "No moons were found for the specified planet."
    else:
        no_planets_message = None
    cur.close()
    conn.close()
    return render_template('moons.html', moonsdata=moonsdata, planet_name=planet_name, no_planets_message=no_planets_message)

if __name__ == '__main__':
    app.run(debug=True)