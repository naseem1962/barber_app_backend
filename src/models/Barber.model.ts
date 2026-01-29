import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IBarber extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  profileImage?: string;
  shopName?: string;
  shopAddress?: string;
  shopLocation?: {
    latitude: number;
    longitude: number;
  };
  skills: string[];
  experience: number;
  rating: number;
  totalReviews: number;
  subscriptionType: 'basic' | 'pro' | 'ai_pro';
  subscriptionExpiry?: Date;
  services: {
    name: string;
    duration: number; // in minutes
    price: number;
    description?: string;
  }[];
  workingHours: {
    day: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }[];
  isVerified: boolean;
  isActive: boolean;
  earnings: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const barberSchema = new Schema<IBarber>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    profileImage: {
      type: String,
    },
    shopName: {
      type: String,
      trim: true,
    },
    shopAddress: {
      type: String,
      trim: true,
    },
    shopLocation: {
      latitude: Number,
      longitude: Number,
    },
    skills: [String],
    experience: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    subscriptionType: {
      type: String,
      enum: ['basic', 'pro', 'ai_pro'],
      default: 'basic',
    },
    subscriptionExpiry: {
      type: Date,
    },
    services: [
      {
        name: String,
        duration: Number,
        price: Number,
        description: String,
      },
    ],
    workingHours: [
      {
        day: {
          type: String,
          enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
        },
        startTime: String,
        endTime: String,
        isAvailable: {
          type: Boolean,
          default: true,
        },
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    earnings: {
      total: {
        type: Number,
        default: 0,
      },
      thisMonth: {
        type: Number,
        default: 0,
      },
      lastMonth: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
barberSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
barberSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IBarber>('Barber', barberSchema);
