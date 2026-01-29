import mongoose, { Document } from 'mongoose';
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
declare const _default: any;
export default _default;
//# sourceMappingURL=Appointment.model.d.ts.map