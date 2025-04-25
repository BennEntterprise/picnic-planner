"use client"

import type React from "react"

import { useEffect } from "react"
import { format, parseISO } from "date-fns"
import { useWeather } from "./weather-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Cloud, CloudRain, Thermometer, Wind, Sun, History, CalendarDays } from "lucide-react"
import { getPicnicSuitability, getPicnicAdvice } from "@/lib/weather-utils"

interface WeatherDetailProps {
  date: string
}

export function WeatherDetail({ date }: WeatherDetailProps) {
  const { forecastData, historicalData, loadHistoricalDataForDate } = useWeather()

  const forecast = forecastData.find((d) => d.date === date)
  const historical = historicalData[date]

  useEffect(() => {
    loadHistoricalDataForDate(date)
  }, [date, loadHistoricalDataForDate])

  const formattedDate = format(parseISO(date), "EEEE, MMMM d, yyyy")
  const suitability = forecast ? getPicnicSuitability(forecast) : "unknown"
  const advice = forecast ? getPicnicAdvice(forecast) : ""

  const suitabilityColors = {
    good: "text-green-600",
    fair: "text-yellow-600",
    poor: "text-red-600",
    unknown: "text-gray-600",
  }

  const suitabilityLabels = {
    good: "Good for a picnic",
    fair: "Fair conditions for a picnic",
    poor: "Poor conditions for a picnic",
    unknown: "Unknown conditions",
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">{formattedDate}</h2>
        <p className={`mt-1 text-lg font-medium ${suitabilityColors[suitability]}`}>{suitabilityLabels[suitability]}</p>
        {advice && <p className="mt-2 text-slate-600">{advice}</p>}
      </div>

      <Tabs defaultValue="forecast">
        <TabsList className="mb-4">
          <TabsTrigger value="forecast" className="flex items-center gap-1">
            <CalendarDays className="h-4 w-4" />
            <span>Forecast</span>
          </TabsTrigger>
          <TabsTrigger value="historical" className="flex items-center gap-1">
            <History className="h-4 w-4" />
            <span>Historical Data</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forecast">
          {forecast ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <WeatherCard title="Temperature" icon={<Thermometer className="h-5 w-5 text-orange-500" />}>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Max:</span>
                    <span className="font-medium">{forecast.temperature_2m_max}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min:</span>
                    <span className="font-medium">{forecast.temperature_2m_min}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Feels like max:</span>
                    <span className="font-medium">{forecast.apparent_temperature_max}°C</span>
                  </div>
                </div>
              </WeatherCard>

              <WeatherCard title="Precipitation" icon={<CloudRain className="h-5 w-5 text-blue-500" />}>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Probability:</span>
                    <span className="font-medium">{forecast.precipitation_probability_max}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Amount:</span>
                    <span className="font-medium">{forecast.precipitation_sum} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hours:</span>
                    <span className="font-medium">{forecast.precipitation_hours} hrs</span>
                  </div>
                </div>
              </WeatherCard>

              <WeatherCard title="Wind" icon={<Wind className="h-5 w-5 text-teal-500" />}>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>Speed:</span>
                    <span className="font-medium">{forecast.windspeed_10m_max} km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Direction:</span>
                    <span className="font-medium">{forecast.winddirection_10m_dominant}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gusts:</span>
                    <span className="font-medium">{forecast.windgusts_10m_max} km/h</span>
                  </div>
                </div>
              </WeatherCard>

              <WeatherCard title="Conditions" icon={<Sun className="h-5 w-5 text-yellow-500" />}>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>UV Index:</span>
                    <span className="font-medium">{forecast.uv_index_max}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Humidity:</span>
                    <span className="font-medium">{forecast.relativehumidity_2m_max}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cloud Cover:</span>
                    <span className="font-medium">{forecast.cloudcover_max}%</span>
                  </div>
                </div>
              </WeatherCard>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-lg" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="historical">
          {historical ? (
            <div>
              <p className="mb-4 text-slate-600">Historical weather data for this date over the past 10 years:</p>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <WeatherCard title="Temperature Trends" icon={<Thermometer className="h-5 w-5 text-orange-500" />}>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span>Average Max:</span>
                      <span className="font-medium">{historical.temperature_2m_max.avg.toFixed(1)}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Min:</span>
                      <span className="font-medium">{historical.temperature_2m_min.avg.toFixed(1)}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Record High:</span>
                      <span className="font-medium">{historical.temperature_2m_max.max.toFixed(1)}°C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Record Low:</span>
                      <span className="font-medium">{historical.temperature_2m_min.min.toFixed(1)}°C</span>
                    </div>
                  </div>
                </WeatherCard>

                <WeatherCard title="Precipitation History" icon={<CloudRain className="h-5 w-5 text-blue-500" />}>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span>Average Amount:</span>
                      <span className="font-medium">{historical.precipitation_sum.avg.toFixed(1)} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Recorded:</span>
                      <span className="font-medium">{historical.precipitation_sum.max.toFixed(1)} mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rainy Days:</span>
                      <span className="font-medium">{historical.rainy_days} / 10 years</span>
                    </div>
                  </div>
                </WeatherCard>

                <WeatherCard title="Other Conditions" icon={<Cloud className="h-5 w-5 text-slate-500" />}>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between">
                      <span>Avg Wind Speed:</span>
                      <span className="font-medium">{historical.windspeed_10m_max.avg.toFixed(1)} km/h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Humidity:</span>
                      <span className="font-medium">{historical.relativehumidity_2m_max.avg.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Sunshine:</span>
                      <span className="font-medium">{historical.sunshine_duration.avg.toFixed(1)} hrs</span>
                    </div>
                  </div>
                </WeatherCard>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-slate-600">Loading historical data...</p>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-lg" />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function WeatherCard({
  title,
  icon,
  children,
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
