import { Document } from 'mongoose';
export interface IAdmin extends Document {
    name: string;
    email: string;
    password: string;
    role: 'super_admin' | 'admin' | 'moderator';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
declare const _default: any;
export default _default;
//# sourceMappingURL=Admin.model.d.ts.map