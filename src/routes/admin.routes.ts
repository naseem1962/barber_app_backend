import { Router } from 'express';
import {
  registerAdmin,
  loginAdmin,
  getDashboardStats,
  getAllUsers,
  getAllBarbers,
  verifyBarber,
} from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', authenticate, authorize('admin', 'super_admin'), registerAdmin);
router.post('/login', loginAdmin);
router.get('/dashboard/stats', authenticate, authorize('admin', 'super_admin'), getDashboardStats);
router.get('/users', authenticate, authorize('admin', 'super_admin'), getAllUsers);
router.get('/barbers', authenticate, authorize('admin', 'super_admin'), getAllBarbers);
router.put('/barbers/:barberId/verify', authenticate, authorize('admin', 'super_admin'), verifyBarber);

export default router;
