import mongoose, { Document } from 'mongoose';
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
declare const _default: any;
export default _default;
//# sourceMappingURL=Content.model.d.ts.map