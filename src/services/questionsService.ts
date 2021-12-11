import { answerParams, newQuestion } from '../protocols/questions';

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
    let savedUser = await usersService.getUser({ name: student });

    if (savedUser) {
        if (savedUser.className !== className) {
            // throw error incorrect class
        }
    } else {
        savedUser = await usersService.addNewUser({ name: student, className });
    }

    const savedQuestion = await questionsRepository
        .add({
            question,
            studentId: savedUser.id,
            listOfTags,
        });
    return savedQuestion.id;
}

export async function answerQuestion({ answer, user, questionId }: answerParams) {
    const answeredQuestion = await questionsRepository.answerQuestion({ answer, user, questionId });
    if (!answeredQuestion) {
        // throw error
    }
    return answeredQuestion;
}
