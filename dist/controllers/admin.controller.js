"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyBarber = exports.getAllBarbers = exports.getAllUsers = exports.getDashboardStats = exports.loginAdmin = exports.registerAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_model_1 = __importDefault(require("../models/Admin.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const Barber_model_1 = __importDefault(require("../models/Barber.model"));
const errorHandler_middleware_1 = require("../middleware/errorHandler.middleware");
// Generate JWT Token
const generateToken = (id, userType) => {
    return jsonwebtoken_1.default.sign({ id, userType }, process.env.JWT_SECRET || 'secret', { expiresIn: (process.env.JWT_EXPIRE || '7d') });
};
// Register Admin
const registerAdmin = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        // Only super_admin can create other admins
        if (req.user && req.user.role !== 'super_admin') {
            return next(new errorHandler_middleware_1.AppError('Only super admin can create admins', 403));
        }
        const existingAdmin = await Admin_model_1.default.findOne({ email });
        if (existingAdmin) {
            return next(new errorHandler_middleware_1.AppError('Admin already exists', 400));
        }
        const admin = await Admin_model_1.default.create({
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
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.registerAdmin = registerAdmin;
// Login Admin
const loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new errorHandler_middleware_1.AppError('Please provide email and password', 400));
        }
        const admin = await Admin_model_1.default.findOne({ email }).select('+password');
        if (!admin || !(await admin.comparePassword(password))) {
            return next(new errorHandler_middleware_1.AppError('Invalid credentials', 401));
        }
        if (!admin.isActive) {
            return next(new errorHandler_middleware_1.AppError('Account is deactivated', 403));
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
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.loginAdmin = loginAdmin;
// Get Dashboard Stats
const getDashboardStats = async (_req, res, next) => {
    try {
        const totalUsers = await User_model_1.default.countDocuments({ isActive: true });
        const totalBarbers = await Barber_model_1.default.countDocuments({ isActive: true });
        const verifiedBarbers = await Barber_model_1.default.countDocuments({ isActive: true, isVerified: true });
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
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.getDashboardStats = getDashboardStats;
// Get All Users
const getAllUsers = async (_req, res, next) => {
    try {
        const users = await User_model_1.default.find().select('-password').sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: { users },
        });
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.getAllUsers = getAllUsers;
// Get All Barbers
const getAllBarbers = async (_req, res, next) => {
    try {
        const barbers = await Barber_model_1.default.find().select('-password').sort({ createdAt: -1 });
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
// Verify Barber
const verifyBarber = async (req, res, next) => {
    try {
        const { barberId } = req.params;
        const barber = await Barber_model_1.default.findByIdAndUpdate(barberId, { isVerified: true }, { new: true });
        if (!barber) {
            return next(new errorHandler_middleware_1.AppError('Barber not found', 404));
        }
        res.status(200).json({
            success: true,
            data: { barber },
        });
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.verifyBarber = verifyBarber;
//# sourceMappingURL=admin.controller.js.map