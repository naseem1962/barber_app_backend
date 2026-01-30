"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = require("../controllers/chat.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authenticate, chat_controller_1.getOrCreateChat);
router.post('/message', auth_middleware_1.authenticate, chat_controller_1.sendMessage);
router.get('/:chatId/messages', auth_middleware_1.authenticate, chat_controller_1.getChatMessages);
router.get('/user/chats', auth_middleware_1.authenticate, chat_controller_1.getUserChats);
router.put('/:chatId/read', auth_middleware_1.authenticate, chat_controller_1.markAsRead);
exports.default = router;
//# sourceMappingURL=chat.routes.js.map