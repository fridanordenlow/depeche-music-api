import { Router } from 'express';
import { attachAccessToken } from '../middlewares/spotifyAuthMiddleware.js';
import {
  fetchAlbum,
  fetchArtist,
  fetchArtistAlbums,
  fetchNewReleases,
  fetchTrack,
} from '../controllers/spotifyController.js';

export const spotifyRouter: Router = Router();

// Global middleware for all Spotify routes to attach access token
spotifyRouter.use(attachAccessToken);

spotifyRouter.get('/artists/:id', fetchArtist);
spotifyRouter.get('/artists/:id/albums', fetchArtistAlbums);
spotifyRouter.get('/albums/:id', fetchAlbum);
spotifyRouter.get('/tracks/:id', fetchTrack);
spotifyRouter.get('/new-releases', fetchNewReleases);
// MONDAY TODO 2 - Add route for search

// Hämta artistdetaljer - GET /api/spotify/artists/{id}
// Hämta albumdetaljer - GET /api/spotify/albums/{id}
// Hämta låtdetaljer - GET /api/spotify/tracks/{id}

// Hämta albums låtar - GET /api/spotify/albums/{id}/tracks
// Hämta artists album - GET /api/spotify/artists/{id}/albums

// Generell sökning - GET /api/spotify/search
// Landningssida/Nytt - GET /api/spotify/browse/new-releases
// Populära låtar - GET /api/spotify/artists/{id}/top-tracks
