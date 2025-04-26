// import { createClient } from 'redis';
// import { IWeatherService } from '../types/IWeatherService';

// class WeatherServiceProxy implements CoordinateService {
//   private realService: IWeatherServiceeatherService;
//   private cache: ReturnType<typeof createClient>;

//   constructor() {
//     this.realService = new RealCoordinateService();
//     this.cache = createClient();
//     this.cache.connect().catch(console.error);
//   }

//   async getCoordinates(zipcode: string): Promise<[number, number]> {
//     // Check cache first
//     const cachedResult = await this.cache.get(zipcode);
//     if (cachedResult) {
//       return JSON.parse(cachedResult) as [number, number];
//     }

//     // Call the real service if not in cache
//     const result = await this.realService.getCoordinates(zipcode);
//     // Store result in cache
//     await this.cache.set(zipcode, JSON.stringify(result));
//     return result;
//   }
// }
