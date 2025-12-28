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
      throw new Error(`Spotify API Error ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    // console.log('Fetched Spotify data:', data);
    return data as T;
  } catch (error: any) {
    console.error('Error fetching Spotify data:', error.message);
    throw new Error('Could not complete request to Spotify API');
  }
};

export const getPrimaryImageUrl = (rawImages: RawImage[]): string => {
  const images = rawImages || [];
  return images[0]?.url || '';
};
