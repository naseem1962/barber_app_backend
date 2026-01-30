import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
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

// Register Barber
export const registerBarber = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, phone, shopName, shopAddress } = req.body;

    const existingBarber = await Barber.findOne({ email });
    if (existingBarber) {
      return next(new AppError('Barber already exists', 400));
    }

    const barber = await Barber.create({
      name,
      email,
      password,
      phone,
      shopName,
      shopAddress,
    });

    const token = generateToken(barber._id.toString(), 'barber');

    res.status(201).json({
      success: true,
      data: {
        barber: {
          id: barber._id,
          name: barber.name,
          email: barber.email,
          phone: barber.phone,
          shopName: barber.shopName,
        },
        token,
      },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Login Barber
export const loginBarber = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const barber = await Barber.findOne({ email }).select('+password');

    if (!barber || !(await barber.comparePassword(password))) {
      return next(new AppError('Invalid credentials', 401));
    }

    if (!barber.isActive) {
      return next(new AppError('Account is deactivated', 403));
    }

    const token = generateToken(barber._id.toString(), 'barber');

    res.status(200).json({
      success: true,
      data: {
        barber: {
          id: barber._id,
          name: barber.name,
          email: barber.email,
          phone: barber.phone,
          shopName: barber.shopName,
          rating: barber.rating,
          subscriptionType: barber.subscriptionType,
        },
        token,
      },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Get Current Barber
export const getCurrentBarber = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const barber = await Barber.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: { barber },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Update Barber Profile
export const updateBarberProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updateData = req.body;

    const barber = await Barber.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: { barber },
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
    const barbers = await Barber.find({ isActive: true, isVerified: true })
      .select('-password')
      .sort({ rating: -1 });

    res.status(200).json({
      success: true,
      data: { barbers },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};
