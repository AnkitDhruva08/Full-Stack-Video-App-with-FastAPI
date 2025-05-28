import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

# Database credentials from .env
DB_HOST = os.getenv("DB_HOST_1")
DB_USER = os.getenv("DB_USER_1")
DB_PASSWORD = os.getenv("DB_PASS_1")
DB_NAME = os.getenv("DB_NAME_1")
DB_PORT = os.getenv("DB_PORT_1")

# Build connection URL
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Create the engine and session
try:
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
    connection = engine.connect()
    print("Database connected successfully.")
    connection.close()
except Exception as e:
    print("Failed to connect to the database.")
    print(e)

# Declare the Base
Base = declarative_base()

# Dependency function to get a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
