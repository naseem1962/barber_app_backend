import { Router } from 'express';
import {
  createAppointment,
  getUserAppointments,
  getBarberAppointments,
  updateAppointmentStatus,
  saveCustomerHistory,
  getCustomerHistory,
  getAvailability,
} from '../controllers/appointment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/availability', getAvailability);
router.post('/', authenticate, createAppointment);
router.get('/user', authenticate, getUserAppointments);
router.get('/barber', authenticate, getBarberAppointments);
router.put('/:appointmentId/status', authenticate, updateAppointmentStatus);
router.post('/history', authenticate, saveCustomerHistory);
router.get('/history/:userId', authenticate, getCustomerHistory);

export default router;
