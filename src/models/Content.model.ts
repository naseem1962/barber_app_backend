import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
  type: 'logo' | 'banner' | 'privacy_policy' | 'terms_conditions' | 'about_us';
  title?: string;
  content?: string;
  imageUrl?: string;
  isActive: boolean;
  order?: number;
  metadata?: Record<string, any>;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const contentSchema = new Schema<IContent>(
  {
    type: {
      type: String,
      enum: ['logo', 'banner', 'privacy_policy', 'terms_conditions', 'about_us'],
      required: true,
    },
    title: {
      type: String,
    },
    content: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
contentSchema.index({ type: 1, isActive: 1 });
contentSchema.index({ order: 1 });

export default mongoose.model<IContent>('Content', contentSchema);
