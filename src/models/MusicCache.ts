import mongoose, { Document, Schema } from 'mongoose';
import { MusicCacheData } from '../types/music.types.js';

export interface IMusicCache extends Document {
  spotifyId: string;
  type: 'album' | 'artist' | 'track';
  data: MusicCacheData; // Here I save my "cleaned" Spotify data
  cachedAt: Date;
}

const MusicCacheSchema: Schema = new Schema({
  spotifyId: { type: String, required: true, unique: true, index: true },
  type: { type: String, enum: ['album', 'artist', 'track'], required: true },
  data: { type: Schema.Types.Mixed, required: true },
  cachedAt: { type: Date, default: Date.now, expires: 86400 }, // Cache expires after 24 hours
});

export default mongoose.model<IMusicCache>('MusicCache', MusicCacheSchema);
