import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createRouter } from './routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' })); // In production replace * with your domain
app.use(express.json());

// Mount API
createRouter()
  .then((router) => {
    app.use('/api/cars', router);

    // Simple health check (Render uses it)
    app.get('/health', (_, res) => res.send('OK'));

    app.listen(PORT, () => {
      console.log(`🚀 Backend listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
  });
