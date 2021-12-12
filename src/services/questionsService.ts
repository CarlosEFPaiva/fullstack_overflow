import { answerParams, getQuestion, newQuestion, savedQuestion } from '../protocols/questions';

import * as usersService from './usersService';
import * as questionsRepository from '../repositories/questionsRepository';
import * as datesHelper from '../utils/dates';
import UserError from '../errors/UserError';
import QuestionError from '../errors/QuestionError';

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
            throw new UserError({
                name: 'IncorrectClassName',
                message: 'Este usuário já existe em outra classe',
            });
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
        throw new QuestionError({
            name: 'QuestionNotAnswered',
            message: `
                Não foi possível responder à pergunta. Verifique se:
                1 - O id está correto;
                2 - A pergunta já foi respondida;
                3 - Se você não está respondendo a uma pergunta feita por você mesmo;`,
        });
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
        throw new QuestionError({
            name: 'QuestionNotFound',
            message: 'Não foi encontrada nenhuma pergunta para este Id',
        });
    }

    const result = adjustQuestionFormat(rawQuestion);
    return result;
}

export async function getUnansweredQuestions() {
    const questions = await questionsRepository.getQuestions({ unanswered: true });
    return questions.map((question) => adjustQuestionFormat(question));
}
