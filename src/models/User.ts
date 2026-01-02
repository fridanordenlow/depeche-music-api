import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  // id is automatically added by mongoose
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  // Method to compare password hashes at login
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

// Pre-save hook to hash password if it has been created or modified
// Runs automatically every time a User document is saved
userSchema.pre<IUser>('save', async function () {
  // If the password hasn't changed (only other things were modified), skip hashing
  if (!this.isModified('passwordHash')) return;

  try {
    // salt is a random and unique string added to a user's password before it is hashed
    const salt = await bcrypt.genSalt(10);
    // the password + salt is hashed and stored as passwordHash
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  } catch (error: any) {
    throw error;
  }
});

export default mongoose.model<IUser>('User', userSchema);
