import path from 'path';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config';

import './db.js';

import contactsRouter from './routes/contactsRouter.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/usersRoutes.js';

import authMiddleware from './middlewares/auth.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

const app = express();

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

app.use('/avatars', express.static(path.resolve('public/avatars')));

app.use('/api/contacts', authMiddleware, contactsRouter);
app.use('/users', authRoutes);
app.use('/users', userRoutes);

app.use('/api-docs', swaggerDocs());

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log('Server is running. Use our API on port: 3000');
});
