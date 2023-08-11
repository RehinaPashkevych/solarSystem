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

    # Earth moon
    {'name': "Moon", 'extendsPlanet': "Earth", 'size': 3, 'position': 10, 'rotationSpeed': 0.038, 'orbitSpeed': 0.01, 'id_planet': 4, 'sizeOriginal': 3474.8, 'positionOriginal': 384400, 'rotationSpeedOriginal': 27, 'orbitSpeedOriginal': 1.022,
     'description': "The Moon is Earth's only natural satellite.", 'history': "It has been a source of fascination and inspiration for humanity throughout history."},
   
    # Mars' moons
    { "name": "Phobos", "extendsPlanet": "Mars", "size": 3.5, "position": 10, "rotationSpeed": 0.015, "orbitSpeed": 0.004, "id_planet": 5, "sizeOriginal": 22.2, "positionOriginal": 9378, "rotationSpeedOriginal": 0.318, "orbitSpeedOriginal": 4.68,
      "description": "Phobos is the larger and innermost moon of Mars.", "history": "It was discovered by Asaph Hall in 1877." },
    { "name": "Deimos", "extendsPlanet": "Mars", "size": 2.5, "position": 14, "rotationSpeed": 0.02, "orbitSpeed": 0.003, "id_planet": 5, "sizeOriginal": 12.4, "positionOriginal": 23460, "rotationSpeedOriginal": 1.262, "orbitSpeedOriginal": 2.88,
      "description": "Deimos is the smaller and outermost moon of Mars.", "history": "It was discovered by Asaph Hall in 1877." },

    # Jupiter's moons
    { "name": "Amaltea", "extendsPlanet": "Jupiter", "size": 0.4, "position": 13, "rotationSpeed": 0.025, "orbitSpeed": 0.009, "id_planet": 6, "sizeOriginal": 168, "positionOriginal": 181400, "rotationSpeedOriginal": 0.498, "orbitSpeedOriginal": 7.2,
      "description": "Amaltea is a small irregular-shaped moon of Jupiter.", "history": "It was discovered by Edward Emerson Barnard in 1892." },
    { "name": "Io", "extendsPlanet": "Jupiter", "size": 1.2, "position": 19, "rotationSpeed": 0.035, "orbitSpeed": 0.008, "id_planet": 6, "sizeOriginal": 3643.2, "positionOriginal": 421700, "rotationSpeedOriginal": 1.769, "orbitSpeedOriginal": 5.6,
      "description": "Io is known for its volcanic activity and colorful surface.", "history": "It was discovered by Galileo Galilei in 1610." },
    { "name": "Europa", "extendsPlanet": "Jupiter", "size": 2.3, "position": 26, "rotationSpeed": 0.032, "orbitSpeed": 0.007, "id_planet": 6, "sizeOriginal": 3121.6, "positionOriginal": 671100, "rotationSpeedOriginal": 3.551, "orbitSpeedOriginal": 17.28,
      "description": "Europa is one of Jupiter's Galilean moons known for its icy surface.", "history": "Its potential subsurface ocean makes it a target for astrobiology." },
    { "name": "Ganymede", "extendsPlanet": "Jupiter", "size": 3.8, "position": 36, "rotationSpeed": 0.022, "orbitSpeed": 0.005, "id_planet": 6, "sizeOriginal": 5262.4, "positionOriginal": 1070400, "rotationSpeedOriginal": 7.154, "orbitSpeedOriginal": 18,
      "description": "Ganymede is the largest moon in the solar system and has its own magnetic field.", "history": "It was discovered by Galileo Galilei in 1610." },
    { "name": "Callisto", "extendsPlanet": "Jupiter", "size": 2.7, "position": 46, "rotationSpeed": 0.028, "orbitSpeed": 0.006, "id_planet": 6, "sizeOriginal": 4820.6, "positionOriginal": 1882700, "rotationSpeedOriginal": 16.689, "orbitSpeedOriginal": 20.16,
      "description": "Callisto is another of Jupiter's Galilean moons and has a heavily cratered surface.", "history": "It was discovered along with the other Galilean moons by Galileo Galilei in 1610." },

    # Saturn's moons
    { "name": "Mimas", "extendsPlanet": "Saturn", "size": 0.8, "position": 17, "rotationSpeed": 0.029, "orbitSpeed": 0.005, "id_planet": 7, "sizeOriginal": 396.4, "positionOriginal": 185539, "rotationSpeedOriginal": 0.942, "orbitSpeedOriginal": 5.76,
      "description": "Mimas is known for its large impact crater called Herschel.", "history": "It was discovered by William Herschel in 1789." },
    { "name": "Rhea", "extendsPlanet": "Saturn", "size": 1.4, "position": 20, "rotationSpeed": 0.024, "orbitSpeed": 0.004, "id_planet": 7, "sizeOriginal": 1529.4, "positionOriginal": 527108, "rotationSpeedOriginal": 4.518, "orbitSpeedOriginal": 3.6,
      "description": "Rhea is Saturn's second-largest moon and has a heavily cratered surface.", "history": "It was discovered by Giovanni Cassini in 1672." },
    { "name": "Dione", "extendsPlanet": "Saturn", "size": 2.6, "position": 25, "rotationSpeed": 0.026, "orbitSpeed": 0.007, "id_planet": 7, "sizeOriginal": 1122.8, "positionOriginal": 377396, "rotationSpeedOriginal": 2.736, "orbitSpeedOriginal": 10.8,
      "description": "Dione is known for its heavily cratered surface and bright streaks.", "history": "It was discovered by Giovanni Cassini in 1684." },
    { "name": "Iapetus", "extendsPlanet": "Saturn", "size": 1.8, "position": 30, "rotationSpeed": 0.031, "orbitSpeed": 0.006, "id_planet": 7, "sizeOriginal": 1471.6, "positionOriginal": 3560820, "rotationSpeedOriginal": 79.321, "orbitSpeedOriginal": 108,
      "description": "Iapetus has a striking two-tone coloration and is known for its equatorial ridge.", "history": "It was discovered by Giovanni Cassini in 1671." },
    { "name": "Titan", "extendsPlanet": "Saturn", "size": 5.0, "position": 37, "rotationSpeed": 0.021, "orbitSpeed": 0.003, "id_planet": 7, "sizeOriginal": 5150, "positionOriginal": 1221870, "rotationSpeedOriginal": 15.945, "orbitSpeedOriginal": 21.24,
      "description": "Titan is the largest moon of Saturn and has a thick atmosphere.", "history": "It was discovered by Christiaan Huygens in 1655." },

    # Uranus' moons
    { "name": "Miranda", "extendsPlanet": "Uranus", "size": 1.3, "position": 14, "rotationSpeed": 0.039, "orbitSpeed": 0.007, "id_planet": 8, "sizeOriginal": 471.6, "positionOriginal": 129390, "rotationSpeedOriginal": 1.413, "orbitSpeedOriginal": 4.68,
      "description": "Miranda is known for its unique and varied terrain.", "history": "It was discovered by Gerard P. Kuiper in 1948." },
    { "name": "Ariel", "extendsPlanet": "Uranus", "size": 2.1, "position": 18, "rotationSpeed": 0.034, "orbitSpeed": 0.006, "id_planet": 8, "sizeOriginal": 1158.4, "positionOriginal": 190900, "rotationSpeedOriginal": 2.52, "orbitSpeedOriginal": 6.48,
      "description": "Ariel is one of Uranus' five major moons and has a relatively young and bright surface.", "history": "It was discovered by William Lassell in 1851." },
    { "name": "Oberon", "extendsPlanet": "Uranus", "size": 2.4, "position": 23, "rotationSpeed": 0.026, "orbitSpeed": 0.005, "id_planet": 8, "sizeOriginal": 1522.8, "positionOriginal": 583520, "rotationSpeedOriginal": 13.463, "orbitSpeedOriginal": 7.2,
      "description": "Oberon is the outermost major moon of Uranus and has a heavily cratered surface.", "history": "It was discovered by William Herschel in 1787." },
    { "name": "Titania", "extendsPlanet": "Uranus", "size": 2.5, "position": 30, "rotationSpeed": 0.023, "orbitSpeed": 0.004, "id_planet": 8, "sizeOriginal": 1575.8, "positionOriginal": 436300, "rotationSpeedOriginal": 8.706, "orbitSpeedOriginal": 5.16,
      "description": "Titania is the largest of Uranus' moons and has a relatively bland and cratered surface.", "history": "It was discovered by William Herschel in 1787." },
    { "name": "Umbriel", "extendsPlanet": "Uranus", "size": 2.0, "position": 37, "rotationSpeed": 0.031, "orbitSpeed": 0.005, "id_planet": 8, "sizeOriginal": 1169.4, "positionOriginal": 265970, "rotationSpeedOriginal": 4.144, "orbitSpeedOriginal": 4.68,
      "description": "Umbriel is known for its heavily cratered surface and dark patches.", "history": "It was discovered by William Lassell in 1851." },
     
    # Neptune's moons
    { "name": "Triton", "extendsPlanet": "Neptune", "size": 5, "position": 10, "rotationSpeed": 0.023, "orbitSpeed": 0.005, "id_planet": 9, "sizeOriginal": 2706.8, "positionOriginal": 354800, "rotationSpeedOriginal": -5.877, "orbitSpeedOriginal": 76.32,
      "description": "Triton is the largest moon of Neptune and is unique for its retrograde orbit.", "history": "It was discovered by William Lassell in 1846, just 17 days after Neptune was discovered." },
    { "name": "Nereida", "extendsPlanet": "Neptune", "size": 2, "position": 25, "rotationSpeed": 0.027, "orbitSpeed": 0.006, "id_planet": 9, "sizeOriginal": 170.6, "positionOriginal": 5513810, "rotationSpeedOriginal": 360.136, "orbitSpeedOriginal": 5.4,
      "description": "Nereida is a small irregular moon of Neptune.", "history": "It was discovered in 1949 by Gerard P. Kuiper." },

]
  


