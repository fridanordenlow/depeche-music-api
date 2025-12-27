import { Router } from 'express';

export const spotifyRouter: Router = Router();

spotifyRouter.get('/artists/:id');
spotifyRouter.get('/artists/:id/albums');
spotifyRouter.get('/albums/:id');
spotifyRouter.get('/tracks/:id');
spotifyRouter.get('/new-releases');
// Add route for search
