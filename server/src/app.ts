import express, { Express } from 'express';
import authRoutes from './routes/auth';
import postRoutes from './routes/post';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import userRoutes from './routes/user'
const app: Express = express();

// Middleware
// Increase body size limits to allow larger post payloads (images/base64 etc.)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', postRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Blog Platform API!' });
});

export default app;


