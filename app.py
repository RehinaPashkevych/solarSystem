from flask import Flask, render_template, request
import psycopg2
import urllib.parse as urlparse
import os

app = Flask(__name__, static_folder="static")
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:0000@localhost:54321/solarsystem ' - locally

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://postgres:0000@localhost:5432/solarsystem')

print(os.environ.get('DATABASE_URL'))


def get_db_connection():
    # Attempt to retrieve the DATABASE_URL environment variable
    database_url = os.environ.get('DATABASE_URL')
    
    # If DATABASE_URL is not set, fall back to the default local database connection
    if not database_url:
        conn = psycopg2.connect(
            host='localhost',
            port='5432',
            database='solarsystem',
            user='postgres',
            password='0000'
        )
        return conn
    else:
        # Parse the DATABASE_URL if it's set
        urlparse.uses_netloc.append("postgres")
        url = urlparse.urlparse(database_url)
        
        # Create a connection using the parsed DATABASE_URL
        conn = psycopg2.connect(
            database=url.path[1:],  # Remove the leading slash
            user=url.username,
            password=url.password,
            host=url.hostname,
            port=url.port
        )
        return conn

"""


def get_db_connection():
    conn = psycopg2.connect(
        host='localhost',
        port='5432',
        database='solarsystem',
        user='postgres',
        password='0000'
    )
    return conn





def get_db_connection():
    urlparse.uses_netloc.append("postgres")
    url = urlparse.urlparse(os.environ.get('DATABASE_URL'))

    conn = psycopg2.connect(
        database=url.path[1:],
        user=url.username,
        password=url.password,
        host=url.hostname,
        port=url.port
    )
  return conn
"""




  

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

@app.route("/redirect")
def object_api():
    object_name = request.args.get('object')
    if not object_name:
        return "No object name provided."
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT name, num_moons, description, history, size_original, position_original, rotation_speed_original, orbit_speed_original FROM planetsdata WHERE name = %s;', (object_name,))
    planetsdata = cur.fetchall()
    cur.execute('SELECT * FROM moonsData WHERE extendsplanet = %s OR name = %s LIMIT 6;', (object_name, "Moon"))
    moonsdata = cur.fetchall()
    cur.close()
    conn.close()
    return render_template('object-api.html', planetsdata=planetsdata, moonsdata=moonsdata)

@app.route("/moons")
def moons():
    planet_name = request.args.get('planet')
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT num_moons FROM planetsData WHERE name = %s;', (planet_name,))
    num_moons_tuple = cur.fetchone()
    
    if num_moons_tuple:
        num_moons = num_moons_tuple[0]
    else:
        num_moons = 0
    
    if planet_name:
        cur.execute('SELECT name, extendsPlanet, sizeoriginal, positionoriginal, rotationspeedoriginal, orbitspeedoriginal, description, history FROM moonsData WHERE extendsplanet = %s;', (planet_name,))
    moonsdata = cur.fetchall()
    
    no_planets_message = None
    if not moonsdata:
        no_planets_message = f"No moons were found for the specified planet."
    
    cur.close()
    conn.close()
    
    return render_template('moons.html', moonsdata=moonsdata, planet_name=planet_name, no_planets_message=no_planets_message, num_moons=num_moons)

if __name__ == '__main__':
    app.run(debug=True)
