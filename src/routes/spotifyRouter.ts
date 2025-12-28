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

spotifyRouter.get('/artists/:id', attachAccessToken, fetchArtist);
spotifyRouter.get('/artists/:id/albums', attachAccessToken, fetchArtistAlbums);
spotifyRouter.get('/albums/:id', attachAccessToken, fetchAlbum);
spotifyRouter.get('/tracks/:id', attachAccessToken, fetchTrack);
spotifyRouter.get('/new-releases', attachAccessToken, fetchNewReleases);
// TODO - Add route for search

// Hämta artistdetaljer - GET /api/spotify/artists/{id}
// Hämta albumdetaljer - GET /api/spotify/albums/{id}
// Hämta låtdetaljer - GET /api/spotify/tracks/{id}

// Hämta albums låtar - GET /api/spotify/albums/{id}/tracks
// Hämta artists album - GET /api/spotify/artists/{id}/albums

// Generell sökning - GET /api/spotify/search
// Landningssida/Nytt - GET /api/spotify/browse/new-releases
// Populära låtar - GET /api/spotify/artists/{id}/top-tracks
