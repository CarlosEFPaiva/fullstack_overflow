import { newQuestion } from '../controllers/protocols/newQuestions';

import * as usersService from './usersService';
import * as questionsRepository from '../repositories/questionsRepository';

export async function createNewQuestion(receivedQuestion: newQuestion) {
    const {
        question,
        student,
        className,
        tags,
    } = receivedQuestion;
    const listOfTags = (tags.replace(/ /g, '')).split(',');

    const savedUser = await usersService.addNewUser({ name: student, className });
    const savedQuestion = await questionsRepository
        .add({
            question,
            studentId: savedUser.id,
            listOfTags,
        });
    return savedQuestion.id;
}
