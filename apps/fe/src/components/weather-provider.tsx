import { createContext, useContext, useState, type ReactNode } from 'react';
import { formatDate, getDatesForNextTwoWeeks } from '@/lib/date-utils';
import { mockForecastData, mockHistoricalData } from '@/lib/mock-data';
import type {
  DailyForecast,
  HistoricalData,
  WeatherContextType,
} from '@/lib/types';

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [forecastData] = useState<DailyForecast[]>(mockForecastData);
  const [historicalData] =
    useState<Record<string, HistoricalData>>(mockHistoricalData);
  const [selectedDate, setSelectedDate] = useState<string | null>(
    formatDate(new Date()),
  );

  const isLoading = false; // TODO: Simulate loading state
  const [error] = useState<string | null>(null);

  // Get the next two weeks of dates
  const dates = getDatesForNextTwoWeeks();

  // Mock function to simulate loading historical data
  async function loadHistoricalDataForDate(date: string) {
    // Historical data is already loaded from mock data
    // This is just a placeholder function
    console.log(date);
    return Promise.resolve();
  }

  return (
    <WeatherContext.Provider
      value={{
        forecastData,
        historicalData,
        selectedDate,
        setSelectedDate,
        isLoading,
        error,
        loadHistoricalDataForDate,
        dates,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
