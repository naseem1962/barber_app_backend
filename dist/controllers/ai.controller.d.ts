import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const getHairstyleRecommendation: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const predictNoShow: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getPricingRecommendation: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getBusinessInsights: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=ai.controller.d.ts.map