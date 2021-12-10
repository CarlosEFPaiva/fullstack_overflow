import { Request, Response } from 'express';
import { newQuestion } from './protocols/newQuestions';

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
