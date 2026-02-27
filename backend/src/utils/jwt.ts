// backend/src/utils/jwt.ts
import { sign, verify, decode, SignOptions } from 'jsonwebtoken';
import { config } from '@/config';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  collegeId?: string;
}

export const generateToken = (payload: JwtPayload): string => {
  return sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as any);
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return verify(token, config.jwt.secret) as JwtPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return decode(token) as JwtPayload;
  } catch (error) {
    return null;
  }
};
