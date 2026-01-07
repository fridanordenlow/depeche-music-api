import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express.types.js';
import UserLibraryItem from '../models/UserLibraryItem.js';
import { getMusicData } from '../services/musicCacheService.js';
import MusicCache from '../models/MusicCache.js';
import mongoose from 'mongoose';

// Function for library/add endpoint
export const addToUserLibrary = async (req: AuthenticatedRequest, res: Response) => {
  const { spotifyItemId, itemType, status } = req.body;
  const userId = req.userId;
  const token = req.spotifyToken;

  if (!userId) return res.status(400).json({ error: 'User not authenticated' });
  if (!spotifyItemId || !itemType) {
    return res.status(400).json({ error: 'Missing required fields: spotifyItemId or itemType' });
  }

  try {
    const newItem = new UserLibraryItem({
      userId,
      spotifyItemId,
      itemType,
      status,
    });

    await newItem.save();

    // Fetch metadata through the music cache service if needed
    // It will either fetch from DB or Spotify API
    const metadata = await getMusicData(spotifyItemId, itemType, token as string);

    res.status(201).json({
      message: 'New item added to user library',
      newItem, // The user library item
      metadata, // The MusicCacheData for the item
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Item already in library' });
    }
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Function for library/get endpoint
export const getUserLibrary = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  // Early return if no userId
  if (!userId) return res.status(400).json({ error: 'User not authenticated' });

  try {
    // const userObjectId = new mongoose.Types.ObjectId(userId);

    // Items sorted descending, latest items first
    const libraryItems = await UserLibraryItem.find({ userId }).sort({ addedAt: -1 });

    if (libraryItems.length === 0) return res.status(200).json([]); // Return empty array if no items

    const spotifyIds = libraryItems.map((item) => item.spotifyItemId);

    // $in = query operator to search for matches in an array
    const cachedMetadata = await MusicCache.find({ spotifyId: { $in: spotifyIds } });

    // Create a map for quick lookup of cached metadata
    const cacheMap = new Map(cachedMetadata.map((meta) => [meta.spotifyId, meta.data]));

    const libraryWithMetadata = await Promise.all(
      libraryItems.map(async (item) => {
        const metadata = cacheMap.get(item.spotifyItemId);
        if (metadata) {
          return { ...item.toObject(), metadata: metadata };
        } else {
          const freshData = await getMusicData(item.spotifyItemId, item.itemType, req.spotifyToken as string);
          return { ...item.toObject(), metadata: freshData };
        }
      })
    );

    res.status(200).json(libraryWithMetadata);
  } catch (error: any) {
    console.error('Library Error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// TODO : Implement other library management functions (remove, update status, etc.)
