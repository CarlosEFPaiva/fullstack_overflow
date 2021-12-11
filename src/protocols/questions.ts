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
    submitAt: string,
    answer?: string,
    answeredBy?: string,
    answeredAt?: string,
}

export interface newAnswer {
    questionId: number,
    answer: string,
}

export interface answerParams extends newAnswer {
    user: savedUser,
}
