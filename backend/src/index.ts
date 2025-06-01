import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRouter from './routes/authRoute';
import projectRouter from './routes/projectRoute';
import deploymentRouter from './routes/deploymentRoute';
import webhookRouter from './routes/webhookRoute';
import { API_PREFIX, PORT } from './globle';

const app = express();

dotenv.config();

app.use(cors());

// Special middleware for webhook endpoints to preserve raw body for signature verification
app.use('/api/webhook/github', express.raw({ type: 'application/json' }));

// Regular JSON parsing for other routes
app.use(express.json());

// Use routes
app.use(API_PREFIX + '/auth', authRouter);
app.use(API_PREFIX + '/projects', projectRouter);
app.use(API_PREFIX + '/deployments', deploymentRouter);
app.use('/api/webhook', webhookRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});