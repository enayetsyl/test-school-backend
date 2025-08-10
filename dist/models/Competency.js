"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Competency = void 0;
// src/models/Competency.ts
const mongoose_1 = require("mongoose");
const CompetencySchema = new mongoose_1.Schema({
    code: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 50 },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 1000 },
}, { timestamps: true });
// Helpful indexes for admin search
CompetencySchema.index({ name: 1 });
CompetencySchema.index({ name: 'text', description: 'text' });
exports.Competency = (0, mongoose_1.model)('Competency', CompetencySchema);
