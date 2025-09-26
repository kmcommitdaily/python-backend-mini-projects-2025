export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  feelsLike: number;
}

export async function getWeather(city: string): Promise<WeatherData> {
  const response = await fetch(
    `http://localhost:8000/weather?city=${encodeURIComponent(city)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const data = await response.json();
  const visibility_m = data.visibility ?? 0;
  const visibility_km = visibility_m / 1000;

  return {
    city: data.city,
    temperature: data.temperature,
    description: data.weather,
    humidity: data.humidity,
    windSpeed: data.wind,
    visibility: visibility_km,
    feelsLike: data.feels_like, // match your backend JSON keys
  };
}
