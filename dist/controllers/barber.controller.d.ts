import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const registerBarber: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const loginBarber: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getCurrentBarber: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateBarberProfile: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllBarbers: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=barber.controller.d.ts.map