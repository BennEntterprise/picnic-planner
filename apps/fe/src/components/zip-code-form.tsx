export const ZipCodeForm = () => {
  return (
    <div className="mb-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const zipCode = (e.target as HTMLFormElement).zipCode.value;
          // TODO: Refactor into the API service
          fetch(`${process.env.VITE_API_URL}/api/weather/zip-to-coords`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ zipCode }),
          })
            .then((response) => response.json())
            .then((data) => console.log('Response:', data))
            .catch((error) =>
              console.error('Error submitting zip code:', error),
            );
        }}
      >
        <label
          htmlFor="zipCode"
          className="block text-lg font-medium text-slate-700"
        >
          Enter your Zip Code:
        </label>
        <div className="mt-2 flex">
          <input
            type="text"
            id="zipCode"
            name="zipCode"
            className="flex-1 rounded-md border border-slate-300 px-4 py-2 text-slate-800 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            placeholder="e.g., 90210"
            required
          />
          <button
            type="submit"
            className="ml-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};
