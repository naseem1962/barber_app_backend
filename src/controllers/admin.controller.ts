import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.model';
import User from '../models/User.model';
import Barber from '../models/Barber.model';
import { AppError } from '../middleware/errorHandler.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

// Generate JWT Token
const generateToken = (id: string, userType: string): string => {
  return jwt.sign(
    { id, userType },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: (process.env.JWT_EXPIRE || '7d') } as jwt.SignOptions
  );
};

// Register Admin
export const registerAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Only super_admin can create other admins
    if (req.user && req.user.role !== 'super_admin') {
      return next(new AppError('Only super admin can create admins', 403));
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return next(new AppError('Admin already exists', 400));
    }

    const admin = await Admin.create({
      name,
      email,
      password,
      role: role || 'admin',
    });

    const token = generateToken(admin._id.toString(), 'admin');

    res.status(201).json({
      success: true,
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
        token,
      },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Login Admin
export const loginAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin || !(await admin.comparePassword(password))) {
      return next(new AppError('Invalid credentials', 401));
    }

    if (!admin.isActive) {
      return next(new AppError('Account is deactivated', 403));
    }

    const token = generateToken(admin._id.toString(), 'admin');

    res.status(200).json({
      success: true,
      data: {
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
        token,
      },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Get Dashboard Stats
export const getDashboardStats = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalBarbers = await Barber.countDocuments({ isActive: true });
    const verifiedBarbers = await Barber.countDocuments({ isActive: true, isVerified: true });

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalBarbers,
          verifiedBarbers,
        },
      },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Get All Users
export const getAllUsers = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { users },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Get All Barbers
export const getAllBarbers = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const barbers = await Barber.find().select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { barbers },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Verify Barber
export const verifyBarber = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { barberId } = req.params;

    const barber = await Barber.findByIdAndUpdate(
      barberId,
      { isVerified: true },
      { new: true }
    );

    if (!barber) {
      return next(new AppError('Barber not found', 404));
    }

    res.status(200).json({
      success: true,
      data: { barber },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};
