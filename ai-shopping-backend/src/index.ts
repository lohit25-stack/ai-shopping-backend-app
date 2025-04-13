import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// 🔁 Health check route
app.get('/', (_req, res) => {
  res.send('✅ API is running!');
});

// ✅ (Optional) Test search route for now
app.get('/search', (req, res) => {
  const query = req.query.q || '';
  res.json({
    message: 'Mock search results',
    query,
    results: [
      { name: 'iPhone 13', price: 58999, site: 'Amazon' },
      { name: 'iPhone 13', price: 59999, site: 'Flipkart' },
    ]
  });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});