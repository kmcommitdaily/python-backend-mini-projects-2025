from fastapi import FastAPI, HTTPException
from weather import get_weather
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In dev, allow all origins (React, V0, etc.)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/weather")
def weather_endpoint(city: str):
    try: 
        return get_weather(city)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

