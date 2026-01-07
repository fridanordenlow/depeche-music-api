import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express.types.js';
import UserLibraryItem from '../models/UserLibraryItem.js';
import { getMusicData } from '../services/musicCacheService.js';
import MusicCache from '../models/MusicCache.js';
import mongoose from 'mongoose';

export const addToUserLibrary = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { spotifyItemId, itemType, status } = req.body;
    const userId = req.userId;
    const token = req.spotifyToken;

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

export const getUserLibrary = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) return res.status(400).json({ error: 'User not authenticated' });

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Items sorted descending, latest items first
    const libraryItems = await UserLibraryItem.find({ userId: userObjectId }).sort({ addedAt: -1 });

    // Search for metadata in MusicCache for each item
    const libraryWithMetadata = await Promise.all(
      libraryItems.map(async (item) => {
        let metadata = await MusicCache.findOne({
          spotifyId: item.spotifyItemId,
          type: item.itemType,
        });

        if (!metadata) {
          // If not found in cache, fetch and store it
          const data = await getMusicData(item.spotifyItemId, item.itemType, req.spotifyToken as string);
          return { ...item.toObject(), metadata: data };
        }

        return {
          ...item.toObject(),
          metadata: metadata.data,
        };
      })
    );
    res.status(200).json(libraryWithMetadata);
  } catch (error: any) {
    console.error('Library Error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// TODO : Implement other library management functions (remove, update status, etc.)
