import { Request, Response, NextFunction } from 'express';

import * as usersRepository from '../repositories/usersRepository';
import * as isValid from '../utils/externalLibs/validation';

export default async function validateToken(req: Request, res: Response, next: NextFunction) {
    try {
        res.locals.token = req.headers.authorization?.replace('Bearer ', '');
        if (!isValid.token(res.locals.token)) return res.status(401).send('a valid token is required for access');

        res.locals.user = await usersRepository.getUser({ token: res.locals.token });
        if (!res.locals.user) return res.status(404).send('No session was found for that token');
        return next();
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}
