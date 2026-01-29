import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
} from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authenticate, getCurrentUser);
router.put('/profile', authenticate, updateUserProfile);

export default router;
