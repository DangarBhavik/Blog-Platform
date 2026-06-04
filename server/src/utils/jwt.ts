import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config/config';

interface TokenPayload {
    id: string;
    email: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, config.JWT_ACCESS_SECRET as string, {
        expiresIn: config.JWT_ACCESS_EXPIRES_IN as string | number,
    } as SignOptions);
};

export const generateRefreshToken = (payload: TokenPayload): string => {
    return jwt.sign(payload, config.JWT_REFRESH_SECRET as string, {
        expiresIn: config.JWT_REFRESH_EXPIRES_IN as string | number,
    } as SignOptions);
};

export const generateTokens = (payload: TokenPayload) => {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, config.JWT_ACCESS_SECRET) as TokenPayload;
    } catch (error) {
        return null;
    }
};

export const verifyRefreshToken = (token: string): TokenPayload | null => {
    try {
        return jwt.verify(token, config.JWT_REFRESH_SECRET) as TokenPayload;
    } catch (error) {
        return null;
    }
};
