import { Error } from '../protocols/error';

class QuestionError extends Error {
    constructor({ message, name }: Error) {
        super(message);
        this.name = name;
    }
}

export default QuestionError;
