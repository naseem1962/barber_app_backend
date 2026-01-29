import { Response, NextFunction } from 'express';
import Appointment from '../models/Appointment.model';
import CustomerHistory from '../models/CustomerHistory.model';
import { AppError } from '../middleware/errorHandler.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

// Create Appointment
export const createAppointment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { barberId, service, appointmentDate, notes } = req.body;

    const appointment = await Appointment.create({
      user: req.user._id,
      barber: barberId,
      service,
      appointmentDate: new Date(appointmentDate),
      notes,
    });

    res.status(201).json({
      success: true,
      data: { appointment },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Get User Appointments
export const getUserAppointments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate('barber', 'name shopName rating profileImage')
      .sort({ appointmentDate: -1 });

    res.status(200).json({
      success: true,
      data: { appointments },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Get Barber Appointments
export const getBarberAppointments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, date } = req.query;

    const query: any = { barber: req.user._id };
    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date as string);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date as string);
      endDate.setHours(23, 59, 59, 999);
      query.appointmentDate = { $gte: startDate, $lte: endDate };
    }

    const appointments = await Appointment.find(query)
      .populate('user', 'name email phone profileImage')
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      success: true,
      data: { appointments },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Update Appointment Status
export const updateAppointmentStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { appointmentId } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return next(new AppError('Appointment not found', 404));
    }

    // Check authorization
    if (
      req.userType === 'barber' &&
      appointment.barber.toString() !== req.user._id.toString()
    ) {
      return next(new AppError('Not authorized', 403));
    }

    if (
      req.userType === 'user' &&
      appointment.user.toString() !== req.user._id.toString()
    ) {
      return next(new AppError('Not authorized', 403));
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      success: true,
      data: { appointment },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Save Customer History
export const saveCustomerHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { appointmentId, haircutStyle, beardLength, beardStyle, productsUsed, notes, images } = req.body;

    const history = await CustomerHistory.create({
      user: req.body.userId || req.user._id,
      barber: req.user._id,
      appointment: appointmentId,
      haircutStyle,
      beardLength,
      beardStyle,
      productsUsed,
      notes,
      images,
    });

    res.status(201).json({
      success: true,
      data: { history },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Get Customer History
export const getCustomerHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params;

    const history = await CustomerHistory.find({
      user: userId,
      barber: req.user._id,
    })
      .populate('appointment')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { history },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};
