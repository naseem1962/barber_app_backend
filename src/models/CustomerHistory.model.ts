import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomerHistory extends Document {
  user: mongoose.Types.ObjectId;
  barber: mongoose.Types.ObjectId;
  appointment: mongoose.Types.ObjectId;
  haircutStyle: string;
  beardLength?: string;
  beardStyle?: string;
  productsUsed: string[];
  notes?: string;
  images?: string[];
  rating?: number;
  review?: string;
  createdAt: Date;
}

const customerHistorySchema = new Schema<ICustomerHistory>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    barber: {
      type: Schema.Types.ObjectId,
      ref: 'Barber',
      required: true,
    },
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
    haircutStyle: {
      type: String,
      required: true,
    },
    beardLength: {
      type: String,
    },
    beardStyle: {
      type: String,
    },
    productsUsed: [String],
    notes: {
      type: String,
    },
    images: [String],
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
customerHistorySchema.index({ user: 1, barber: 1 });
customerHistorySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model<ICustomerHistory>('CustomerHistory', customerHistorySchema);
