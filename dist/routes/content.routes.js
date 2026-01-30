"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const content_controller_1 = require("../controllers/content.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/active', content_controller_1.getActiveContent);
// Admin routes
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'super_admin'), content_controller_1.createContent);
router.get('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'super_admin'), content_controller_1.getAllContent);
router.put('/:contentId', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'super_admin'), content_controller_1.updateContent);
router.delete('/:contentId', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'super_admin'), content_controller_1.deleteContent);
exports.default = router;
//# sourceMappingURL=content.routes.js.map