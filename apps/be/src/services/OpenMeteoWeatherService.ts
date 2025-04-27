import { DailyForecast, MultiDayForecast } from '../types/DailyForecast';
import { IWeatherService } from '../types/IWeatherService';
import { Coords } from '../types/IWeatherService';

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
  getSingleDayForecast(id: string | number): Promise<DailyForecast> {
    throw new Error('Method not implemented.');
  }
  getNDayForecast(
    id: string | number,
    days: number,
  ): Promise<MultiDayForecast> {
    throw new Error('Method not implemented.');
  }
  getHistoricalAlmanac(id: string | number, date: Date): Promise<any> {
    throw new Error('Method not implemented.');
  }
}

export default OpenMeteoWeatherService;
