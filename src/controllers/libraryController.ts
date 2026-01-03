import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express.types.js';
import UserLibraryItem from '../models/UserLibraryItem.js';
import { getMusicData } from '../services/musicCacheService.js';

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
    // It will eiither fetch from DB or Spotify API
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
