import { Router } from 'express';
import {
  registerBarber,
  loginBarber,
  getCurrentBarber,
  updateBarberProfile,
  getAllBarbers,
} from '../controllers/barber.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', registerBarber);
router.post('/login', loginBarber);
router.get('/me', authenticate, getCurrentBarber);
router.put('/profile', authenticate, updateBarberProfile);
router.get('/all', getAllBarbers);

export default router;
