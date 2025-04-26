import { DailyForecast, MultiDayForecast } from '../types/DailyForecast';
import { IWeatherService } from '../types/IWeatherService';

class OpenMeteoWeatherService implements IWeatherService {
  apiKey?: string | undefined;
  readonly apiUrl: string = 'https://api.open-meteo.com/v1/forecast';

  constructor() {
    throw new Error('OpenMeteoWeatherService is not implemented yet.');
  }

  getLatLongFromZip(zipCode: string): Promise<any> {
    throw new Error('Method not implemented.');
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
