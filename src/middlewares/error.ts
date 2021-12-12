/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import { Request, Response, NextFunction } from 'express';

export default async function error(err: Error, req: Request, res: Response, next: NextFunction) {
    console.log('Middleware de erro: ', err);
    return res.sendStatus(500);
}
