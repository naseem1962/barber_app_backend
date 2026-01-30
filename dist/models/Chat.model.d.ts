import mongoose, { Document } from 'mongoose';
export interface IChat extends Document {
    participants: {
        user?: mongoose.Types.ObjectId;
        barber?: mongoose.Types.ObjectId;
        admin?: mongoose.Types.ObjectId;
    };
    messages: {
        sender: mongoose.Types.ObjectId;
        senderType: 'user' | 'barber' | 'admin';
        content: string;
        messageType: 'text' | 'image' | 'file';
        read: boolean;
        createdAt: Date;
    }[];
    lastMessage?: {
        content: string;
        createdAt: Date;
    };
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IChat, {}, {}, {}, mongoose.Document<unknown, {}, IChat> & IChat & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Chat.model.d.ts.map