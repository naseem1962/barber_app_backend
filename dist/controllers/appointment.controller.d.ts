import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
export declare const createAppointment: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getUserAppointments: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getBarberAppointments: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateAppointmentStatus: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const saveCustomerHistory: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getCustomerHistory: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=appointment.controller.d.ts.map