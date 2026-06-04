import express, { Express } from 'express';
import authRoutes from './routes/auth';
import cookieParser from 'cookie-parser';

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Blog Platform API!' });
});

export default app;


