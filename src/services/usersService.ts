import { newUser } from '../controllers/protocols/newUser';

import * as usersRepository from '../repositories/usersRepository';

import { generateToken } from '../utils/externalLibs/tokenGenerator';

export async function addNewUser(user: newUser) {
    const token = generateToken();
    return usersRepository.upsert({
        ...user,
        token,
    });
}
