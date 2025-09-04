from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from models import Base

# This is the "URL" that tells SQLAlchemy where the database lives
DATABASE_URL = "sqlite:///./favorites.db"

# Create the database engine
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}  # needed only for SQLite
)

# SessionLocal is what we’ll use to talk to the DB in each request
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class all our models will extend
Base.metadata.create_all(bind=engine)
