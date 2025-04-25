import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 3001;
const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// TODO: Tightend up the types on the request and response objects
app.post('/api/search-zip', (req: any, res: any) => {
  try {
    const { zipCode } = req.body;
    const response = fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=12790&count=10&language=en&format=json`,
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        return data;
      });
    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Add a test API endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
