import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express.types.js';
import { getMusicData } from '../services/musicCacheService.js';
import MusicCache from '../models/MusicCache.js';
import UserRecommendation from '../models/UserRecommendation.js';
import mongoose from 'mongoose';

export const createRecommendation = async (req: AuthenticatedRequest, res: Response) => {
  const { spotifyId, type, review, isFeatured } = req.body;
  const userId = req.userId;

  if (!userId) return res.status(400).json({ error: 'User not authenticated' });
  if (!spotifyId || !type || !review) {
    return res.status(400).json({ error: 'Missing required fields: spotifyId, type, or review' });
  }

  try {
    const newRecommendation = new UserRecommendation({
      userId,
      spotifyId,
      type,
      review,
      isFeatured: isFeatured || false,
    });
    await newRecommendation.save();

    const metadata = await getMusicData(spotifyId, type, req.spotifyToken as string);

    res.status(201).json({
      message: 'Recommendation created successfully',
      recommendation: newRecommendation,
      itemName: metadata.type === 'artist' ? metadata.name : metadata.title,
    });
  } catch (error: any) {
    console.error('Could not create recommendation:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

export const getUserRecommendations = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;

  if (!userId) return res.status(400).json({ error: 'User not authenticated' });

  try {
    const recommendations = await UserRecommendation.find({ userId }).sort({ createdAt: -1 });

    if (recommendations.length === 0) return res.status(200).json([]);

    const spotifyIds = recommendations.map((rec) => rec.spotifyId);
    const cachedMetadata = await MusicCache.find({ spotifyId: { $in: spotifyIds } });

    const cacheMap = new Map(cachedMetadata.map((meta) => [meta.spotifyId, meta.data]));

    const recommendationsWithMetadata = await Promise.all(
      recommendations.map(async (rec) => {
        let metadata = cacheMap.get(rec.spotifyId);

        if (!metadata) {
          metadata = await getMusicData(rec.spotifyId, rec.type, req.spotifyToken as string);
        }

        const { fullData, externalUrl, ...cleanMetadata } = metadata as any;

        return {
          ...rec.toObject(),
          metadata: cleanMetadata,
        };
      })
    );

    res.status(200).json(recommendationsWithMetadata);
  } catch (error: any) {
    console.error('Could not fetch user recommendations:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

export const getPublicRecommendations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Get all recommendations, optionally filter by featured
    const { featured } = req.query;
    const filter = featured === 'true' ? { isFeatured: true } : {};

    const recommendations = await UserRecommendation.find(filter)
      .sort({ createdAt: -1 })
      .populate('userId', 'username spotifyId'); // Include user info

    if (recommendations.length === 0) return res.status(200).json([]);

    const spotifyIds = recommendations.map((rec) => rec.spotifyId);
    const cachedMetadata = await MusicCache.find({ spotifyId: { $in: spotifyIds } });

    const cacheMap = new Map(cachedMetadata.map((meta) => [meta.spotifyId, meta.data]));

    const recommendationsWithMetadata = await Promise.all(
      recommendations.map(async (item) => {
        let metadata = cacheMap.get(item.spotifyId);

        if (!metadata) {
          metadata = await getMusicData(item.spotifyId, item.type, req.spotifyToken as string);
        }

        const { fullData, externalUrl, ...cleanMetadata } = metadata as any;

        return {
          ...item.toObject(),
          metadata: cleanMetadata,
        };
      })
    );

    res.status(200).json(recommendationsWithMetadata);
  } catch (error: any) {
    console.error('Could not fetch public recommendations:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

export const removeRecommendation = async (req: AuthenticatedRequest, res: Response) => {
  const { recommendationId } = req.params;
  const userId = req.userId;

  if (!recommendationId || !userId)
    return res.status(400).json({ error: 'Missing recommendation ID or user is not authenticated' });
  if (!mongoose.Types.ObjectId.isValid(recommendationId))
    return res.status(400).json({ error: 'Invalid recommendation ID ' });

  try {
    const deletedItem = await UserRecommendation.findOneAndDelete({ _id: recommendationId, userId: userId });

    if (!deletedItem) {
      return res.status(404).json({ error: 'Recommendation not found or not owned by user' });
    }

    res.status(200).json({ message: 'Recommendation deleted successfully', deletedItem });
  } catch (error: any) {
    console.error('Recommendation deletion error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
