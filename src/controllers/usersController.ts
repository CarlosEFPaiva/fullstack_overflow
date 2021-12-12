import { Request, Response, NextFunction } from 'express';
import { newUser } from '../protocols/users';

import * as isValid from '../utils/externalLibs/validation';
import * as usersService from '../services/usersService';

export async function createNewUser(req:Request, res:Response, next: NextFunction) {
    const {
        name,
        className,
    } = req.body as newUser;

    if (!isValid.user({ name, className })) {
        return res.status(400).send('Error with inputs validation');
    }

    try {
        const savedUser = await usersService
            .addNewUser({ name, className });
        return res.status(201).send({ token: savedUser.token });
    } catch (error) {
        if (error.name === 'UserAlreadyExists') {
            return res.status(409).send(error.message);
        }
        return next(error);
    }
}
