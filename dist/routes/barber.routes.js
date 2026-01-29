"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const barber_controller_1 = require("../controllers/barber.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/register', barber_controller_1.registerBarber);
router.post('/login', barber_controller_1.loginBarber);
router.get('/me', auth_middleware_1.authenticate, barber_controller_1.getCurrentBarber);
router.put('/profile', auth_middleware_1.authenticate, barber_controller_1.updateBarberProfile);
router.get('/all', barber_controller_1.getAllBarbers);
exports.default = router;
//# sourceMappingURL=barber.routes.js.map