import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  participants: {
    user?: mongoose.Types.ObjectId;
    barber?: mongoose.Types.ObjectId;
    admin?: mongoose.Types.ObjectId;
  };
  messages: {
    sender: mongoose.Types.ObjectId;
    senderType: 'user' | 'barber' | 'admin';
    content: string;
    messageType: 'text' | 'image' | 'file';
    read: boolean;
    createdAt: Date;
  }[];
  lastMessage?: {
    content: string;
    createdAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    participants: {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      barber: {
        type: Schema.Types.ObjectId,
        ref: 'Barber',
      },
      admin: {
        type: Schema.Types.ObjectId,
        ref: 'Admin',
      },
    },
    messages: [
      {
        sender: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        senderType: {
          type: String,
          enum: ['user', 'barber', 'admin'],
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        messageType: {
          type: String,
          enum: ['text', 'image', 'file'],
          default: 'text',
        },
        read: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lastMessage: {
      content: String,
      createdAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
chatSchema.index({ 'participants.user': 1, 'participants.barber': 1 });
chatSchema.index({ updatedAt: -1 });

export default mongoose.model<IChat>('Chat', chatSchema);
