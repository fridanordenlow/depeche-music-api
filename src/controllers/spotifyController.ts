import 'dotenv/config';
import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/spotifyAuthMiddleware.js';
import * as SpotifyService from '../services/spotifyService.js';
import { SpotifyPaginationQuery } from '../types/spotify.types.js';

// Refactor note: Consider creating a generic error handler to reduce repetition - handleControllerError
export const fetchArtist = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const token = req.spotifyToken as string;

  if (!id) {
    return res.status(400).json({
      error: 'Client Error',
      details: 'Artist ID is required in the request',
    });
  }

  try {
    const response = await SpotifyService.getArtist(token, id);
    return res.json(response);
  } catch (error: any) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      error: statusCode >= 500 ? 'Internal Server Error' : 'Spotify API Error',
      details: error.message,
    });
  }
};

export const fetchAlbum = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const token = req.spotifyToken as string;

  if (!id) {
    return res.status(400).json({
      error: 'Client Error',
      details: 'Album ID is required in the request',
    });
  }

  try {
    const response = await SpotifyService.getAlbum(token, id);
    return res.json(response);
  } catch (error: any) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      error: statusCode >= 500 ? 'Internal Server Error' : 'Spotify API Error',
      details: error.message,
    });
  }
};

export const fetchArtistAlbums = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const token = req.spotifyToken as string;

  if (!id) {
    return res.status(400).json({
      error: 'Client Error',
      details: 'Artist ID is required in the request',
    });
  }

  try {
    const response = await SpotifyService.getArtistAlbums(token, id);
    return res.json(response);
  } catch (error: any) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      error: statusCode >= 500 ? 'Internal Server Error' : 'Spotify API Error',
      details: error.message,
    });
  }
};

export const fetchTrack = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const token = req.spotifyToken as string;

  if (!id) {
    return res.status(400).json({
      error: 'Client Error',
      details: 'Track ID is required in the request',
    });
  }

  try {
    const response = await SpotifyService.getTrack(token, id);
    return res.json(response);
  } catch (error: any) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      error: statusCode >= 500 ? 'Internal Server Error' : 'Spotify API Error',
      details: error.message,
    });
  }
};

export const fetchNewReleases = async (req: AuthenticatedRequest, res: Response) => {
  const query = req.query as SpotifyPaginationQuery;
  const token = req.spotifyToken as string;

  const limit = query.limit ? parseInt(query.limit) : undefined;
  const offset = query.offset ? parseInt(query.offset) : undefined;

  try {
    const response = await SpotifyService.getNewReleases(token, limit, offset);
    return res.json(response);
  } catch (error: any) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      error: statusCode >= 500 ? 'Internal Server Error' : 'Spotify API Error',
      details: error.message,
    });
  }
};
