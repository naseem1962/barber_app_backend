"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerHistory = exports.saveCustomerHistory = exports.updateAppointmentStatus = exports.getBarberAppointments = exports.getUserAppointments = exports.createAppointment = void 0;
const Appointment_model_1 = __importDefault(require("../models/Appointment.model"));
const CustomerHistory_model_1 = __importDefault(require("../models/CustomerHistory.model"));
const errorHandler_middleware_1 = require("../middleware/errorHandler.middleware");
// Create Appointment
const createAppointment = async (req, res, next) => {
    try {
        const { barberId, service, appointmentDate, notes } = req.body;
        const appointment = await Appointment_model_1.default.create({
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
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.createAppointment = createAppointment;
// Get User Appointments
const getUserAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment_model_1.default.find({ user: req.user._id })
            .populate('barber', 'name shopName rating profileImage')
            .sort({ appointmentDate: -1 });
        res.status(200).json({
            success: true,
            data: { appointments },
        });
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.getUserAppointments = getUserAppointments;
// Get Barber Appointments
const getBarberAppointments = async (req, res, next) => {
    try {
        const { status, date } = req.query;
        const query = { barber: req.user._id };
        if (status)
            query.status = status;
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            query.appointmentDate = { $gte: startDate, $lte: endDate };
        }
        const appointments = await Appointment_model_1.default.find(query)
            .populate('user', 'name email phone profileImage')
            .sort({ appointmentDate: 1 });
        res.status(200).json({
            success: true,
            data: { appointments },
        });
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.getBarberAppointments = getBarberAppointments;
// Update Appointment Status
const updateAppointmentStatus = async (req, res, next) => {
    try {
        const { appointmentId } = req.params;
        const { status } = req.body;
        const appointment = await Appointment_model_1.default.findById(appointmentId);
        if (!appointment) {
            return next(new errorHandler_middleware_1.AppError('Appointment not found', 404));
        }
        // Check authorization
        if (req.userType === 'barber' &&
            appointment.barber.toString() !== req.user._id.toString()) {
            return next(new errorHandler_middleware_1.AppError('Not authorized', 403));
        }
        if (req.userType === 'user' &&
            appointment.user.toString() !== req.user._id.toString()) {
            return next(new errorHandler_middleware_1.AppError('Not authorized', 403));
        }
        appointment.status = status;
        await appointment.save();
        res.status(200).json({
            success: true,
            data: { appointment },
        });
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.updateAppointmentStatus = updateAppointmentStatus;
// Save Customer History
const saveCustomerHistory = async (req, res, next) => {
    try {
        const { appointmentId, haircutStyle, beardLength, beardStyle, productsUsed, notes, images } = req.body;
        const history = await CustomerHistory_model_1.default.create({
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
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.saveCustomerHistory = saveCustomerHistory;
// Get Customer History
const getCustomerHistory = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const history = await CustomerHistory_model_1.default.find({
            user: userId,
            barber: req.user._id,
        })
            .populate('appointment')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: { history },
        });
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.getCustomerHistory = getCustomerHistory;
//# sourceMappingURL=appointment.controller.js.map