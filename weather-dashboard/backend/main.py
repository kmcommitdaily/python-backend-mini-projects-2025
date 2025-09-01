from weather import get_weather

city = input("Enter city: ")
data = get_weather(city)

wind_speed = data["wind"]
wind_kmh = wind_speed * 3.6
visibility_m = data["visibility"]
visibility_km = visibility_m / 1000
print(f"City: {data['city']}")
print(f"Temp: {data['temp']} °C")
print(f"Feels Like: {data['feels_like']} °C")
print(f"Humidity: {data['humidity']} %")
print(f"Wind: {wind_kmh:.1f} km/h")
print(f"Visibility: {visibility_km:.1f} km")
print(f"Weather: {data['weather']}")
