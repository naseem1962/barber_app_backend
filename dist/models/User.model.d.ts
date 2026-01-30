import mongoose, { Document } from 'mongoose';
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
declare const _default: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=User.model.d.ts.map