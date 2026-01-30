"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_middleware_1 = require("./errorHandler.middleware");
const User_model_1 = __importDefault(require("../models/User.model"));
const Barber_model_1 = __importDefault(require("../models/Barber.model"));
const Admin_model_1 = __importDefault(require("../models/Admin.model"));
const authenticate = async (req, _res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            throw new errorHandler_middleware_1.AppError('Authentication required', 401);
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
        let user;
        if (decoded.userType === 'user') {
            user = await User_model_1.default.findById(decoded.id).select('-password');
        }
        else if (decoded.userType === 'barber') {
            user = await Barber_model_1.default.findById(decoded.id).select('-password');
        }
        else if (decoded.userType === 'admin') {
            user = await Admin_model_1.default.findById(decoded.id).select('-password');
        }
        else {
            throw new errorHandler_middleware_1.AppError('Invalid token', 401);
        }
        if (!user) {
            throw new errorHandler_middleware_1.AppError('User not found', 404);
        }
        req.user = user;
        req.userType = decoded.userType;
        next();
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            next(new errorHandler_middleware_1.AppError('Invalid token', 401));
        }
        else if (error.name === 'TokenExpiredError') {
            next(new errorHandler_middleware_1.AppError('Token expired', 401));
        }
        else {
            next(error);
        }
    }
};
exports.authenticate = authenticate;
const authorize = (...roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new errorHandler_middleware_1.AppError('Authentication required', 401));
        }
        if (!roles.includes(req.userType || '')) {
            return next(new errorHandler_middleware_1.AppError('Access denied', 403));
        }
        next();
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.middleware.js.map