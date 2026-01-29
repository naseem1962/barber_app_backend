import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  profileImage?: string;
  faceShape?: string;
  hairType?: 'curly' | 'straight' | 'wavy' | 'thin';
  hairDensity?: 'low' | 'medium' | 'high';
  preferences?: {
    preferredStyles?: string[];
    preferredBarbers?: mongoose.Types.ObjectId[];
  };
  loyaltyPoints?: number;
  loyaltyLevel?: 'bronze' | 'silver' | 'gold' | 'platinum';
  streakCount?: number;
  lastHaircutDate?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
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
      trim: true,
    },
    profileImage: {
      type: String,
    },
    faceShape: {
      type: String,
      enum: ['oval', 'round', 'square', 'heart', 'diamond', 'oblong'],
    },
    hairType: {
      type: String,
      enum: ['curly', 'straight', 'wavy', 'thin'],
    },
    hairDensity: {
      type: String,
      enum: ['low', 'medium', 'high'],
    },
    preferences: {
      preferredStyles: [String],
      preferredBarbers: [{ type: Schema.Types.ObjectId, ref: 'Barber' }],
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
    loyaltyLevel: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum'],
      default: 'bronze',
    },
    streakCount: {
      type: Number,
      default: 0,
    },
    lastHaircutDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
