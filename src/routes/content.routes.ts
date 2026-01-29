import { Router } from 'express';
import {
  createContent,
  getAllContent,
  getActiveContent,
  updateContent,
  deleteContent,
} from '../controllers/content.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/active', getActiveContent);

// Admin routes
router.post('/', authenticate, authorize('admin', 'super_admin'), createContent);
router.get('/', authenticate, authorize('admin', 'super_admin'), getAllContent);
router.put('/:contentId', authenticate, authorize('admin', 'super_admin'), updateContent);
router.delete('/:contentId', authenticate, authorize('admin', 'super_admin'), deleteContent);

export default router;
