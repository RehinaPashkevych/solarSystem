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
     'description': "Fiery star", 'history': "Central to our solar system",
     'sizeOriginal': 1391000, 'positionOriginal': 0, 'rotationSpeedOriginal': 25.38, 'orbitSpeedOriginal': 0 },
   
    { 'name': "Mercury", 'size': 3.2, 'position': 28, 'rotationSpeed': 0.004, 'orbitSpeed': 0.04, 'moons': 0, 
     'description': "Swift messenger", 'history': "Named after Roman god of commerce",
     'sizeOriginal': 4879, 'positionOriginal': 57.9, 'rotationSpeedOriginal': 58.65, 'orbitSpeedOriginal': 47.87 },
   
    { 'name': "Venus", 'size': 5.8, 'position': 44, 'rotationSpeed': 0.002, 'orbitSpeed': 0.015, 'moons': 0, 
     'description': "Shrouded beauty", 'history': "Named after Roman goddess of love",
     'sizeOriginal': 12104, 'positionOriginal': 108.2, 'rotationSpeedOriginal': 243.02, 'orbitSpeedOriginal': 35.02 },
   
    { 'name': "Earth", 'size': 6, 'position': 62, 'rotationSpeed': 0.02, 'orbitSpeed': 0.01, 'moons': 1, 
     'description': "Blue oasis", 'history': "The cradle of humanity",
     'sizeOriginal': 12742, 'positionOriginal': 149.6, 'rotationSpeedOriginal': 0.997, 'orbitSpeedOriginal': 29.78 },
    
    { 'name': "Mars", 'size': 4, 'position': 78, 'rotationSpeed': 0.018, 'orbitSpeed': 0.008, 'moons': 2, 
     'description': "Red planet", 'history': "Explored for signs of life",
     'sizeOriginal': 6779, 'positionOriginal': 227.9, 'rotationSpeedOriginal': 1.026, 'orbitSpeedOriginal': 24.077 },
   
    { 'name': "Jupiter", 'size': 12, 'position': 100, 'rotationSpeed': 0.04, 'orbitSpeed': 0.002, 'moons': 95, 
     'description': "Giant storm", 'history': "Largest planet with iconic bands",
     'sizeOriginal': 139822, 'positionOriginal': 778.3, 'rotationSpeedOriginal': 0.41354, 'orbitSpeedOriginal': 13.07 },
  
    { 'name': "Saturn", 'size': 10, 'position': 138, 'rotationSpeed': 0.038, 'orbitSpeed': 0.0009, 'moons': 146, 
     'innerRadius': 10, 'outerRadius': 20, 'description': "Ringed wonder", 'history': "Famous for its stunning rings",
     'sizeOriginal': 116464, 'positionOriginal': 1426.9, 'rotationSpeedOriginal': 0.44401, 'orbitSpeedOriginal': 9.69 },
   
    { 'name': "Uranus", 'size': 7, 'position': 176, 'rotationSpeed': 0.032, 'orbitSpeed': 0.0004, 'moons': 27,
     'innerRadius': 7, 'outerRadius': 12, 'description': "Tilted ice giant", 'history': "Discovered by William Herschel in 1781",
     'sizeOriginal': 50724, 'positionOriginal': 2870.9, 'rotationSpeedOriginal': 0.71833, 'orbitSpeedOriginal': 6.81 },
   
    { 'name': "Neptune", 'size': 7, 'position': 200, 'rotationSpeed': 0.032, 'orbitSpeed': 0.0001, 'moons': 14, 
     'description': "Mystic blue", 'history': "First predicted by mathematical calculations",
     'sizeOriginal': 49244, 'positionOriginal': 4495.1, 'rotationSpeedOriginal': 0.67125, 'orbitSpeedOriginal': 5.43 }
]


moonsData = [
    {'name': "Moon", 'extendsPlanet': "Earth", 'size': 1.5, 'position': 68, 'rotationSpeed': 0.038,
        'orbitSpeed': 0.01, 'id_planet': 4, 'sizeOriginal': 1.5,  'positionOriginal': 68, 
        'rotationSpeedOriginal': 0.038, 'orbitSpeedOriginal': 0.01,
        'description': "The Moon is Earth's only natural satellite.",
        'history': "It has been a source of fascination and inspiration for humanity throughout history.",
    },
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
    ' name VARCHAR(32) NOT NULL,'
    ' size SMALLINT NOT NULL,'
    ' position SMALLINT NOT NULL,'
    ' rotation_speed NUMERIC(5, 3) NOT NULL,'
    ' orbit_speed NUMERIC(5, 4) NOT NULL,'
    ' num_moons SMALLINT NOT NULL,'
    ' inner_radius SMALLINT NULL,'
    ' outer_radius SMALLINT NULL,'
    ' description TEXT NOT NULL,'
    ' history TEXT NOT NULL,'
    ' size_original INT NOT NULL,'
    ' position_original NUMERIC(8, 2) NOT NULL,'
    ' rotation_speed_original NUMERIC(8, 5) NOT NULL,'
    ' orbit_speed_original NUMERIC(8, 6) NOT NULL);'
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
    INSERT INTO planetsData (name, size, position, rotation_speed, orbit_speed, num_moons,
    inner_radius, outer_radius, description, history, size_original, position_original, 
    rotation_speed_original, orbit_speed_original)

    VALUES (%(name)s, %(size)s, %(position)s, %(rotationSpeed)s, %(orbitSpeed)s, %(moons)s,
     %(innerRadius)s, %(outerRadius)s, %(description)s, %(history)s, %(sizeOriginal)s, %(positionOriginal)s,
     %(rotationSpeedOriginal)s, %(orbitSpeedOriginal)s)
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
        'history': planet['history'],
        'sizeOriginal': planet['sizeOriginal'],
        'positionOriginal': planet['positionOriginal'],
        'rotationSpeedOriginal': planet['rotationSpeedOriginal'],
        'orbitSpeedOriginal': planet['orbitSpeedOriginal']
    }
    cur.execute(insert_query, planet_data)


# Commit the changes to the database
conn.commit()




cur.close()
conn.close()