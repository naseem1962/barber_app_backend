"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_controller_1 = require("../controllers/ai.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/hairstyle-recommendation', auth_middleware_1.authenticate, ai_controller_1.getHairstyleRecommendation);
router.get('/predict-no-show/:appointmentId', auth_middleware_1.authenticate, ai_controller_1.predictNoShow);
router.post('/pricing-recommendation', auth_middleware_1.authenticate, ai_controller_1.getPricingRecommendation);
router.get('/business-insights', auth_middleware_1.authenticate, ai_controller_1.getBusinessInsights);
exports.default = router;
//# sourceMappingURL=ai.routes.js.map