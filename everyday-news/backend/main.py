from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import db
import models
from news import get_news_headlines
import secrets, hashlib

# Make sure tables exist
models.Base.metadata.create_all(bind=db.engine)

app = FastAPI()

# Dependency: get DB session
def get_db():
    database = db.SessionLocal()
    try:
        yield database
    finally:
        database.close()


# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- Helper functions ---
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    return secrets.token_hex(16)


# --- Auth dependency ---
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


# --- Pydantic Schemas ---
class SignupRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

class HistoryCreate(BaseModel):
    news_id: int


# --- Auth Endpoints ---
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
        session_token=None
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"ok": True, "user_id": new_user.id, "username": new_user.username}


@app.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == data.username).first()

    if not user or user.password != hash_password(data.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = generate_token()
    user.session_token = token
    db.commit()
    db.refresh(user)

    return {"ok": True, "user_id": user.id, "username": user.username, "session_token": token}


@app.post("/logout")
def logout(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.session_token = None
    db.commit()
    return {"ok": True, "message": "Logged out"}


# --- Protected Endpoints ---
@app.get("/news")
def read_news(current_user: models.User = Depends(get_current_user)):
    try:
        return get_news_headlines()
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
    return [
        {
            "history_id": h.id,
            "news_id": h.news_id,
            "title": h.news.title if h.news else None,
            "read_at": h.read_at,
        }
        for h in history
    ]


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
