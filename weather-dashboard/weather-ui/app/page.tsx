"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Eye, Droplets, Thermometer } from "lucide-react"

interface WeatherData {
  city: string
  temperature: number
  description: string
  humidity: number
  windSpeed: number
  visibility: number
  feelsLike: number
}

// Mock function to simulate backend call
const getWeather = async (city: string): Promise<WeatherData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock weather data
  const mockData: WeatherData = {
    city: city,
    temperature: Math.floor(Math.random() * 30) + 5,
    description: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Heavy Rain"][Math.floor(Math.random() * 5)],
    humidity: Math.floor(Math.random() * 40) + 40,
    windSpeed: Math.floor(Math.random() * 20) + 5,
    visibility: Math.floor(Math.random() * 10) + 5,
    feelsLike: Math.floor(Math.random() * 30) + 5,
  }

  return mockData
}

const getWeatherIcon = (description: string) => {
  const iconClass = "h-8 w-8 text-primary"

  if (description.toLowerCase().includes("sunny")) return <Sun className={iconClass} />
  if (description.toLowerCase().includes("rain")) return <CloudRain className={iconClass} />
  if (description.toLowerCase().includes("snow")) return <CloudSnow className={iconClass} />
  if (description.toLowerCase().includes("cloud")) return <Cloud className={iconClass} />
  return <Sun className={iconClass} />
}

export default function WeatherDashboard() {
  const [city, setCity] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!city.trim()) return

    setLoading(true)
    setError("")

    try {
      const weatherData = await getWeather(city.trim())
      setWeather(weatherData)
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Weather Dashboard</h1>
          <p className="text-muted-foreground text-sm">Get current weather for any city</p>
        </div>

        {/* Search Form */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium text-foreground">
                  City Name
                </label>
                <Input
                  id="city"
                  type="text"
                  placeholder="Enter city name..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading || !city.trim()}>
                {loading ? "Getting Weather..." : "Get Weather"}
              </Button>
            </form>

            {error && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weather Display */}
        {weather && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg">{weather.city}</span>
                {getWeatherIcon(weather.description)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Weather Info */}
              <div className="text-center space-y-1">
                <div className="text-3xl font-bold text-primary">{weather.temperature}°C</div>
                <div className="text-muted-foreground capitalize">{weather.description}</div>
              </div>

              {/* Weather Details Grid */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="flex items-center space-x-2">
                  <Thermometer className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <div className="text-muted-foreground">Feels like</div>
                    <div className="font-medium">{weather.feelsLike}°C</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <div className="text-muted-foreground">Humidity</div>
                    <div className="font-medium">{weather.humidity}%</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Wind className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <div className="text-muted-foreground">Wind</div>
                    <div className="font-medium">{weather.windSpeed} km/h</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm">
                    <div className="text-muted-foreground">Visibility</div>
                    <div className="font-medium">{weather.visibility} km</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
