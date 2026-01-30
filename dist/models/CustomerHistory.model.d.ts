import mongoose, { Document } from 'mongoose';
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
declare const _default: any;
export default _default;
//# sourceMappingURL=CustomerHistory.model.d.ts.map