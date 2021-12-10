import { v4 as generateTokenWithUuid } from 'uuid';

function generateToken() {
    return generateTokenWithUuid();
}

export {
    generateToken,
};
