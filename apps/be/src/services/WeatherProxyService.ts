import { createClient } from 'redis';
import { Coords, IWeatherService } from '../types/IWeatherService';
import { DailyForecast, DailyForecastList } from '../types/index';

const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
class WeatherServiceProxy implements IWeatherService {
  apiUrl?: string;
  apiKey?: string;
  private realService;
  private cache: ReturnType<typeof createClient>;

  constructor(realService: IWeatherService) {
    this.realService = realService;
    this.cache = createClient({
      socket: {
        host: REDIS_HOST,
        port: REDIS_PORT,
      },
    });
    this.cache
      .connect()
      // .then((d) => console.log(d))
      .catch(console.error);
  }

  async getForecast(id: string | number): Promise<any> {
    return this.realService.getForecast(id);
  }

  async getLatLongFromZip(zipCode: string): Promise<Coords> {
    // Check cache first
    console.info('Checking cache for zip code:', zipCode);
    const cachedResult = await this.cache.get(`${zipCode}`);
    if (cachedResult) {
      console.info('Cache hit for zip code:', zipCode);
      const coords = JSON.parse(cachedResult) as Coords;
      return { ...coords, cached: true } as Coords;
    } else {
      console.info('Cache miss for zip code:', zipCode);
    }

    // Call the real service if not in cache
    const result = await this.realService.getLatLongFromZip(zipCode);

    // Store result in cache
    console.info('Storing result in cache for zip code:', zipCode);
    await this.cache.set(`${zipCode}`, JSON.stringify(result), {
      EX: 60 * 60 * 24 * 635, // 1 Year (Postal Codes -> Coords isn't very dynamic)
      NX: true, // Only set if not already set,
    });
    return result;
  }
}

export default WeatherServiceProxy;
