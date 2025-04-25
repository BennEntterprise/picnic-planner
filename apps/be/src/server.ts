import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 3001;
const app = express();

// Enable CORS
app.use(cors());

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
