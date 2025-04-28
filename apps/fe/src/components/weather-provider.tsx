import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { formatDate, getDatesForNextTwoWeeks } from '@/lib/date-utils';
import { mockHistoricalData } from '@/lib/mock-data';
import type {
  DailyForecastList,
  HistoricalData,
  WeatherContextType,
} from '@/lib/types';
import { fetchForecastData } from '@/lib/api';

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [forecastData, setForecastData] = useState<DailyForecastList>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const dataFromForecastAPI = await fetchForecastData().catch((error) => {
          console.error('Error fetching forecast data:', error);
        });
        if (!dataFromForecastAPI) return; // TODO: Show some UI Feedback for failed fetch
        setForecastData(dataFromForecastAPI);
      } catch (error) {
        console.error('Error fetching forecast data:', error);
      }
    }
    fetchData();
  }, []);

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
    console.info(`Loading historical data for date: ${date}`);
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
