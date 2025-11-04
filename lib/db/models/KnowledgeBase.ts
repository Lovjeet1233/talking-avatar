import mongoose, { Schema, Model } from 'mongoose';

export interface IKnowledgeBase {
  userId: mongoose.Types.ObjectId;
  name: string;
  welcomeMessage: string;
  prompt: string;
  createdAt: Date;
  updatedAt: Date;
}

const KnowledgeBaseSchema = new Schema<IKnowledgeBase>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  welcomeMessage: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const KnowledgeBase: Model<IKnowledgeBase> = 
  mongoose.models.KnowledgeBase || mongoose.model<IKnowledgeBase>('KnowledgeBase', KnowledgeBaseSchema);

export default KnowledgeBase;

