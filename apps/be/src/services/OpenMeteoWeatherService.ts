import { DailyForecast, DailyForecastList } from '../types';
import { IWeatherService } from '../types/IWeatherService';
import { Coords } from '../types/IWeatherService';
import { fetchWeatherApi } from 'openmeteo';

const openMeteoWeatherServiceAPIUrl = 'https://api.open-meteo.com/v1/forecast';
const openMeteoWeatherServiceAPIKey =
  process.env.OPEN_METEO_API_KEY || 'DEMOAPIKEY';

class OpenMeteoWeatherService implements IWeatherService {
  apiKey: string = openMeteoWeatherServiceAPIKey;
  apiUrl: string = openMeteoWeatherServiceAPIUrl;

  constructor() {
    if (!this.apiKey) {
      console.warn(
        'No Open Meteo API key provided. Some features may not work as expected, especially if you hit rate limits.',
      );
    }
  }

  async getForecast(id: string | number): Promise<DailyForecastList> {
    // TODO: Debt, This is messy with probably too many translation layers that could be simplified.
    const params = {
      latitude: 52.52,
      longitude: 13.41,
      daily: [
        'temperature_2m_max',
        'temperature_2m_min',
        'apparent_temperature_max',
        'precipitation_sum',
        'precipitation_hours',
        'precipitation_probability_max',
        'wind_speed_10m_max',
        'wind_gusts_10m_max',
        'wind_direction_10m_dominant',
        'uv_index_max',
      ],
      hourly: ['temperature_2m', 'relative_humidity_2m', 'cloud_cover_high'],
      forecast_days: 14,
    };
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const timezoneAbbreviation = response.timezoneAbbreviation();
    const latitude = response.latitude();
    const longitude = response.longitude();

    const hourly = response.hourly()!;
    const daily = response.daily()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      hourly: {
        time: [
          ...Array(
            (Number(hourly.timeEnd()) - Number(hourly.time())) /
              hourly.interval(),
          ),
        ].map(
          (_, i) =>
            new Date(
              (Number(hourly.time()) +
                i * hourly.interval() +
                utcOffsetSeconds) *
                1000,
            ),
        ),
        temperature2m: hourly.variables(0)!.valuesArray()!,
        relativeHumidity2m: hourly.variables(1)!.valuesArray()!,
        cloudCoverHigh: hourly.variables(2)!.valuesArray()!,
      },
      daily: {
        time: [
          ...Array(
            (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval(),
          ),
        ].map(
          (_, i) =>
            new Date(
              (Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) *
                1000,
            ),
        ),
        temperature2mMax: daily.variables(0)!.valuesArray()!,
        temperature2mMin: daily.variables(1)!.valuesArray()!,
        apparentTemperatureMax: daily.variables(2)!.valuesArray()!,
        precipitationSum: daily.variables(3)!.valuesArray()!,
        precipitationHours: daily.variables(4)!.valuesArray()!,
        precipitationProbabilityMax: daily.variables(5)!.valuesArray()!,
        windSpeed10mMax: daily.variables(6)!.valuesArray()!,
        windGusts10mMax: daily.variables(7)!.valuesArray()!,
        windDirection10mDominant: daily.variables(8)!.valuesArray()!,
        uvIndexMax: daily.variables(9)!.valuesArray()!,
      },
    };

    const listOfDays = [];
    for (let i = 0; i < weatherData.daily.time.length; i++) {
      const date = weatherData.daily.time[i];
      const temperature_2m_max = weatherData.daily.temperature2mMax[i];
      const temperature_2m_min = weatherData.daily.temperature2mMin[i];
      const apparent_temperature_max =
        weatherData.daily.apparentTemperatureMax[i];
      const precipitation_sum = weatherData.daily.precipitationSum[i];
      const precipitation_hours = weatherData.daily.precipitationHours[i];
      const precipitation_probability_max =
        weatherData.daily.precipitationProbabilityMax[i];
      const windspeed_10m_max = weatherData.daily.windSpeed10mMax[i];
      const windgusts_10m_max = weatherData.daily.windGusts10mMax[i];
      const winddirection_10m_dominant =
        weatherData.daily.windDirection10mDominant[i];
      const uv_index_max = weatherData.daily.uvIndexMax[i];
      const relativehumidity_2m_max = weatherData.hourly.relativeHumidity2m[i];
      const cloudcover_max = weatherData.hourly.cloudCoverHigh[i];
      const weatherForecastItem: DailyForecast = {
        date: date.toISOString().split('T')[0],
        temperature_2m_max,
        temperature_2m_min,
        apparent_temperature_max,
        precipitation_sum,
        precipitation_hours,
        precipitation_probability_max,
        windspeed_10m_max,
        windgusts_10m_max,
        winddirection_10m_dominant,
        uv_index_max,
        relativehumidity_2m_max,
        cloudcover_max,
      };
      listOfDays.push(weatherForecastItem);
    }
    const weatherForecast: DailyForecastList = [];

    return listOfDays;
  }

  async getLatLongFromZip(zipCode: string): Promise<Coords> {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${zipCode}&count=1&language=en&format=json`;
    // HACK/DEBT: Rather than searching all results we take the first (if it exists)
    const fullGeoData = await fetch(url)
      .then((res) => res.json())
      .then((data) => data?.results[0] || {})
      .catch((e) => {
        throw new Error(
          `There was an error translating the location, ${zipCode} to coordinates`,
        );
      });

    if (!fullGeoData?.latitude || !fullGeoData?.longitude) {
      throw new Error('Coordinates not found');
    }

    const coords: Coords = {
      latitude: fullGeoData.latitude,
      longitude: fullGeoData.longitude,
    };
    return coords;
  }
}

export default OpenMeteoWeatherService;
