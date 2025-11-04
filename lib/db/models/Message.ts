import mongoose, { Schema, Model } from 'mongoose';

export interface IMessage {
  conversationId: mongoose.Types.ObjectId;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const MessageSchema = new Schema<IMessage>({
  conversationId: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message: Model<IMessage> = 
  mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;

