import WeatherServiceProxy from '../services/WeatherProxyService';
import { WeatherServiceFactory } from '../services/WeatherServiceFactory';

export const getForecast = async (req: any, res: any) => {
  try {
    // Validate the request body
    const zipCode = `15208`;

    // Build the weather service and inject into proxy for caching
    const weatherService =
      WeatherServiceFactory.createWeatherService('openMeteo');
    const proxyWeatherService = new WeatherServiceProxy(weatherService);

    // Attempt to get the forecast from the weather service
    const forecast = await proxyWeatherService.getForecast(zipCode);
    return res.status(200).json(forecast);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: `Internal server error: ${error}` });
  }
};

export const zipCodeToCoords = async (req: any, res: any) => {
  try {
    // Validate the request body
    const { zipCode } = req.body;

    if (!zipCode) {
      return res.status(400).json({ error: 'Zip code is required' });
    }

    // Attempt to get the coordinates from the zip code
    const weatherService =
      WeatherServiceFactory.createWeatherService('openMeteo');
    const proxyWeatherService = new WeatherServiceProxy(weatherService);
    const coords = await proxyWeatherService.getLatLongFromZip(zipCode);

    return res.status(200).json(coords);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: `Internal server error: ${error}` });
  }
};
