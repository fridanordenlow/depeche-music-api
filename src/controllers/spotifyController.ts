import 'dotenv/config';
import { Response } from 'express';
import * as SpotifyService from '../services/spotifyService.js';
import { AuthenticatedRequest } from '../types/express.types.js';
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
    return res.json(response.items);
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

export const search = async (req: AuthenticatedRequest, res: Response) => {
  const { q, limit, offset } = req.query;
  const token = req.spotifyToken as string;

  if (!q || typeof q !== 'string') {
    return res.status(400).json({
      error: 'Client Error',
      details: 'Query parameter "q" is required and must be a string',
    });
  }

  const limitNumber = limit ? parseInt(limit as string) : undefined;
  const offsetNumber = offset ? parseInt(offset as string) : undefined;

  try {
    const response = await SpotifyService.getSearchResults(token, q, limitNumber, offsetNumber);
    return res.json(response);
  } catch (error: any) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
      error: statusCode >= 500 ? 'Internal Server Error' : 'Spotify API Error',
      details: error.message,
    });
  }
};
