// TODO: Can these move to a shared location?
// ALSO IN BACKEND, keep in sync until we have shared types
export interface DailyForecast {
  date: string;
  temperature_2m_max: number;
  temperature_2m_min: number;
  apparent_temperature_max: number;
  precipitation_sum: number;
  precipitation_hours: number;
  precipitation_probability_max: number;
  windspeed_10m_max: number;
  windgusts_10m_max: number;
  winddirection_10m_dominant: number;
  uv_index_max: number;
  relativehumidity_2m_max: number;
  cloudcover_max: number;
}

export type DailyForecastList = DailyForecast[];

export interface HistoricalStat {
  min: number;
  max: number;
  avg: number;
}

export interface HistoricalData {
  temperature_2m_max: HistoricalStat;
  temperature_2m_min: HistoricalStat;
  precipitation_sum: HistoricalStat;
  windspeed_10m_max: HistoricalStat;
  relativehumidity_2m_max: HistoricalStat;
  sunshine_duration: HistoricalStat;
  rainy_days: number;
}

export type HistoricalDataMap = Record<string, HistoricalData>;

export interface WeatherContextType {
  forecastData: DailyForecastList;
  historicalData: Record<string, HistoricalData>;
  selectedDate: string | null;
  setSelectedDate: (date: string) => void;
  isLoading: boolean;
  error: string | null;
  loadHistoricalDataForDate: (date: string) => Promise<void>;
  dates: string[];
}
