import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const registerAdmin: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const loginAdmin: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getDashboardStats: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllUsers: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllBarbers: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const verifyBarber: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=admin.controller.d.ts.map