# Execute a command: this creates a new table
cur.execute('DROP TABLE IF EXISTS moonsData CASCADE;')
cur.execute('CREATE TABLE moonsData ('
            'id_moon SERIAL PRIMARY KEY,'
            'name VARCHAR(32) NOT NULL,'
            'extendsPlanet VARCHAR(32) NOT NULL,'
            'size NUMERIC(5, 2) NOT NULL,'
            'position SMALLINT NOT NULL,'
            'rotationSpeed NUMERIC(5, 4) NOT NULL,'
            'orbitSpeed NUMERIC(4, 3) NOT NULL,'
            'id_planet SMALLINT,'
            'sizeOriginal NUMERIC(7, 2),'
            'positionOriginal INTEGER,'
            'rotationSpeedOriginal NUMERIC(6, 3),'
            'orbitSpeedOriginal NUMERIC(6, 3),'
            'description TEXT,'
            'history TEXT);')


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
    INSERT INTO moonsData (name, extendsPlanet, id_planet, size, position, rotationSpeed, orbitSpeed, 
                          sizeOriginal, positionOriginal, rotationSpeedOriginal, orbitSpeedOriginal,
                          description, history)
    VALUES (%(name)s, %(extends_planet)s, %(id_planet)s, %(size)s, %(position)s, %(rotationSpeed)s, %(orbitSpeed)s,
            %(sizeOriginal)s, %(positionOriginal)s, %(rotationSpeedOriginal)s, %(orbitSpeedOriginal)s,
            %(description)s, %(history)s);
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
        'id_planet': moon['id_planet'],
        'sizeOriginal': moon['sizeOriginal'],
        'positionOriginal': moon['positionOriginal'],
        'rotationSpeedOriginal': moon['rotationSpeedOriginal'],
        'orbitSpeedOriginal': moon['orbitSpeedOriginal'],
        'description': moon['description'],
        'history': moon['history']
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