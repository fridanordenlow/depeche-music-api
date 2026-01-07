import { Router } from 'express';
import { addToUserLibrary, getUserLibrary, removeUserLibraryItem } from '../controllers/libraryController.js';
import { userAuth } from '../middlewares/userAuth.js';
import { attachAccessToken } from '../middlewares/spotifyAuth.js';

export const libraryRouter: Router = Router();

libraryRouter.post('/add', userAuth, attachAccessToken, addToUserLibrary);
libraryRouter.get('/get', userAuth, attachAccessToken, getUserLibrary);
libraryRouter.delete('/remove/:itemId', userAuth, removeUserLibraryItem);
// Add update route later
