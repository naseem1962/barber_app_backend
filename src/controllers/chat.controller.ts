import { Response, NextFunction } from 'express';
import Chat from '../models/Chat.model';
import { AppError } from '../middleware/errorHandler.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

// Create or Get Chat
export const getOrCreateChat = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, barberId } = req.query;

    let chat;
    if (req.userType === 'user') {
      chat = await Chat.findOne({
        'participants.user': req.user._id,
        'participants.barber': barberId,
      });
    } else if (req.userType === 'barber') {
      chat = await Chat.findOne({
        'participants.user': userId,
        'participants.barber': req.user._id,
      });
    }

    if (!chat) {
      chat = await Chat.create({
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
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Send Message
export const sendMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { chatId, content, messageType } = req.body;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return next(new AppError('Chat not found', 404));
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
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Get Chat Messages
export const getChatMessages = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId)
      .populate('participants.user', 'name profileImage')
      .populate('participants.barber', 'name profileImage shopName');

    if (!chat) {
      return next(new AppError('Chat not found', 404));
    }

    res.status(200).json({
      success: true,
      data: { chat },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Get User Chats
export const getUserChats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let query: any = {};

    if (req.userType === 'user') {
      query['participants.user'] = req.user._id;
    } else if (req.userType === 'barber') {
      query['participants.barber'] = req.user._id;
    }

    const chats = await Chat.find(query)
      .populate('participants.user', 'name profileImage')
      .populate('participants.barber', 'name profileImage shopName')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: { chats },
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};

// Mark Messages as Read
export const markAsRead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return next(new AppError('Chat not found', 404));
    }

    // Mark all messages from other participants as read
    chat.messages.forEach((msg: any) => {
      if (
        msg.sender.toString() !== req.user._id.toString() &&
        !msg.read
      ) {
        msg.read = true;
      }
    });

    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Messages marked as read',
    });
  } catch (error: any) {
    next(new AppError(error.message, 400));
  }
};
