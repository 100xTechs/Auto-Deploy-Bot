import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRouter from './routes/authRoute';

const app = express();
const PORT = process.env.PORT || 3000;
const API_PREFIX = '/api/v1';

dotenv.config();

app.use(express.json());
app.use(cors());

// Use routes
app.use(API_PREFIX + '/auth', authRouter);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});