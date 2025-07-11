// utils/jwt.ts
import jwt, { Secret } from 'jsonwebtoken';

export const signToken = (payload: object, expiresIn: string = '7d') => {
    const secret: Secret | undefined = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not defined in environment variables');
    // @ts-ignore
    return jwt.sign(payload, secret, { expiresIn });
};
