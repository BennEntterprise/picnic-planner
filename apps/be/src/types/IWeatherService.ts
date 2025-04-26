interface IWeatherService {
  /**
   *
   * @param zipCode - The zip code to look up.
   * @returns A promise that resolves to the weather api's understanding of how to query a certain location.
   */
  lookupZipCode(zipCode: string): Promise<any>;

  /**
   *
   * @param id - The location id to look up.
   * @returns A single day forecast for the location.
   */
  getSingleDayForecast(id: string | number): Promise<any>;

  /**
   *
   * @param id - The location id to look up.
   * @param days - The number of days to forecast.
   * @returns A multi-day forecast for the location.
   */
  getNDayForecast(id: string | number, days: number): Promise<any>;
}

type DailyForecast = {
  // TODO: Can this come from the frontend?
};

export type { IWeatherService };
