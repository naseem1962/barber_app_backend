import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  user: mongoose.Types.ObjectId;
  barber: mongoose.Types.ObjectId;
  service: {
    name: string;
    duration: number;
    price: number;
  };
  appointmentDate: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  notes?: string;
  noShowProbability?: number;
  reminderSent: boolean;
  confirmationReceived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
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
    service: {
      name: {
        type: String,
        required: true,
      },
      duration: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
      default: 'pending',
    },
    notes: {
      type: String,
    },
    noShowProbability: {
      type: Number,
      min: 0,
      max: 100,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    confirmationReceived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
appointmentSchema.index({ user: 1, appointmentDate: 1 });
appointmentSchema.index({ barber: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });

export default mongoose.model<IAppointment>('Appointment', appointmentSchema);
