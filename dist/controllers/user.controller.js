"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = exports.getCurrentUser = exports.loginUser = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_model_1 = __importDefault(require("../models/User.model"));
const errorHandler_middleware_1 = require("../middleware/errorHandler.middleware");
// Generate JWT Token
const generateToken = (id, userType) => {
    return jsonwebtoken_1.default.sign({ id, userType }, process.env.JWT_SECRET || 'secret', { expiresIn: (process.env.JWT_EXPIRE || '7d') });
};
// Register User
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;
        // Check if user exists
        const existingUser = await User_model_1.default.findOne({ email });
        if (existingUser) {
            return next(new errorHandler_middleware_1.AppError('User already exists', 400));
        }
        // Create user
        const user = await User_model_1.default.create({
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
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.registerUser = registerUser;
// Login User
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new errorHandler_middleware_1.AppError('Please provide email and password', 400));
        }
        const user = await User_model_1.default.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return next(new errorHandler_middleware_1.AppError('Invalid credentials', 401));
        }
        if (!user.isActive) {
            return next(new errorHandler_middleware_1.AppError('Account is deactivated', 403));
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
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.loginUser = loginUser;
// Get Current User
const getCurrentUser = async (req, res, next) => {
    try {
        const user = await User_model_1.default.findById(req.user._id);
        res.status(200).json({
            success: true,
            data: { user },
        });
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.getCurrentUser = getCurrentUser;
// Update User Profile
const updateUserProfile = async (req, res, next) => {
    try {
        const { name, phone, faceShape, hairType, hairDensity } = req.body;
        const user = await User_model_1.default.findByIdAndUpdate(req.user._id, {
            ...(name && { name }),
            ...(phone && { phone }),
            ...(faceShape && { faceShape }),
            ...(hairType && { hairType }),
            ...(hairDensity && { hairDensity }),
        }, { new: true, runValidators: true });
        res.status(200).json({
            success: true,
            data: { user },
        });
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.updateUserProfile = updateUserProfile;
//# sourceMappingURL=user.controller.js.map