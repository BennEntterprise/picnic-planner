type DailyForecast = {
  // TODO: Can this come from the frontend?
};

type DateString = string & { __brand: 'DateString' };

type MultiDayForecast = Record<DateString, DailyForecast>;

export type { DailyForecast, MultiDayForecast };
