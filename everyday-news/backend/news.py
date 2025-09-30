import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("NEWS_API_KEY")
COUNTRY = "us"  

def get_news_headlines(country: str = COUNTRY) -> list[dict]:
    url = f"https://newsapi.org/v2/top-headlines?country={country}&apiKey={API_KEY}"

    response = requests.get(url)

    if response.status_code != 200:
        raise Exception(f"Error fetching data: {response.status_code}")

    data = response.json()

    if data.get("status") != "ok":
        raise Exception(f"News API error: {data.get('message')}")

    articles = []
    for article in data.get("articles", []):
        articles.append({
            "title": article.get("title"),
            "summary": article.get("description"),
            "content": article.get("content"),
            "author": article.get("author"),
            "publishedAt": article.get("publishedAt"),
            "imageUrl": article.get("urlToImage"),
            "url": article.get("url")
        })

    return articles



