import { NextFunction, Request, Response } from 'express';
import { newQuestion } from '../protocols/questions';

import * as isValid from '../utils/externalLibs/validation';
import * as questionsService from '../services/questionsService';

export async function createNewQuestion(req:Request, res:Response, next: NextFunction) {
    const {
        question,
        student,
        className,
        tags,
    } = req.body as newQuestion;

    if (!isValid.question({ question, student, className, tags })) {
        return res.status(400).send('Error with inputs validation');
    }

    try {
        const newQuestionId = await questionsService
            .createNewQuestion({ question, student, className, tags });
        return res.status(201).send({ id: newQuestionId });
    } catch (error) {
        if (['IncorrectClassName', 'QuestionAlreadyExists'].includes(error.name)) {
            return res.status(409).send(error.message);
        }
        return next(error);
    }
}

export async function answerQuestion(req: Request, res: Response, next: NextFunction) {
    const questionId = Number(req.params.id);
    const { answer } = req.body;
    if (!isValid.answer({ answer, questionId })) {
        return res.status(400).send('Error with inputs validation');
    }

    try {
        await questionsService.answerQuestion({ user: res.locals.user, answer, questionId });
        return res.sendStatus(201);
    } catch (error) {
        if (error.name === 'QuestionNotAnswered') {
            return res.status(400).send(error.message);
        }
        return next(error);
    }
}

export async function getQuestionById(req: Request, res: Response, next: NextFunction) {
    const questionId = Number(req.params.id);
    if (!isValid.id(questionId)) {
        return res.status(400).send('Error with inputs validation');
    }

    try {
        const question = await questionsService.getQuestionById(questionId);
        return res.send(question);
    } catch (error) {
        if (error.name === 'QuestionNotFound') {
            return res.status(404).send(error.message);
        }
        return next(error);
    }
}

export async function getUnansweredQuestions(req: Request, res: Response, next: NextFunction) {
    try {
        const questions = await questionsService.getUnansweredQuestions();
        return res.send(questions);
    } catch (error) {
        return next(error);
    }
}
