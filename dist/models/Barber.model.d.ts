import mongoose, { Document } from 'mongoose';
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
        duration: number;
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
declare const _default: mongoose.Model<IBarber, {}, {}, {}, mongoose.Document<unknown, {}, IBarber> & IBarber & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Barber.model.d.ts.map