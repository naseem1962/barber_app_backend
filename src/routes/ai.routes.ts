import { Router } from 'express';
import {
  getHairstyleRecommendation,
  predictNoShow,
  getPricingRecommendation,
  getBusinessInsights,
} from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/hairstyle-recommendation', authenticate, getHairstyleRecommendation);
router.get('/predict-no-show/:appointmentId', authenticate, predictNoShow);
router.post('/pricing-recommendation', authenticate, getPricingRecommendation);
router.get('/business-insights', authenticate, getBusinessInsights);

export default router;
