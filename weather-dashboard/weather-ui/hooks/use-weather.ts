"use client";
import { useEffect, useState } from "react";
import { WeatherData, getWeather } from "@/lib/weather";

export function useWeather(city: string) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!city) return;

    const fetchWeather = async () => {
      setLoading(true);
      setError("");
      try {
        const weatherData = await getWeather(city.trim());
        setWeather(weatherData);
      } catch (err) {
        setError("Failed to fetch weather data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather()
  }, [city]);

  return {
    weather,
    error,
    loading
  };
}
