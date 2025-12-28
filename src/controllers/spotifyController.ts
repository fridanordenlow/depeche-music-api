import 'dotenv/config';
import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/spotifyAuthMiddleware.js';
import * as SpotifyService from '../services/spotifyService.js';
import { SpotifyPaginationQuery } from '../types/spotify.types.js';

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
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: 'Internal Server Error',
      details: message,
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
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: 'Internal Server Error',
      details: message,
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
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: 'Internal Server Error',
      details: message,
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
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: 'Internal Server Error',
      details: message,
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
    const message = error instanceof Error ? error.message : 'Unknown error';
    return res.status(500).json({
      error: 'Internal Server Error',
      details: message,
    });
  }
};

// const API_BASE_URL = process.env['SPOTIFY_API_BASE_URL'] as string;
const API_BASE_URL = process.env.SPOTIFY_API_BASE_URL as string;

// Could be renamed to forwardRequestToSpotify, sendSpotifyRequest, fetchFromSpotifyApi or spotifyApiProxyHandler
export const proxySpotifyRequest = async (req: AuthenticatedRequest, res: Response, endpointPath: string) => {
  const token = req.spotifyToken;
  const spotifyUrl = `${API_BASE_URL}${endpointPath}`;

  try {
    // Add future caching logic here (Mongo DB)

    const response = await fetch(spotifyUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const statusCode = response.status as number;
      return res.status(statusCode).json({
        error: `Spotify API Error ${statusCode}`,
        details: await response.text(),
      });
    }

    const data = await response.json();
    // Add future caching logic here (Mongo DB)
    return res.json(data);
  } catch (error: any) {
    console.error('Error proxying Spotify request:', error.message);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: 'Could not complete request to Spotify API',
    });
  }
};
