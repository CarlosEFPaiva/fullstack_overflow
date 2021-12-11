import { Request, Response } from 'express';
import { newQuestion } from '../protocols/questions';

import * as isValid from '../utils/externalLibs/validation';
import * as questionsService from '../services/questionsService';

export async function createNewQuestion(req:Request, res:Response) {
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
        return res.status(201).send({ newQuestionId });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export async function answerQuestion(req: Request, res: Response) {
    const questionId = Number(req.params.id);
    const { answer } = req.body;
    if (!isValid.answer({ answer, questionId })) {
        return res.status(400).send('Error with inputs validation');
    }

    try {
        await questionsService.answerQuestion({ user: res.locals.user, answer, questionId });
        return res.sendStatus(201);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export async function getQuestionById(req: Request, res: Response) {
    const questionId = Number(req.params.id);
    if (!isValid.id(questionId)) {
        return res.status(400).send('Error with inputs validation');
    }

    try {
        const question = await questionsService.getQuestionById(questionId);
        return res.send(question);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export async function getUnansweredQuestions(req: Request, res: Response) {
    try {
        const questions = await questionsService.getUnansweredQuestions();
        return res.send(questions);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}
