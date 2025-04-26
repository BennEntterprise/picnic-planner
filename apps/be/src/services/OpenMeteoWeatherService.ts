import { DailyForecast, MultiDayForecast } from '../types/DailyForecast';
import { IWeatherService } from '../types/IWeatherService';
import { Coords } from '../types/IWeatherService';

class OpenMeteoWeatherService implements IWeatherService {
  apiKey?: string | undefined;
  apiUrl: string = 'https://api.open-meteo.com/v1/forecast';

  constructor() {
    this.apiKey = process.env.OPEN_METEO_API_KEY || undefined;

    if (!this.apiKey) {
      console.warn(
        'No Open Meteo API key provided. Some features may not work as expected, especially if you hit rate limits.',
      );
    }
  }

  async getLatLongFromZip(zipCode: string): Promise<Coords> {
    const zipCodesAPIKey = process.env.ZIP_CODES_API_KEY || 'DEMOAPIKEY';
    // TODO: This is tightly coupled, probably should be a separate service
    const url = `https://api.zip-codes.com/ZipCodesAPI.svc/1.0/GetZipCodeDetails/${zipCode}?key=${zipCodesAPIKey}`;
    const data = await fetch(url).then((res) => {
      console.info(res);
      return res.json();
    });
    if (!data?.item?.Latitude || !data?.item?.Longitude) {
      console.error('Error fetching data:', data);
      throw new Error('Coordinates not found');
    }
    const coords: Coords = {
      latitude: data.item.Latitude,
      longitude: data.item.Longitude,
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
