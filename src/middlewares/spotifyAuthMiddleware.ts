// middlewares/spotifyAuthMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { getAccessToken } from '../services/spotifyAuthService.js';

/**
 * Middleware to ensure a valid Spotify Access Token is available in the request. Runs
 * getAccessToken from authService.ts and attaches the token to req.spotifyToken.
 * Runs on every Spotify API-proxy-call.
 */

// Should I switch to declaration merging to add custom properties to Express Request object?
// See src/types/express.d.ts for that approach
export interface AuthenticatedRequest extends Request {
  spotifyToken?: string;
}

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
