"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import routes
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const barber_routes_1 = __importDefault(require("./routes/barber.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const appointment_routes_1 = __importDefault(require("./routes/appointment.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const ai_routes_1 = __importDefault(require("./routes/ai.routes"));
const content_routes_1 = __importDefault(require("./routes/content.routes"));
// Import middleware
const errorHandler_middleware_1 = require("./middleware/errorHandler.middleware");
const notFound_middleware_1 = require("./middleware/notFound.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [
        process.env.USER_WEB_URL || 'http://localhost:3000',
        process.env.BARBER_WEB_URL || 'http://localhost:4200',
        process.env.ADMIN_DASHBOARD_URL || 'http://localhost:3001',
    ],
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});
// API Routes
app.use('/api/users', user_routes_1.default);
app.use('/api/barbers', barber_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/appointments', appointment_routes_1.default);
app.use('/api/chat', chat_routes_1.default);
app.use('/api/ai', ai_routes_1.default);
app.use('/api/content', content_routes_1.default);
// No Socket.IO on Vercel - chat controller checks req.app.get('io') before emitting
app.set('io', null);
// Error handling middleware
app.use(notFound_middleware_1.notFound);
app.use(errorHandler_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map