import { format, parseISO } from 'date-fns';
import { Cloud, CloudRain, Sun, CloudSun } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DailyForecast } from '@/lib/types';
import { getPicnicSuitability } from '@/lib/weather-utils';

interface DayCardProps {
  date: string;
  forecast?: DailyForecast;
  isSelected: boolean;
  onSelect: () => void;
}

export function DayCard({
  date,
  forecast,
  isSelected,
  onSelect,
}: DayCardProps) {
  const parsedDate = parseISO(date);
  const dayName = format(parsedDate, 'EEE');
  const dayDate = format(parsedDate, 'MMM d');
  const isToday = format(new Date(), 'yyyy-MM-dd') === date;

  // Default values if forecast is not available
  const temp = forecast?.temperature_2m_max ?? 'N/A';
  const precipitation = forecast?.precipitation_probability_max ?? 0;

  const suitability = forecast ? getPicnicSuitability(forecast) : 'unknown';

  // Determine weather icon based on precipitation and temperature
  let WeatherIcon = Sun;
  if (forecast) {
    if (precipitation > 50) {
      WeatherIcon = CloudRain;
    } else if (precipitation > 20) {
      WeatherIcon = Cloud;
    } else if (Number(temp) < 15) {
      WeatherIcon = CloudSun;
    }
  }

  // Color based on picnic suitability
  const cardColors = {
    good: 'bg-green-100 border-green-300 hover:bg-green-200',
    fair: 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200',
    poor: 'bg-red-100 border-red-300 hover:bg-red-200',
    unknown: 'bg-gray-100 border-gray-300 hover:bg-gray-200',
  };

  return (
    <button
      onClick={onSelect}
      className={cn(
        'flex h-32 flex-col items-center justify-between rounded-lg border p-3 transition-colors',
        cardColors[suitability],
        isSelected && 'ring-2 ring-blue-500 ring-offset-2',
      )}
    >
      <div className="text-sm font-medium">
        {dayName}
        {isToday && <span className="ml-1 text-xs text-blue-600">(Today)</span>}
      </div>
      <div className="text-xs text-gray-600">{dayDate}</div>

      <WeatherIcon className="h-8 w-8 text-slate-700" />

      {forecast ? (
        <div className="mt-1 text-center">
          <div className="text-sm font-semibold">{temp}°C</div>
          <div className="text-xs text-gray-600">{precipitation}% rain</div>
        </div>
      ) : (
        <div className="mt-1 text-xs text-gray-500">No data</div>
      )}
    </button>
  );
}
