import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const createContent: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllContent: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getActiveContent: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateContent: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteContent: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=content.controller.d.ts.map