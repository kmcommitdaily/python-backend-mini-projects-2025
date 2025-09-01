# weather.py
import os
import requests
from dotenv import load_dotenv
from pprint import pprint
load_dotenv()
API_KEY = os.getenv("OPENWEATHER_API_KEY")
unit = os.getenv("DEFAULT_UNIT")

def get_weather(city: str):
    if not city:
        raise Exception("City name is required")
    
    response = requests.get(
        f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    )
    
    if response.status_code == 200:
        data = response.json()
        # pprint(data)
        return {
            "city": data["name"],
            "temp": data["main"]["temp"],
            "feels_like": data["main"]["feels_like"],
            "humidity": data["main"]["humidity"],
            "wind": data["wind"]["speed"],
            "visibility": data["visibility"],
            "weather": data["weather"][0]["description"]
        }
    else:
        raise Exception("Error fetching weather", response.status_code, response.text)
