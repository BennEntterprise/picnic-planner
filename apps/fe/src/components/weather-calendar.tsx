"use client"

import { useEffect } from "react"
import { useWeather } from "./weather-provider"
import { DayCard } from "./day-card"
import { WeatherDetail } from "./weather-detail"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function WeatherCalendar() {
  const { forecastData, selectedDate, setSelectedDate, isLoading, error, dates, loadHistoricalDataForDate } =
    useWeather()

  useEffect(() => {
    if (selectedDate) {
      loadHistoricalDataForDate(selectedDate)
    }
  }, [selectedDate, loadHistoricalDataForDate])

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-semibold text-slate-800">Next Two Weeks Forecast</h2>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
            {Array.from({ length: 14 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
            {dates.map((date) => {
              const forecast = forecastData.find((d) => d.date === date)
              return (
                <DayCard
                  key={date}
                  date={date}
                  forecast={forecast}
                  isSelected={date === selectedDate}
                  onSelect={() => setSelectedDate(date)}
                />
              )
            })}
          </div>
        )}
      </div>

      {selectedDate && <WeatherDetail date={selectedDate} />}
    </div>
  )
}
