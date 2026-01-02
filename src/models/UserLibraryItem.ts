import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUserLibraryItem extends Document {
  userId: Types.ObjectId;
  spotifyItemId: string;
  itemType: 'artist' | 'album' | 'track';
  status: 'love' | 'explore' | 'listened';
  addedAt: Date;
}

const UserLibraryItemSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  spotifyItemId: { type: String, required: true, index: true },
  itemType: { type: String, enum: ['artist', 'album', 'track'], required: true },
  status: { type: String, enum: ['love', 'explore', 'listened'], default: 'love' },
  addedAt: { type: Date, default: Date.now },
});

// Ensure a user cannot add the same item more than once
UserLibraryItemSchema.index({ userId: 1, spotifyItemId: 1, itemType: 1 }, { unique: true });

export default mongoose.model<IUserLibraryItem>('UserLibraryItem', UserLibraryItemSchema);
