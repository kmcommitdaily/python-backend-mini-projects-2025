from fastapi import FastAPI, HTTPException
from movies import get_movie
from fastapi.middleware.cors import CORSMiddleware
from pprint import pprint
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In dev, allow all origins (React, V0, etc.)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.get("/movies")

# def movies_endpoint(title: str):
#     try:
#         return get_movie(title)
#     except Exception as e:
#         raise HTTPException(status_code=400,  detail=str(e))

title = input("Enter title: ")

if not title:
    raise Exception("You should input title")

movies = get_movie(title)
pprint(movies)