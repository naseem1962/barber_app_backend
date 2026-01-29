import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const registerUser: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const loginUser: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getCurrentUser: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateUserProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=user.controller.d.ts.map