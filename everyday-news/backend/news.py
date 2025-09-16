import os
import requests
from pprint import pprint
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("NEWS_API_KEY")
country = "ph"

def get_news_headlines(title: str):

    if not title:
        raise Exception("Please provide a valid title")
    
    response = requests.get(f"https://newsapi.org/v2/top-headlines?country=us&apiKey={API_KEY}")

    if response.status_code != 200:
        raise Exception("Error fetching data")
    
    data = response.json()
    articles = []

    if "articles" in data:
        for article in data["articles"]:
            articles.append({
                "title": article["title"],
                "description": article["description"],
                "content": article["content"],
                "author": article["author"],
                "publishedAt": article["publishedAt"],
                "urlToImage": article["urlToImage"]
            })
    return articles



