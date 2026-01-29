import { Router } from 'express';
import {
  getOrCreateChat,
  sendMessage,
  getChatMessages,
  getUserChats,
  markAsRead,
} from '../controllers/chat.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getOrCreateChat);
router.post('/message', authenticate, sendMessage);
router.get('/:chatId/messages', authenticate, getChatMessages);
router.get('/user/chats', authenticate, getUserChats);
router.put('/:chatId/read', authenticate, markAsRead);

export default router;
