import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

