import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.middleware';
import User from '../models/User.model';
import Barber from '../models/Barber.model';
import Admin from '../models/Admin.model';

export interface AuthRequest extends Request {
  user?: any;
  userType?: 'user' | 'barber' | 'admin';
}

export const authenticate = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    
    let user;
    if (decoded.userType === 'user') {
      user = await User.findById(decoded.id).select('-password');
    } else if (decoded.userType === 'barber') {
      user = await Barber.findById(decoded.id).select('-password');
    } else if (decoded.userType === 'admin') {
      user = await Admin.findById(decoded.id).select('-password');
    } else {
      throw new AppError('Invalid token', 401);
    }

    if (!user) {
      throw new AppError('User not found', 404);
    }

    req.user = user;
    req.userType = decoded.userType;
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!roles.includes(req.userType || '')) {
      return next(new AppError('Access denied', 403));
    }

    next();
  };
};
