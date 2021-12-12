import UserError from '../errors/UserError';
import { newUser, userParameters } from '../protocols/users';

import * as usersRepository from '../repositories/usersRepository';

import { generateToken } from '../utils/externalLibs/tokenGenerator';

export async function addNewUser(user: newUser) {
    const savedUser = await usersRepository.getUser({ name: user.name });
    if (savedUser) {
        throw new UserError({
            name: 'UserAlreadyExists',
            message: 'Já existe um usuário com este nome!',
        });
    }
    const token = generateToken();
    return usersRepository.upsert({
        ...user,
        token,
    });
}

export async function getUser(user: userParameters) {
    return usersRepository.getUser(user);
}
