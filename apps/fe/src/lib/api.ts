import type { DailyForecastList, HistoricalData } from './types';
import { format, parseISO } from 'date-fns';

// Default coordinates (can be made configurable)
const DEFAULT_LATITUDE = 40.7128;
const DEFAULT_LONGITUDE = -74.006;

type HistoricalDataBlob = {
  date: string;
  temperature_2m_max: number;
  temperature_2m_min: number;
  precipitation_sum: number;
  windspeed_10m_max: number;
  relativehumidity_2m_max: number;
  sunshine_duration: number;
};

// A type that represents the union of all historical data blob keys
type HistoricalDataKeys = keyof HistoricalDataBlob;

export async function fetchForecastData(): Promise<DailyForecastList> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');

  // Set query parameters
  url.searchParams.append('latitude', DEFAULT_LATITUDE.toString());
  url.searchParams.append('longitude', DEFAULT_LONGITUDE.toString());
  url.searchParams.append('daily', 'temperature_2m_max');
  url.searchParams.append('daily', 'temperature_2m_min');
  url.searchParams.append('daily', 'apparent_temperature_max');
  url.searchParams.append('daily', 'precipitation_sum');
  url.searchParams.append('daily', 'precipitation_hours');
  url.searchParams.append('daily', 'precipitation_probability_max');
  url.searchParams.append('daily', 'windspeed_10m_max');
  url.searchParams.append('daily', 'windgusts_10m_max');
  url.searchParams.append('daily', 'winddirection_10m_dominant');
  url.searchParams.append('daily', 'uv_index_max');
  url.searchParams.append('daily', 'relativehumidity_2m_max');
  url.searchParams.append('daily', 'cloudcover_max');
  url.searchParams.append('timezone', 'auto');

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the API response into our DailyForecast format
    return data.daily.time.map((date: string, index: number) => ({
      date,
      temperature_2m_max: data.daily.temperature_2m_max[index],
      temperature_2m_min: data.daily.temperature_2m_min[index],
      apparent_temperature_max: data.daily.apparent_temperature_max[index],
      precipitation_sum: data.daily.precipitation_sum[index],
      precipitation_hours: data.daily.precipitation_hours[index],
      precipitation_probability_max:
        data.daily.precipitation_probability_max[index],
      windspeed_10m_max: data.daily.windspeed_10m_max[index],
      windgusts_10m_max: data.daily.windgusts_10m_max[index],
      winddirection_10m_dominant: data.daily.winddirection_10m_dominant[index],
      uv_index_max: data.daily.uv_index_max[index],
      relativehumidity_2m_max: data.daily.relativehumidity_2m_max[index],
      cloudcover_max: data.daily.cloudcover_max[index],
    }));
  } catch (error) {
    console.error('Error fetching forecast data:', error);
    throw error;
  }
}

export async function fetchHistoricalData(
  date: string,
): Promise<HistoricalData> {
  // Extract month and day from the date
  const parsedDate = parseISO(date);
  const monthDay = format(parsedDate, 'MM-dd');

  // We'll fetch data for this date over the past 10 years
  const historicalData: Array<HistoricalDataBlob> = [];
  const currentYear = new Date().getFullYear();

  // Create an array of promises for parallel fetching
  const fetchPromises = [];

  for (let i = 1; i <= 10; i++) {
    const year = currentYear - i;
    const startDate = `${year}-${monthDay}`;
    const endDate = startDate; // Same day

    const url = new URL('https://archive-api.open-meteo.com/v1/archive');
    url.searchParams.append('latitude', DEFAULT_LATITUDE.toString());
    url.searchParams.append('longitude', DEFAULT_LONGITUDE.toString());
    url.searchParams.append('start_date', startDate);
    url.searchParams.append('end_date', endDate);
    url.searchParams.append('daily', 'temperature_2m_max');
    url.searchParams.append('daily', 'temperature_2m_min');
    url.searchParams.append('daily', 'precipitation_sum');
    url.searchParams.append('daily', 'windspeed_10m_max');
    url.searchParams.append('daily', 'relativehumidity_2m_max');
    url.searchParams.append('daily', 'sunshine_duration');
    url.searchParams.append('timezone', 'auto');

    fetchPromises.push(fetch(url.toString()).then((res) => res.json()));
  }

  try {
    const results = await Promise.all(fetchPromises);

    // Process the results
    results.forEach((data) => {
      if (data.daily && data.daily.time && data.daily.time.length > 0) {
        historicalData.push({
          date: data.daily.time[0],
          temperature_2m_max: data.daily.temperature_2m_max[0],
          temperature_2m_min: data.daily.temperature_2m_min[0],
          precipitation_sum: data.daily.precipitation_sum[0],
          windspeed_10m_max: data.daily.windspeed_10m_max[0],
          relativehumidity_2m_max: data.daily.relativehumidity_2m_max[0],
          sunshine_duration: data.daily.sunshine_duration[0],
        });
      }
    });

    // Calculate statistics
    // TODO: Fix the `as casting` here.
    const rainyDays = historicalData.filter(
      (day) => day.precipitation_sum > 1,
    ).length;
    const calculateStats = (key: HistoricalDataKeys) => {
      const values = historicalData
        .map((day) => day[key])
        .filter((val) => val !== null && !isNaN(val as number));
      if (values.length === 0) return { min: 0, max: 0, avg: 0 };

      return {
        min: Math.min(...(values as number[])),
        max: Math.max(...(values as number[])),
        avg:
          (values as number[]).reduce(
            (sum: number, val: number) => sum + val,
            0,
          ) / values.length,
      };
    };

    return {
      temperature_2m_max: calculateStats('temperature_2m_max'),
      temperature_2m_min: calculateStats('temperature_2m_min'),
      precipitation_sum: calculateStats('precipitation_sum'),
      windspeed_10m_max: calculateStats('windspeed_10m_max'),
      relativehumidity_2m_max: calculateStats('relativehumidity_2m_max'),
      sunshine_duration: calculateStats('sunshine_duration'),
      rainy_days: rainyDays,
    };
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
}
