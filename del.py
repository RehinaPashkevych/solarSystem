from sqlalchemy import create_engine
database_uri = 'postgresql://postgres:0000@localhost:5432/solarsystem '

try:
    engine = create_engine(database_uri)
    print("Connection successful! Database URI is correct.")
except Exception as e:
    print("Error connecting to the database. Please check the database URI.")
    print(e)