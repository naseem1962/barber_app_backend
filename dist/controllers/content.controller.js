"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContent = exports.updateContent = exports.getActiveContent = exports.getAllContent = exports.createContent = void 0;
const Content_model_1 = __importDefault(require("../models/Content.model"));
const errorHandler_middleware_1 = require("../middleware/errorHandler.middleware");
// Create Content
const createContent = async (req, res, next) => {
    try {
        const { type, title, content, imageUrl, order, metadata } = req.body;
        const newContent = await Content_model_1.default.create({
            type,
            title,
            content,
            imageUrl,
            order,
            metadata,
            createdBy: req.user._id,
        });
        res.status(201).json({
            success: true,
            data: { content: newContent },
        });
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.createContent = createContent;
// Get All Content
const getAllContent = async (req, res, next) => {
    try {
        const { type, isActive } = req.query;
        const query = {};
        if (type)
            query.type = type;
        if (isActive !== undefined)
            query.isActive = isActive === 'true';
        const contents = await Content_model_1.default.find(query)
            .populate('createdBy', 'name email')
            .sort({ order: 1, createdAt: -1 });
        res.status(200).json({
            success: true,
            data: { contents },
        });
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.getAllContent = getAllContent;
// Get Active Content (Public)
const getActiveContent = async (req, res, next) => {
    try {
        const { type } = req.query;
        const query = { isActive: true };
        if (type)
            query.type = type;
        const contents = await Content_model_1.default.find(query)
            .select('-createdBy')
            .sort({ order: 1 });
        res.status(200).json({
            success: true,
            data: { contents },
        });
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.getActiveContent = getActiveContent;
// Update Content
const updateContent = async (req, res, next) => {
    try {
        const { contentId } = req.params;
        const updateData = req.body;
        const content = await Content_model_1.default.findByIdAndUpdate(contentId, updateData, { new: true, runValidators: true });
        if (!content) {
            return next(new errorHandler_middleware_1.AppError('Content not found', 404));
        }
        res.status(200).json({
            success: true,
            data: { content },
        });
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.updateContent = updateContent;
// Delete Content
const deleteContent = async (req, res, next) => {
    try {
        const { contentId } = req.params;
        const content = await Content_model_1.default.findByIdAndDelete(contentId);
        if (!content) {
            return next(new errorHandler_middleware_1.AppError('Content not found', 404));
        }
        res.status(200).json({
            success: true,
            message: 'Content deleted successfully',
        });
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.deleteContent = deleteContent;
//# sourceMappingURL=content.controller.js.map