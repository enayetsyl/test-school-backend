import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
dotenv.config();
// import { errorHandler } from './middleware/error.middleware';
import routes from './routes';
const app = express();
// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('dev'));
// Routes
app.use('/api/v1', routes);
// Error handler
// app.use(errorHandler);
export default app;
