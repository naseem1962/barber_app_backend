"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/register', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'super_admin'), admin_controller_1.registerAdmin);
router.post('/login', admin_controller_1.loginAdmin);
router.get('/dashboard/stats', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'super_admin'), admin_controller_1.getDashboardStats);
router.get('/users', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'super_admin'), admin_controller_1.getAllUsers);
router.get('/barbers', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'super_admin'), admin_controller_1.getAllBarbers);
router.put('/barbers/:barberId/verify', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)('admin', 'super_admin'), admin_controller_1.verifyBarber);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map