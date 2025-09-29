from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import db
import models
from news import get_news_headlines
import secrets, hashlib
from datetime import datetime


models.Base.metadata.create_all(bind=db.engine)

app = FastAPI()


def get_db():
    database = db.SessionLocal()
    try:
        yield database
    finally:
        database.close()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    return secrets.token_hex(16)



def get_current_user(
    db: Session = Depends(get_db),
    authorization: str = Header(None)
):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    token = authorization.replace("Bearer ", "")
    user = db.query(models.User).filter(models.User.session_token == token).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    return user


class SignupRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class HistoryCreate(BaseModel):
    news_id: int



@app.post("/signup")
def signup(user: SignupRequest, db: Session = Depends(get_db)):
  
    existing = db.query(models.User).filter(
        (models.User.username == user.username) |
        (models.User.email == user.email)
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Username or email already taken")


    new_user = models.User(
        username=user.username,
        email=user.email,
        password=hash_password(user.password),
        session_token=secrets.token_hex(16)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

  
    return {
        "ok": True,
        "user_id": new_user.id,
        "username": new_user.username,
        "email": new_user.email,
        "session_token": new_user.session_token
    }


@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == data.email).first()

    if not user or user.password != hash_password(data.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = generate_token()
    user.session_token = token
    db.commit()
    db.refresh(user)

    return {"ok": True, "user_id": user.id, "email": user.email,"username": user.username, "session_token": token}


@app.post("/logout")
def logout(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.session_token = None
    db.commit()
    return {"ok": True, "message": "Logged out"}



@app.get("/news")
def read_news(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    try:
        articles = get_news_headlines()

        saved_articles = []
        for article in articles:
           
            published_at = None
            if article.get("publishedAt"):
                try:
                    published_at = datetime.strptime(article["publishedAt"], "%Y-%m-%dT%H:%M:%SZ")
                except ValueError:
                    published_at = None  

            existing = db.query(models.News).filter(
                models.News.title == article["title"],
                models.News.publishedAt == published_at
            ).first()

            if not existing:
                new_article = models.News(
                    title=article["title"],
                    summary=article["summary"],
                    content=article["content"],
                    author=article["author"],
                    publishedAt=published_at,
                    category=None, 
                    imageUrl=article["imageUrl"],
                    readTime=None, 
                )
                db.add(new_article)
                db.commit()
                db.refresh(new_article)
                saved_articles.append(new_article)
            else:
                saved_articles.append(existing)

       
        return [
            {
                "id": a.id,
                "title": a.title,
                "summary": a.summary,
                "content": a.content,
                "author": a.author,
                "publishedAt": a.publishedAt.isoformat() if a.publishedAt else None,
                "imageUrl": a.imageUrl,
            }
            for a in saved_articles
        ]

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))



@app.post("/history")
def add_history(
    entry: HistoryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    news = db.query(models.News).filter(models.News.id == entry.news_id).first()
    if not news:
        raise HTTPException(status_code=404, detail="News not found")

    # ✅ Prevent duplicates
    existing = db.query(models.History).filter(
        models.History.user_id == current_user.id,
        models.History.news_id == entry.news_id
    ).first()

    if existing:
        return {
            "ok": True,
            "message": "Already in history",
            "history_id": existing.id
        }

    new_history = models.History(user_id=current_user.id, news_id=entry.news_id)
    db.add(new_history)
    db.commit()
    db.refresh(new_history)

    return {"ok": True, "history_id": new_history.id}



@app.get("/history")
def get_user_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    history = db.query(models.History).filter(models.History.user_id == current_user.id).all()

    result = []
    for h in history:
        news = h.news
        result.append({
            "history_id": h.id,
            "news_id": h.news_id,
            "title": news.title if news else "",
            "summary": news.summary if news else "",
            "content": news.content if news else "",
            "author": news.author if news else "",
            "publishedAt": news.publishedAt if news else None,
            "imageUrl": news.imageUrl if news else "",
            "read_at": h.read_at,
        })
    return result


@app.delete("/history/{history_id}")
def delete_history(
    history_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    entry = db.query(models.History).filter(
        models.History.id == history_id,
        models.History.user_id == current_user.id
    ).first()

    if not entry:
        raise HTTPException(status_code=404, detail="History not found")

    db.delete(entry)
    db.commit()
    return {"ok": True, "message": f"History {history_id} deleted"}
