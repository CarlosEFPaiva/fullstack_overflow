import joi from 'joi';
import { newQuestion } from '../../controllers/protocols/newQuestions';
import { newUser } from '../../controllers/protocols/newUser';

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
