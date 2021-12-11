import { newUser, userParameters } from '../protocols/users';

import * as usersRepository from '../repositories/usersRepository';

import { generateToken } from '../utils/externalLibs/tokenGenerator';

export async function addNewUser(user: newUser) {
    const savedUser = usersRepository.getUser({ name: user.name });
    if (savedUser) {
        // throw error
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
