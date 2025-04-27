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

  async getForecast(id: string | number): Promise<any> {
    const params = {
      latitude: 40.451147,
      longitude: -79.900948,
      daily: [
        'temperature_2m_max',
        'temperature_2m_min',
        'apparent_temperature_max',
        'weather_code',
        'showers_sum',
        'snowfall_sum',
        'rain_sum',
        'precipitation_probability_max',
      ],
      hourly: 'uv_index',
      timezone: 'America/New_York',
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
        uvIndex: hourly.variables(0)!.valuesArray()!,
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
        weatherCode: daily.variables(3)!.valuesArray()!,
        showersSum: daily.variables(4)!.valuesArray()!,
        snowfallSum: daily.variables(5)!.valuesArray()!,
        rainSum: daily.variables(6)!.valuesArray()!,
        precipitationProbabilityMax: daily.variables(7)!.valuesArray()!,
      },
    };

    // `weatherData` now contains a simple structure with arrays for datetime and weather data
    for (let i = 0; i < weatherData.hourly.time.length; i++) {
      console.log(
        weatherData.hourly.time[i].toISOString(),
        weatherData.hourly.uvIndex[i],
      );
    }
    for (let i = 0; i < weatherData.daily.time.length; i++) {
      console.log(
        weatherData.daily.time[i].toISOString(),
        weatherData.daily.temperature2mMax[i],
        weatherData.daily.temperature2mMin[i],
        weatherData.daily.apparentTemperatureMax[i],
        weatherData.daily.weatherCode[i],
        weatherData.daily.showersSum[i],
        weatherData.daily.snowfallSum[i],
        weatherData.daily.rainSum[i],
        weatherData.daily.precipitationProbabilityMax[i],
      );
    }
    return weatherData;
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
