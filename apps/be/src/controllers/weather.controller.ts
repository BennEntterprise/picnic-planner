import { WeatherServiceFactory } from '../services/WeatherServiceFactory';

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
    const serviceResponse = await weatherService.getLatLongFromZip(zipCode);
    if (!serviceResponse) {
      return res.status(404).json({ error: 'Coordinates not found' });
    }

    // Parse the coordinates
    if (!serviceResponse.Latitude || !serviceResponse.Longitude) {
      return res.status(404).json({ error: 'Coordinates not found' });
    }
    const coords = {
      latitude: serviceResponse.Latitude,
      longitude: serviceResponse.Longitude,
    };

    return res.status(200).json(coords);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
