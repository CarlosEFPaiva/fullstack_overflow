export interface newUser {
    name: string,
    className: string,
}

export interface receivedUser extends newUser {
    token: string,
}

export interface savedUser extends receivedUser {
    id: number,
}

export interface userParameters {
    token?: string,
    name?: string,
}
