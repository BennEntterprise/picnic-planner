import { DailyForecast, DailyForecastList } from './index';

type Coords = {
  latitude: number;
  longitude: number;
};

interface IWeatherService {
  readonly apiUrl?: string;
  readonly apiKey?: string;

  /**
   *
   * @param zipCode - The zip code to look up.
   * @returns A promise that resolves to the weather api's understanding of how to query a certain location.
   */
  getLatLongFromZip(zipCode: string): Promise<Coords>;

  /**
   *
   * @param id - The location id to look up.
   * @returns A single day forecast for the location.
   */
  getForecast(id: string | number): Promise<any>;
}

export type { Coords, IWeatherService };
