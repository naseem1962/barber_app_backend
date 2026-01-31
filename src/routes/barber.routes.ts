import { Router } from 'express';
import {
  registerBarber,
  loginBarber,
  getCurrentBarber,
  updateBarberProfile,
  getAllBarbers,
  getBarberById,
} from '../controllers/barber.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', registerBarber);
router.post('/login', loginBarber);
router.get('/me', authenticate, getCurrentBarber);
router.put('/profile', authenticate, updateBarberProfile);
router.get('/all', getAllBarbers);
router.get('/:id', getBarberById);

export default router;
