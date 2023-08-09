import psycopg2
from flask import jsonify

conn = psycopg2.connect(
        host="localhost",
        database="solarsystem",
        user="postgres",
        password="0000")

# Open a cursor to perform database operations
cur = conn.cursor()

planetsData = [
    { 'name': "Sun", 'size': 15, 'position': 0, 'rotationSpeed': 0.004, 'orbitSpeed': 0, 'moons': 0, 
     'description': "Fiery star", 'history': "Central to our solar system" },
   
    { 'name': "Mercury", 'size': 3.2, 'position': 28, 'rotationSpeed': 0.004, 'orbitSpeed': 0.04, 'moons': 0, 
     'description': "Swift messenger", 'history': "Named after Roman god of commerce" },
   
    { 'name': "Venus", 'size': 5.8, 'position': 44, 'rotationSpeed': 0.002, 'orbitSpeed': 0.015, 'moons': 0, 
     'description': "Shrouded beauty", 'history': "Named after Roman goddess of love" },
   
    { 'name': "Earth", 'size': 6, 'position': 62, 'rotationSpeed': 0.02, 'orbitSpeed': 0.01, 'moons': 1, 
     'description': "Blue oasis", 'history': "The cradle of humanity" },
    
    { 'name': "Mars", 'size': 4, 'position': 78, 'rotationSpeed': 0.018, 'orbitSpeed': 0.008, 'moons': 2, 
     'description': "Red planet", 'history': "Explored for signs of life" },
   
    { 'name': "Jupiter", 'size': 12, 'position': 100, 'rotationSpeed': 0.04, 'orbitSpeed': 0.002, 'moons': 95, 
     'description': "Giant storm", 'history': "Largest planet with iconic bands" },
  
    { 'name': "Saturn", 'size': 10, 'position': 138, 'rotationSpeed': 0.038, 'orbitSpeed': 0.0009, 'moons': 146, 
     'innerRadius': 10, 'outerRadius': 20, 'description': "Ringed wonder", 'history': "Famous for its stunning rings" },
   
    { 'name': "Uranus", 'size': 7, 'position': 176, 'rotationSpeed': 0.032, 'orbitSpeed': 0.0004, 'moons': 27,
     'innerRadius': 7, 'outerRadius': 12, 'description': "Tilted ice giant", 'history': "Discovered by William Herschel in 1781" },
   
    { 'name': "Neptune", 'size': 7, 'position': 200, 'rotationSpeed': 0.032, 'orbitSpeed': 0.0001, 'moons': 14, 
     'description': "Mystic blue", 'history': "First predicted by mathematical calculations" }
]


moonsData = [
  { 'name': "Moon", 'extendsPlanet': "Earth", 'size': 1.5, 'position': 68, 'rotationSpeed': 0.038, 'orbitSpeed': 0.01, 'id_planet' : 4 },  
]
# Execute a command: this creates a new table
cur.execute('DROP TABLE IF EXISTS moonsData CASCADE;')
cur.execute('CREATE TABLE moonsData (id_moon SERIAL PRIMARY KEY,'
    'name VARCHAR(32) NOT NULL,'
    'extends_planet VARCHAR(32) NOT NULL,'
    'size NUMERIC(5, 2) NOT NULL,'
    'position SMALLINT NOT NULL,'
    'rotation_speed NUMERIC(5, 4) NOT NULL,'
    'orbit_speed NUMERIC(5, 4) NOT NULL,'
    'id_planet SMALLINT);'
)

# Execute a command: this creates a new table
cur.execute('DROP TABLE IF EXISTS planetsData;')
cur.execute('CREATE TABLE planetsData (id_planet SERIAL PRIMARY KEY,'
    'name VARCHAR(32) NOT NULL,'
   ' size SMALLINT NOT NULL,'
   ' position SMALLINT NOT NULL,'
   ' rotation_speed NUMERIC(5, 3) NOT NULL,'
   ' orbit_speed NUMERIC(5, 4) NOT NULL,'
   ' num_moons SMALLINT NOT NULL,'
   'inner_radius SMALLINT NULL,'
   'outer_radius SMALLINT NULL,'
   'description TEXT NOT NULL,'
   'history TEXT NOT NULL);'
)

# SQL command to insert data into the moonsData table
insert_moon_query = """
    INSERT INTO moonsData (name, extends_planet, id_planet, size, position, rotation_speed, orbit_speed)
    VALUES (%(name)s, %(extends_planet)s, %(id_planet)s, %(size)s, %(position)s, %(rotationSpeed)s, %(orbitSpeed)s);
"""

# Loop through the moonsData array and insert each moon's data into the table
for moon in moonsData:
    moon_data = {
        'name': moon['name'],
        'extends_planet': moon['extendsPlanet'],
        'size': moon['size'],
        'position': moon['position'],
        'rotationSpeed': moon['rotationSpeed'],
        'orbitSpeed': moon['orbitSpeed'],
        'id_planet': moon['id_planet']
    }
    cur.execute(insert_moon_query, moon_data)

# Commit the changes to the database
conn.commit()

# SQL command to insert data into the planetsData table
insert_query = """
    INSERT INTO planetsData (name, size, position, rotation_speed, orbit_speed, num_moons, inner_radius, outer_radius, description, history)
    VALUES ( %(name)s, %(size)s, %(position)s, %(rotationSpeed)s, %(orbitSpeed)s, %(moons)s, %(innerRadius)s, %(outerRadius)s, %(description)s, %(history)s)
"""

# Loop through the planetsData array and insert each planet's data into the table
for planet in planetsData:
    planet_data = {
        'name': planet['name'],
        'size': planet['size'],
        'position': planet['position'],
        'rotationSpeed': planet['rotationSpeed'],
        'orbitSpeed': planet['orbitSpeed'],
        'moons': planet['moons'],
        'innerRadius': planet.get('innerRadius', None),
        'outerRadius': planet.get('outerRadius', None),
        'description': planet['description'],
        'history': planet['history']
    }
    cur.execute(insert_query, planet_data)

# Commit the changes to the database
conn.commit()




cur.close()
conn.close()