import { useEffect, useState } from 'react';
import { WeatherProvider } from './components/weather-provider';
import { WeatherCalendar } from './components/weather-calendar';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${process.env.VITE_API_URL}/api/test`)
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="App">
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
          <h1>{message}</h1>
        </div>
      </main>
    </div>
  );
}

export default App;
