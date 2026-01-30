"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllBarbers = exports.updateBarberProfile = exports.getCurrentBarber = exports.loginBarber = exports.registerBarber = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Barber_model_1 = __importDefault(require("../models/Barber.model"));
const errorHandler_middleware_1 = require("../middleware/errorHandler.middleware");
// Generate JWT Token
const generateToken = (id, userType) => {
    return jsonwebtoken_1.default.sign({ id, userType }, process.env.JWT_SECRET || 'secret', { expiresIn: (process.env.JWT_EXPIRE || '7d') });
};
// Register Barber
const registerBarber = async (req, res, next) => {
    try {
        const { name, email, password, phone, shopName, shopAddress } = req.body;
        const existingBarber = await Barber_model_1.default.findOne({ email });
        if (existingBarber) {
            return next(new errorHandler_middleware_1.AppError('Barber already exists', 400));
        }
        const barber = await Barber_model_1.default.create({
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
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.registerBarber = registerBarber;
// Login Barber
const loginBarber = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new errorHandler_middleware_1.AppError('Please provide email and password', 400));
        }
        const barber = await Barber_model_1.default.findOne({ email }).select('+password');
        if (!barber || !(await barber.comparePassword(password))) {
            return next(new errorHandler_middleware_1.AppError('Invalid credentials', 401));
        }
        if (!barber.isActive) {
            return next(new errorHandler_middleware_1.AppError('Account is deactivated', 403));
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
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.loginBarber = loginBarber;
// Get Current Barber
const getCurrentBarber = async (req, res, next) => {
    try {
        const barber = await Barber_model_1.default.findById(req.user._id);
        res.status(200).json({
            success: true,
            data: { barber },
        });
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.getCurrentBarber = getCurrentBarber;
// Update Barber Profile
const updateBarberProfile = async (req, res, next) => {
    try {
        const updateData = req.body;
        const barber = await Barber_model_1.default.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true });
        res.status(200).json({
            success: true,
            data: { barber },
        });
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.updateBarberProfile = updateBarberProfile;
// Get All Barbers
const getAllBarbers = async (_req, res, next) => {
    try {
        const barbers = await Barber_model_1.default.find({ isActive: true, isVerified: true })
            .select('-password')
            .sort({ rating: -1 });
        res.status(200).json({
            success: true,
            data: { barbers },
        });
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.getAllBarbers = getAllBarbers;
//# sourceMappingURL=barber.controller.js.map