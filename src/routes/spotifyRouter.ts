import { Router } from 'express';
import { attachAccessToken } from '../middlewares/spotifyAuthMiddleware.js';
import {
  fetchAlbum,
  fetchArtist,
  fetchArtistAlbums,
  fetchNewReleases,
  fetchTrack,
  search,
} from '../controllers/spotifyController.js';

export const spotifyRouter: Router = Router();

// Global middleware for all Spotify routes to attach access token
spotifyRouter.use(attachAccessToken);

// Sök-route: Se till att den ligger ovanför routes med parametrar (som /:id)
// så att Express inte tror att ordet "search" är ett artist-id.

spotifyRouter.get('/search', search);
spotifyRouter.get('/artists/:id', fetchArtist);
spotifyRouter.get('/artists/:id/albums', fetchArtistAlbums);
spotifyRouter.get('/albums/:id', fetchAlbum);
spotifyRouter.get('/tracks/:id', fetchTrack);
spotifyRouter.get('/new-releases', fetchNewReleases);

// Hämta artistdetaljer - GET /api/spotify/artists/{id}
// Hämta albumdetaljer - GET /api/spotify/albums/{id}
// Hämta låtdetaljer - GET /api/spotify/tracks/{id}

// Hämta albums låtar - GET /api/spotify/albums/{id}/tracks
// Hämta artists album - GET /api/spotify/artists/{id}/albums

// Generell sökning - GET /api/spotify/search
// Landningssida/Nytt - GET /api/spotify/browse/new-releases
// Populära låtar - GET /api/spotify/artists/{id}/top-tracks
