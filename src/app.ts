import express from 'express';
import cors from 'cors';

import questionsRouter from './routers/questionsRouter';
import usersRouter from './routers/usersRouter';

import serverMiddlewareError from './middlewares/error';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/questions', questionsRouter);
app.use('/users', usersRouter);

app.use(serverMiddlewareError);

export default app;
