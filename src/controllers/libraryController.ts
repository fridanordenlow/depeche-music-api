import { Response } from 'express';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../types/express.types.js';
import { getMusicData } from '../services/musicCacheService.js';
import UserLibraryItem from '../models/UserLibraryItem.js';
import MusicCache from '../models/MusicCache.js';

export const addToUserLibrary = async (req: AuthenticatedRequest, res: Response) => {
  const { spotifyItemId, itemType, status } = req.body;
  const userId = req.userId;

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

    const cached = await MusicCache.findOne({ spotifyId: spotifyItemId });

    res.status(201).json({
      message: 'New item added to user library',
      item: newItem,
      itemName: cached?.data.type === 'artist' ? cached.data.name : cached?.data.title,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Item already in library' });
    }
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

export const getUserLibrary = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.userId;
  // Early return if no userId
  if (!userId) return res.status(400).json({ error: 'User not authenticated' });

  try {
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
        let metadata = cacheMap.get(item.spotifyItemId);

        if (!metadata) {
          metadata = await getMusicData(item.spotifyItemId, item.itemType, req.spotifyToken as string);
        }

        const { fullData, ...cleanMetadata } = metadata as any; // Exclude fullData to reduce payload

        return {
          ...item.toObject(),
          metadata: cleanMetadata, // Only include necessary metadata (title/name, artists, imageUrl, etc.)
        };
      })
    );

    res.status(200).json(libraryWithMetadata);
  } catch (error: any) {
    console.error('Library Error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

export const updateUserLibraryItemStatus = async (req: AuthenticatedRequest, res: Response) => {
  const { itemId } = req.params;
  const { status } = req.body;
  const userId = req.userId;

  if (!itemId || !status || !userId) return res.status(400).json({ error: 'Missing required fields' });
  if (!mongoose.Types.ObjectId.isValid(itemId)) return res.status(400).json({ error: 'Invalid item ID ' });

  try {
    const updatedItem = await UserLibraryItem.findOneAndUpdate(
      { _id: itemId, userId: userId },
      { $set: { status: status } },
      { new: true } // Returns the updated document instead of the old one
    );

    if (!updatedItem) return res.status(404).json({ error: 'Item not found in user library' });

    res.status(200).json({ message: 'Status updated successfully', updatedItem });
  } catch (error: any) {
    console.error('Update Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const removeUserLibraryItem = async (req: AuthenticatedRequest, res: Response) => {
  const { itemId } = req.params;
  const userId = req.userId;

  if (!itemId || !userId) return res.status(400).json({ error: 'Missing item ID or user is not authenticated' });
  if (!mongoose.Types.ObjectId.isValid(itemId)) return res.status(400).json({ error: 'Invalid item ID ' });

  try {
    const deletedItem = await UserLibraryItem.findOneAndDelete({ _id: itemId, userId: userId });

    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found in user library' });
    }

    res.status(200).json({ message: 'Item removed from user library', deletedItem });
  } catch (error: any) {
    console.error('Library Error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
