"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.getUserChats = exports.getChatMessages = exports.sendMessage = exports.getOrCreateChat = void 0;
const Chat_model_1 = __importDefault(require("../models/Chat.model"));
const errorHandler_middleware_1 = require("../middleware/errorHandler.middleware");
// Create or Get Chat
const getOrCreateChat = async (req, res, next) => {
    try {
        const { userId, barberId } = req.query;
        let chat;
        if (req.userType === 'user') {
            chat = await Chat_model_1.default.findOne({
                'participants.user': req.user._id,
                'participants.barber': barberId,
            });
        }
        else if (req.userType === 'barber') {
            chat = await Chat_model_1.default.findOne({
                'participants.user': userId,
                'participants.barber': req.user._id,
            });
        }
        if (!chat) {
            chat = await Chat_model_1.default.create({
                participants: {
                    user: userId || req.user._id,
                    barber: barberId || req.user._id,
                },
                messages: [],
            });
        }
        res.status(200).json({
            success: true,
            data: { chat },
        });
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.getOrCreateChat = getOrCreateChat;
// Send Message
const sendMessage = async (req, res, next) => {
    try {
        const { chatId, content, messageType } = req.body;
        const chat = await Chat_model_1.default.findById(chatId);
        if (!chat) {
            return next(new errorHandler_middleware_1.AppError('Chat not found', 404));
        }
        const message = {
            sender: req.user._id,
            senderType: req.userType || 'user',
            content,
            messageType: messageType || 'text',
            read: false,
            createdAt: new Date(),
        };
        chat.messages.push(message);
        chat.lastMessage = {
            content,
            createdAt: new Date(),
        };
        await chat.save();
        // Emit socket event
        const io = req.app.get('io');
        if (io) {
            io.to(chatId).emit('new-message', message);
        }
        res.status(200).json({
            success: true,
            data: { message },
        });
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.sendMessage = sendMessage;
// Get Chat Messages
const getChatMessages = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const chat = await Chat_model_1.default.findById(chatId)
            .populate('participants.user', 'name profileImage')
            .populate('participants.barber', 'name profileImage shopName');
        if (!chat) {
            return next(new errorHandler_middleware_1.AppError('Chat not found', 404));
        }
        res.status(200).json({
            success: true,
            data: { chat },
        });
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.getChatMessages = getChatMessages;
// Get User Chats
const getUserChats = async (req, res, next) => {
    try {
        let query = {};
        if (req.userType === 'user') {
            query['participants.user'] = req.user._id;
        }
        else if (req.userType === 'barber') {
            query['participants.barber'] = req.user._id;
        }
        const chats = await Chat_model_1.default.find(query)
            .populate('participants.user', 'name profileImage')
            .populate('participants.barber', 'name profileImage shopName')
            .sort({ updatedAt: -1 });
        res.status(200).json({
            success: true,
            data: { chats },
        });
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.getUserChats = getUserChats;
// Mark Messages as Read
const markAsRead = async (req, res, next) => {
    try {
        const { chatId } = req.params;
        const chat = await Chat_model_1.default.findById(chatId);
        if (!chat) {
            return next(new errorHandler_middleware_1.AppError('Chat not found', 404));
        }
        // Mark all messages from other participants as read
        chat.messages.forEach((msg) => {
            if (msg.sender.toString() !== req.user._id.toString() &&
                !msg.read) {
                msg.read = true;
            }
        });
        await chat.save();
        res.status(200).json({
            success: true,
            message: 'Messages marked as read',
        });
    }
    catch (error) {
        next(new errorHandler_middleware_1.AppError(error.message, 400));
    }
};
exports.markAsRead = markAsRead;
//# sourceMappingURL=chat.controller.js.map