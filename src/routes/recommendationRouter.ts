import { Router } from 'express';
import {
  createRecommendation,
  getUserRecommendations,
  getPublicRecommendations,
  removeRecommendation,
  getRecommendationById,
} from '../controllers/recommendationController.js';
import { userAuth } from '../middlewares/userAuth.js';
import { attachAccessToken } from '../middlewares/spotifyAuth.js';

export const recommendationRouter: Router = Router();

// Create a new recommendation (requires auth)
recommendationRouter.post('/create', userAuth, attachAccessToken, createRecommendation);

// Get current user's recommendations (requires auth)
recommendationRouter.get('/user', userAuth, attachAccessToken, getUserRecommendations);

// Get all recommendations (public)
recommendationRouter.get('/all', attachAccessToken, getPublicRecommendations);

// Get a specific recommendation by ID (public)
recommendationRouter.get('/:recommendationId', attachAccessToken, getRecommendationById);

// Delete a recommendation (requires auth)
recommendationRouter.delete('/remove/:recommendationId', userAuth, removeRecommendation);
