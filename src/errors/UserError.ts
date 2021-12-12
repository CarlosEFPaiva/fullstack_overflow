import { Error } from '../protocols/error';

class UserError extends Error {
    constructor({ message, name }: Error) {
        super(message);
        this.name = name;
    }
}

export default UserError;
