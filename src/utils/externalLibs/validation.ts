import joi from 'joi';
import { newAnswer, newQuestion } from '../../protocols/questions';
import { newUser } from '../../protocols/users';

export function question(sentQuestion: newQuestion) {
    const schema = joi.object({
        question: joi.string().min(3).max(2048).required(),
        student: joi.string().min(3).max(255).required(),
        className: joi.string().min(1).max(255).required(),
        tags: joi.string().min(0).max(255).required(),
    });
    return !(schema.validate(sentQuestion)).error;
}

export function user(sentUser: newUser) {
    const schema = joi.object({
        name: joi.string().min(3).max(255).required(),
        className: joi.string().min(1).max(255).required(),
    });
    return !(schema.validate(sentUser)).error;
}

export function answer(sentAnswer: newAnswer) {
    const schema = joi.object({
        questionId: joi.number().min(1).required(),
        answer: joi.string().min(1).max(2048).required(),
    });
    return !(schema.validate(sentAnswer)).error;
}

export function token(sentToken: string) {
    const schema = joi.object({
        token: joi.string().guid({
            version: [
                'uuidv4',
            ],
        }).required(),
    });
    return !(schema.validate({ token: sentToken })).error;
}
