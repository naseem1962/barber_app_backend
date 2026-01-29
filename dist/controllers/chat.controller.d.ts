import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const getOrCreateChat: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const sendMessage: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getChatMessages: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getUserChats: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const markAsRead: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=chat.controller.d.ts.map