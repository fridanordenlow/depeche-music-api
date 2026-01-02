import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  spotifyToken?: string;
  userId?: string; // Saved id from JWT token
}
