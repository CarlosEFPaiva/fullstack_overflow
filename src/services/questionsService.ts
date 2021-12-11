import { answerParams, getQuestion, newQuestion, savedQuestion } from '../protocols/questions';

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

    const databaseQuestion = await questionsRepository
        .add({
            question,
            studentId: savedUser.id,
            listOfTags,
        });
    return databaseQuestion.id;
}

export async function answerQuestion({ answer, user, questionId }: answerParams) {
    const answeredQuestion = await questionsRepository.answerQuestion({ answer, user, questionId });
    if (!answeredQuestion) {
        // throw error
    }
    return answeredQuestion;
}

function adjustQuestionFormat(rawQuestion: savedQuestion):getQuestion {
    const result = {
        question: rawQuestion.question,
        student: rawQuestion.student,
        className: rawQuestion.className,
        tags: rawQuestion.tags,
        answered: false,
        submitAt: datesHelper.adjustDate(rawQuestion.submitAt),
        answeredAt: datesHelper.adjustDate(rawQuestion.answeredAt),
        answeredBy: rawQuestion.answeredBy,
        answer: rawQuestion.answer,
    };

    if (rawQuestion.answer) {
        result.answered = true;
    } else {
        delete result.answer;
        delete result.answeredAt;
        delete result.answeredBy;
    }
    return result;
}

export async function getQuestionById(questionId: number): Promise<getQuestion> {
    const rawQuestion = (await questionsRepository.getQuestions({ questionId }))[0];
    if (!rawQuestion) {
        // throw Error
    }

    const result = adjustQuestionFormat(rawQuestion);
    return result;
}

export async function getUnansweredQuestions() {
    const questions = await questionsRepository.getQuestions({ unanswered: true });
    return questions.map((question) => adjustQuestionFormat(question));
}
