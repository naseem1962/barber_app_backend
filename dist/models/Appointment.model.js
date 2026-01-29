"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const appointmentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    barber: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Barber',
        required: true,
    },
    service: {
        name: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
    },
    appointmentDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'],
        default: 'pending',
    },
    notes: {
        type: String,
    },
    noShowProbability: {
        type: Number,
        min: 0,
        max: 100,
    },
    reminderSent: {
        type: Boolean,
        default: false,
    },
    confirmationReceived: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// Indexes
appointmentSchema.index({ user: 1, appointmentDate: 1 });
appointmentSchema.index({ barber: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });
exports.default = mongoose_1.default.model('Appointment', appointmentSchema);
//# sourceMappingURL=Appointment.model.js.map