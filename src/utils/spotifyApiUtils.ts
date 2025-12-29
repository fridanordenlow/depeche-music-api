import 'dotenv/config';
import { RawImage } from '../types/spotify.raw.js';

// const API_BASE_URL = process.env['SPOTIFY_API_BASE_URL'] as string;
const API_BASE_URL = process.env.SPOTIFY_API_BASE_URL as string; // Does this work now?

export const fetchSpotifyData = async <T>(token: string, endpointPath: string): Promise<T> => {
  const spotifyUrl = `${API_BASE_URL}${endpointPath}`;

  try {
    const response = await fetch(spotifyUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      const statusCode = response.status;

      const error = new Error(`Spotify API Error ${statusCode}`) as any;
      error.status = statusCode;
      error.details = errorText; // Raw error details from Spotify API response for logging purposes

      console.error(`Spotify API Error ${statusCode}: ${errorText}`);
      throw error;
    }
    return (await response.json()) as T;
  } catch (error: any) {
    if (error.status) throw error;
    console.error('Network or System Error:', error.message);
    const systemError = new Error('Could not complete request to Spotify API') as any;
    systemError.status = 500;
    throw systemError;
  }
};

export const getPrimaryImageUrl = (rawImages: RawImage[]): string => {
  const images = rawImages || [];
  return images[0]?.url || '';
};
