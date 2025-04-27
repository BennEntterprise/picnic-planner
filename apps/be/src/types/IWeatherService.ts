import { DailyForecast, MultiDayForecast } from './DailyForecast';

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
  getSingleDayForecast(id: string | number): Promise<DailyForecast>;

  /**
   *
   * @param id - The location id to look up.
   * @param days - The number of days to forecast.
   * @returns A multi-day forecast for the location.
   */
  getNDayForecast(id: string | number, days: number): Promise<MultiDayForecast>;

  /**
   *
   * @param id - The location id to look up.
   * @returns A list of locations that match the given id.
   */
  getHistoricalAlmanac(id: string | number, date: Date): Promise<any>;
}

export type { Coords, IWeatherService };
