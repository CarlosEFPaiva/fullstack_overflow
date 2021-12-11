import { savedUser } from './users';

export interface newQuestion {
    question: string,
    student: string,
    className: string,
    tags: string,
}

export interface questionToSave {
    question: string,
    studentId: number,
    listOfTags: string[],
}

export interface savedQuestion extends newQuestion {
    id: number,
    submitAt: Date,
    answer?: string,
    answeredBy?: string,
    answeredAt?: Date,
}

export interface newAnswer {
    questionId: number,
    answer: string,
}

export interface answerParams extends newAnswer {
    user: savedUser,
}

export interface getParams {
    questionId?: number,
    unanswered?: boolean
}

export interface getQuestion extends newQuestion {
    answered: boolean,
    submitAt: string,
    answeredAt?: string,
    answeredBy?: string,
    answer?: string,
}
