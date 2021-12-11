import { Request, Response } from 'express';
import { newUser } from '../protocols/users';

import * as isValid from '../utils/externalLibs/validation';
import * as usersService from '../services/usersService';

export async function createNewUser(req:Request, res:Response) {
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
        console.error(error);
        return res.sendStatus(500);
    }
}
