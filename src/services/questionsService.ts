import { answerParams, getQuestion, newQuestion } from '../protocols/questions';

import * as usersService from './usersService';
import * as questionsRepository from '../repositories/questionsRepository';
import * as datesHelper from '../utils/dates';

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

export async function getQuestionById(questionId: number): Promise<getQuestion> {
    const savedQuestion = (await questionsRepository.getQuestions({ questionId }))[0];
    if (!savedQuestion) {
        // throw Error
    }

    const result = {
        question: savedQuestion.question,
        student: savedQuestion.student,
        className: savedQuestion.className,
        tags: savedQuestion.tags,
        answered: false,
        submitAt: datesHelper.adjustDate(savedQuestion.submitAt),
        answeredAt: datesHelper.adjustDate(savedQuestion.answeredAt),
        answeredBy: savedQuestion.answeredBy,
        answer: savedQuestion.answer,
    };

    if (savedQuestion.answer) {
        result.answered = true;
    } else {
        delete result.answer;
        delete result.answeredAt;
        delete result.answeredBy;
    }
    return result;
}
