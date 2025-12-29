// middlewares/spotifyAuthMiddleware.ts
import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express.types.js';
import { getAccessToken } from '../services/spotifyAuthService.js';

/**
 * Middleware to ensure a valid Spotify Access Token is available in the request. Runs
 * getAccessToken from authService.ts and attaches the token to req.spotifyToken.
 * Runs on every Spotify API-proxy-call.
 */

export const attachAccessToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Get valid access token
    const token = await getAccessToken();
    // Attach to request object
    req.spotifyToken = token;
    // Proceed to next middleware/route handler
    next();
  } catch (error: any) {
    console.error('Error in attachAccessToken:', error.message);
    res.status(503).json({
      error: 'Auth service unavailable',
      details: 'Could not authenticate with Spotify API',
    });
  }
};
