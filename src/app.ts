import express from 'express';
import cors from 'cors';

import questionsRouter from './routers/questionsRouter';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/questions', questionsRouter);

export default app;
