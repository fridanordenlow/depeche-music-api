import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  spotifyToken?: string;
  // add user here later
}
