import { addDays, format } from "date-fns"
import type { DailyForecast, HistoricalData } from "./types"

// Generate mock forecast data for the next 14 days
export const mockForecastData: DailyForecast[] = Array.from({ length: 14 }).map((_, index) => {
  const date = addDays(new Date(), index)
  const dateString = format(date, "yyyy-MM-dd")

  // Create some variation in the data
  const isRainy = Math.random() > 0.7
  const isHot = Math.random() > 0.6
  const isWindy = Math.random() > 0.8

  // Base temperature with some randomness
  const baseTemp = 22 + Math.floor(Math.random() * 10) - 5

  return {
    date: dateString,
    temperature_2m_max: isHot ? baseTemp + 10 : baseTemp,
    temperature_2m_min: baseTemp - 5 - Math.floor(Math.random() * 3),
    apparent_temperature_max: isHot ? baseTemp + 12 : baseTemp + 2,
    precipitation_sum: isRainy ? 5 + Math.random() * 15 : Math.random() * 2,
    precipitation_hours: isRainy ? 2 + Math.floor(Math.random() * 4) : 0,
    precipitation_probability_max: isRainy ? 60 + Math.floor(Math.random() * 40) : Math.floor(Math.random() * 20),
    windspeed_10m_max: isWindy ? 25 + Math.random() * 15 : 5 + Math.random() * 15,
    windgusts_10m_max: isWindy ? 35 + Math.random() * 20 : 10 + Math.random() * 15,
    winddirection_10m_dominant: Math.floor(Math.random() * 360),
    uv_index_max: isHot ? 7 + Math.random() * 4 : 3 + Math.random() * 4,
    relativehumidity_2m_max: isRainy ? 80 + Math.random() * 15 : 50 + Math.random() * 20,
    cloudcover_max: isRainy ? 70 + Math.random() * 30 : 20 + Math.random() * 40,
  }
})

// Generate mock historical data for each date
export const mockHistoricalData: Record<string, HistoricalData> = {}

// Create historical data for each of the next 14 days
Array.from({ length: 14 }).forEach((_, index) => {
  const date = addDays(new Date(), index)
  const dateString = format(date, "yyyy-MM-dd")

  // Create some variation in the historical data
  const baseTemp = 20 + Math.floor(Math.random() * 5)
  const rainyYears = Math.floor(Math.random() * 5) + 2 // 2-6 years with rain out of 10

  mockHistoricalData[dateString] = {
    temperature_2m_max: {
      min: baseTemp - 3,
      max: baseTemp + 8,
      avg: baseTemp + 2.5,
    },
    temperature_2m_min: {
      min: baseTemp - 10,
      max: baseTemp - 2,
      avg: baseTemp - 5,
    },
    precipitation_sum: {
      min: 0,
      max: 25 + Math.random() * 15,
      avg: 8 + Math.random() * 7,
    },
    windspeed_10m_max: {
      min: 5,
      max: 35 + Math.random() * 10,
      avg: 15 + Math.random() * 5,
    },
    relativehumidity_2m_max: {
      min: 40,
      max: 90,
      avg: 65 + Math.random() * 10,
    },
    sunshine_duration: {
      min: 2,
      max: 12,
      avg: 7 + Math.random() * 3,
    },
    rainy_days: rainyYears,
  }
})
