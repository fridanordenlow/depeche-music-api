import { Router } from 'express';
import { addToUserLibrary } from '../controllers/libraryController.js';
import { userAuth } from '../middlewares/userAuth.js';
import { attachAccessToken } from '../middlewares/spotifyAuth.js';

export const libraryRouter: Router = Router();

libraryRouter.post('/add', userAuth, attachAccessToken, addToUserLibrary);
