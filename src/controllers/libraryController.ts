import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express.types.js';
import UserLibraryItem from '../models/UserLibraryItem.js';

export const addToUserLibrary = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { spotifyItemId, itemType, status } = req.body;
    const userId = req.userId;

    const newItem = new UserLibraryItem({
      userId,
      spotifyItemId,
      itemType,
      status,
    });

    await newItem.save();
    res.status(201).json({
      message: 'New item added to user library',
      newItem,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Item already in library' });
    }
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
