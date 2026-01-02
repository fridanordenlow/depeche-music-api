import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types/express.types.js';

export const userAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized', details: 'User access token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized', details: 'User access token missing or invalid' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as unknown as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error: any) {
    return res.status(403).json({ error: 'Forbidden', details: 'Invalid or expired token' });
  }
};
