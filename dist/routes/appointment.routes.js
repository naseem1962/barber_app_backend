"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointment_controller_1 = require("../controllers/appointment.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/', auth_middleware_1.authenticate, appointment_controller_1.createAppointment);
router.get('/user', auth_middleware_1.authenticate, appointment_controller_1.getUserAppointments);
router.get('/barber', auth_middleware_1.authenticate, appointment_controller_1.getBarberAppointments);
router.put('/:appointmentId/status', auth_middleware_1.authenticate, appointment_controller_1.updateAppointmentStatus);
router.post('/history', auth_middleware_1.authenticate, appointment_controller_1.saveCustomerHistory);
router.get('/history/:userId', auth_middleware_1.authenticate, appointment_controller_1.getCustomerHistory);
exports.default = router;
//# sourceMappingURL=appointment.routes.js.map