import os
from dotenv import load_dotenv
import requests

load_dotenv()

API_KEY = os.getenv("OPENWEATHER_API_KEY")


unit = os.getenv("DEFAULT_UNIT")


# response = requests.get(url)

# if response.status_code == 200:
#     data = response.json()
#     print("City:", data["name"])
#     print("Temp:", data["main"]["temp"], "°C")
#     print("Weather:", data["weather"][0]["description"])
# else:
#     print("Error:", response.status_code, response.text)


def get_weather(city: str):
    if not city:
        raise Exception("City not found", response.status_code, response.text)
    response = requests.get(f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units={unit}")
    
    if response.status_code == 200:
        data = response.json()
        print("City:", data["name"])
        print("Temp:", data["main"]["temp"], "°C")
        print("Weather:", data["weather"][0]["description"])
    else:
        raise Exception("Error fetching weather", response.status_code, response.text)

get_weather("Manila")

