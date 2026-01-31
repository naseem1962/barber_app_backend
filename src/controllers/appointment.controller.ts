import { Response, NextFunction } from 'express';
import Appointment from '../models/Appointment.model';
import Barber from '../models/Barber.model';
import CustomerHistory from '../models/CustomerHistory.model';
import { AppError } from '../middleware/errorHandler.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

const SLOT_INTERVAL_MINUTES = 30;
const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;

// Create Appointment – validated: barber exists, service matches, slot available
export const createAppointment = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { barberId, service, appointmentDate, notes } = req.body;

    if (!barberId || !service?.name || service.duration == null || service.price == null || !appointmentDate) {
      return next(new AppError('barberId, service (name, duration, price), and appointmentDate are required', 400));
    }

    const barber = await Barber.findById(barberId).select('services workingHours isActive isVerified');
    if (!barber || !barber.isActive || !barber.isVerified) {
      return next(new AppError('Barber not found or not available', 404));
    }

    const barberService = barber.services?.find(
      (s: { name: string }) => s.name.toLowerCase() === String(service.name).toLowerCase()
    );
    if (!barberService) {
      return next(new AppError('Service not offered by this barber', 400));
    }

    const slotDate = new Date(appointmentDate);
    if (isNaN(slotDate.getTime())) {
      return next(new AppError('Invalid appointment date', 400));
    }

    const dayName = DAY_NAMES[slotDate.getDay()];
    const hours = barber.workingHours?.find(
      (wh: { day: string; isAvailable: boolean }) => wh.day === dayName && wh.isAvailable !== false
    );
    if (!hours?.startTime || !hours?.endTime) {
      return next(new AppError('Barber is not available on this day', 400));
    }

    const dayStart = new Date(slotDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(slotDate);
    dayEnd.setHours(23, 59, 59, 999);

    const slotEnd = new Date(slotDate.getTime() + (barberService.duration || 30) * 60 * 1000);
    const existingInRange = await Appointment.find({
      barber: barberId,
      status: { $in: ['pending', 'confirmed'] },
      appointmentDate: { $gte: dayStart, $lte: dayEnd },
    });
    const hasOverlap = existingInRange.some((apt) => {
      const aptStart = new Date(apt.appointmentDate).getTime();
      const aptEnd = aptStart + (apt.service?.duration || 30) * 60 * 1000;
      const slotStart = slotDate.getTime();
      return slotStart < aptEnd && slotEnd.getTime() > aptStart;
    });
    if (hasOverlap) {
      return next(new AppError('This time slot is no longer available', 409));
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      barber: barberId,
      service: {
        name: barberService.name,
        duration: barberService.duration,
        price: barberService.price,
      },
      appointmentDate: slotDate,
      notes: notes || undefined,
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

/** Get available time slots for a barber on a date (public, for booking). */
export const getAvailability = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { barberId, date } = req.query;
    if (!barberId || !date) {
      return next(new AppError('barberId and date are required', 400));
    }

    const barber = await Barber.findById(barberId).select('workingHours');
    if (!barber) {
      return next(new AppError('Barber not found', 404));
    }

    const d = new Date(date as string);
    if (isNaN(d.getTime())) {
      return next(new AppError('Invalid date', 400));
    }
    const dayName = DAY_NAMES[d.getDay()];
    const hours = barber.workingHours?.find(
      (wh: { day: string; isAvailable: boolean }) =>
        wh.day === dayName && wh.isAvailable !== false
    );
    if (!hours?.startTime || !hours?.endTime) {
      return res.status(200).json({
        success: true,
        data: { slots: [] },
      });
    }

    const [startH, startM] = hours.startTime.split(':').map(Number);
    const [endH, endM] = hours.endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    const slots: { time: string; display: string }[] = [];
    for (let m = startMinutes; m + SLOT_INTERVAL_MINUTES <= endMinutes; m += SLOT_INTERVAL_MINUTES) {
      const slotDate = new Date(d);
      slotDate.setHours(0, 0, 0, 0);
      slotDate.setMinutes(m);
      slotDate.setSeconds(0, 0);
      const time = slotDate.toISOString();
      const display = slotDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      slots.push({ time, display });
    }

    const dayStart = new Date(d);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(d);
    dayEnd.setHours(23, 59, 59, 999);

    const existing = await Appointment.find({
      barber: barberId,
      appointmentDate: { $gte: dayStart, $lte: dayEnd },
      status: { $in: ['pending', 'confirmed'] },
    });

    const slotDurationMs = SLOT_INTERVAL_MINUTES * 60 * 1000;
    const available = slots.filter((s) => {
      const slotStart = new Date(s.time).getTime();
      const slotEnd = slotStart + slotDurationMs;
      const overlaps = existing.some((a) => {
        const aptStart = new Date(a.appointmentDate).getTime();
        const aptEnd = aptStart + (a.service?.duration || 30) * 60 * 1000;
        return slotStart < aptEnd && slotEnd > aptStart;
      });
      return !overlaps;
    });

    res.status(200).json({
      success: true,
      data: { slots: available },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};
