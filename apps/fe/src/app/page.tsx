import { WeatherCalendar } from '@/components/weather-calendar';
import { WeatherProvider } from '@/components/weather-provider';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-slate-800">
            Weather Picnic Planner
          </h1>
          <p className="text-lg text-slate-600">
            Find the perfect day for your outdoor adventure
          </p>
        </header>

        <WeatherProvider>
          <WeatherCalendar />
        </WeatherProvider>
      </div>
    </main>
  );
}
