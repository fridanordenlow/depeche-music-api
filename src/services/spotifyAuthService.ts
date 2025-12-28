// services/spotifyAuthService.ts
import 'dotenv/config';

// const CLIENT_ID = process.env['SPOTIFY_CLIENT_ID'] as string;
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID as string;
// const CLIENT_SECRET = process.env['SPOTIFY_CLIENT_SECRET'] as string;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET as string;
// const AUTH_URL = process.env['SPOTIFY_AUTH_URL'] as string;
const AUTH_URL = process.env.SPOTIFY_AUTH_URL as string;

/**
 * Renews a Spotify Access Token via Client Credentials Flow (CCF).
 * Uses cache memory to reduce unnecessary API calls to Spotify Auth API.
 * @returns the valid Spotify Access Token
 */

// Token cache in memory
let accessToken: string | null = null;
let tokenExpiry: number = 0;

export async function getAccessToken(): Promise<string> {
  const now = Date.now();

  // Control if the token is still valid (60 seconds buffer)
  if (accessToken && tokenExpiry > now + 60000) {
    return accessToken;
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Missing Spotify Client ID or Client Secret in environment variables.');
  }

  // Base64 encode client ID and secret
  const authString = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  try {
    console.log('Requesting new Spotify access token...');
    const response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${authString}`,
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Spotify Auth Error ${response.status}: ${errorText}`);
    }

    const data = (await response.json()) as {
      access_token: string;
      expires_in: number;
    };
    // Update cache
    accessToken = data.access_token;
    tokenExpiry = now + data.expires_in * 1000; // Convert expires_in to milliseconds

    console.log('Obtained new Spotify access token.');
    return accessToken;
  } catch (error: any) {
    console.error('Error fetching Spotify access token:', error);
    throw new Error('Failed to obtain Spotify access token.');
  }
}
