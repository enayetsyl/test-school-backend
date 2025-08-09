// src/models/Competency.ts
import { Schema, model } from 'mongoose';
const CompetencySchema = new Schema({
    code: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 50 },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 150 },
    description: { type: String, trim: true, maxlength: 1000 },
}, { timestamps: true });
// Helpful indexes for admin search
CompetencySchema.index({ name: 1 });
CompetencySchema.index({ name: 'text', description: 'text' });
export const Competency = model('Competency', CompetencySchema);
