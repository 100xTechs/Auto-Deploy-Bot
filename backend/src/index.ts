import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


// Import routes
import authRouter from './routes/authRoute';
import { API_PREFIX, PORT } from './globle';

const app = express();


dotenv.config();

app.use(express.json());
app.use(cors());

// Use routes
app.use(API_PREFIX + '/auth', authRouter);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});