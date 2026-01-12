import { Router } from 'express';
import { attachAccessToken } from '../middlewares/spotifyAuth.js';
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

// Populära låtar - GET /api/spotify/artists/{id}/top-tracks
