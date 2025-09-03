import os
from dotenv import load_dotenv
import requests


load_dotenv()

API_KEY = os.getenv("OMDB_API_KEY")



def get_movie(title: str):
    if not title:
        raise Exception("Please enter a title")
    
    response = requests.get(f"http://www.omdbapi.com/?apikey={API_KEY}&s={title}")

    if response.status_code != 200:
        raise Exception("Error fetching data")
    
    data = response.json()
    movies = []

    if "Search" in data:
        for movie in data["Search"]:
            movies.append({
                "imdbID": movie["imdbID"],
                "Title": movie["Title"],
                "Year": movie["Year"],
                "Type": movie["Type"],
                "Poster": movie["Poster"]
})
    return movies
    

