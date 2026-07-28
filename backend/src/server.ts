import express from 'express';
import cors from 'cors';
import quizRoutes from './routes/quizRoutes.js';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const app = express();

export const prisma = new PrismaClient();

app.use(express.json());

app.use(cors({ origin: process.env.CLIENT_URL }));

app.use(quizRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
