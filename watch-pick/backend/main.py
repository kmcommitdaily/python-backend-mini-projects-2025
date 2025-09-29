from fastapi import FastAPI, HTTPException, Depends
from movies import get_movie
from fastapi.middleware.cors import CORSMiddleware
import db
from db import SessionLocal, engine
import models
from sqlalchemy.orm import Session
from pydantic import BaseModel

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class FavoriteCreate(BaseModel):
    imdbID: str
    Title: str
    Year: str
    Type: str
    Poster: str


@app.post("/favorites")
def add_favorite(fav: FavoriteCreate, db: Session = Depends(get_db)):
   
    existing = db.query(models.Favorite).filter(models.Favorite.imdbID == fav.imdbID).first()
    if existing:
        raise HTTPException(status_code=409, detail="Movie already in favorites")

    new_fav = models.Favorite(
        imdbID=fav.imdbID,
        title=fav.Title,
        year=fav.Year,
        type=fav.Type,
        poster=fav.Poster,
    )
    db.add(new_fav)
    db.commit()
    db.refresh(new_fav)

    return {
        "imdbID": new_fav.imdbID,
        "Title": new_fav.title,
        "Year": new_fav.year,
        "Type": new_fav.type,
        "Poster": new_fav.poster,
    }

@app.get("/movies")

def movies_endpoint(title: str):
    try:
        return get_movie(title)
    except Exception as e:
        raise HTTPException(status_code=400,  detail=str(e))
    

@app.get("/favorites")
def read_favorites(db: Session = Depends(get_db)):
    favorites = db.query(models.Favorite).all()
    return [
        {
            "imdbID": fav.imdbID,
            "Title": fav.title,
            "Year": fav.year,
            "Type": fav.type,
            "Poster": fav.poster,
        }
        for fav in favorites
    ]


@app.delete("/favorites/{imdbID}")
def delete_favorite(imdbID: str, db: Session = Depends(get_db)):
    movie = db.query(models.Favorite).filter(models.Favorite.imdbID == imdbID).first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found in favorites")
    
    db.delete(movie)
    db.commit()
    return {"ok": True, "message": f"Deleted {imdbID} from favorites"}