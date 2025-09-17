from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
import datetime

Base = declarative_base()

class News(Base):
    __tablename__ = "news"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    summary = Column(String)
    content = Column(Text)
    author = Column(String)
    publishedAt = Column(DateTime, default=datetime.datetime.utcnow)
    category = Column(String)
    imageUrl = Column(String)
    readTime = Column(Integer)

    history = relationship("History", back_populates="news")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    session_token = Column(String, unique=True)

    history = relationship("History", back_populates="user")


class History(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    news_id = Column(Integer, ForeignKey("news.id"), nullable=False)
    read_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="history")
    news = relationship("News", back_populates="history")
