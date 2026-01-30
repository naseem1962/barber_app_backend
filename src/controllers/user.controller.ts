import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
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

// Register User
export const registerUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('User already exists', 400));
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    const token = generateToken(user._id.toString(), 'user');

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        token,
      },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Login User
export const loginUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Invalid credentials', 401));
    }

    if (!user.isActive) {
      return next(new AppError('Account is deactivated', 403));
    }

    const token = generateToken(user._id.toString(), 'user');

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          profileImage: user.profileImage,
          loyaltyPoints: user.loyaltyPoints,
          loyaltyLevel: user.loyaltyLevel,
        },
        token,
      },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Get Current User
export const getCurrentUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Update User Profile
export const updateUserProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, phone, faceShape, hairType, hairDensity } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(faceShape && { faceShape }),
        ...(hairType && { hairType }),
        ...(hairDensity && { hairDensity }),
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};
