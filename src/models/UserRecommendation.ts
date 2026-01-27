// models/UserRecommendation.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserRecommendation extends Document {
  userId: Types.ObjectId;
  spotifyId: string;
  type: 'album' | 'artist' | 'track';
  review: string;
  isFeatured: boolean;
  createdAt: Date;
}

const UserRecommendationSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  spotifyId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['album', 'artist', 'track'],
    required: true,
  },
  review: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1500,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// A user can only recommend the same spotifyId once
UserRecommendationSchema.index({ userId: 1, spotifyId: 1 }, { unique: true });

export default mongoose.model<IUserRecommendation>('UserRecommendation', UserRecommendationSchema);
