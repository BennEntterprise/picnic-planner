import { IWeatherService } from '../types/IWeatherService';
import OpenMeteoWeatherService from './OpenMeteoWeatherService';

type TWeatherService = 'openMeteo';

// TODO: Adapt this to be more generic, keyed of TWeatherService and not a narrow equality check.
export const isWeatherServiceType = (
  serviceType: string,
): serviceType is TWeatherService => {
  if (serviceType === 'openMeteo') {
    return true;
  } else {
    return false;
  }
};

export class WeatherServiceFactory {
  static createWeatherService(
    serviceType: TWeatherService = 'openMeteo',
  ): IWeatherService {
    switch (serviceType) {
      case 'openMeteo':
        return this.createOpenMeteoService();
      default:
        return this.createOpenMeteoService();
    }
  }

  private static createOpenMeteoService(): OpenMeteoWeatherService {
    return new OpenMeteoWeatherService();
  }
}
