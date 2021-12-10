import joi from 'joi';
import { newQuestion } from '../../controllers/protocols/newQuestions';

export function question(sentQuestion: newQuestion) {
    const schema = joi.object({
        question: joi.string().min(3).max(2048).required(),
        student: joi.string().min(3).max(255).required(),
        className: joi.string().min(1).max(255).required(),
        tags: joi.string().min(0).max(255).required(),
    });
    return !(schema.validate(sentQuestion)).error;
}
