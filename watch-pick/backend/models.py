from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base


Base = declarative_base()

class Favorite(Base):
    __tablename__ = "favorites"  

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    imdbID = Column(String, unique=True, index=True)
    title = Column(String)
    year = Column(String)
    type = Column(String)
    poster = Column(String)